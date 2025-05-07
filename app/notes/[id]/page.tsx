"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash, Wand2, ExternalLink, Plus } from "lucide-react"
import type { Note } from "@/lib/types"
import { getNote, deleteNote, createFlashcard, createIndexEntry } from "@/lib/storage"
import { formatDate } from "@/lib/utils"
import { parseMarkdown } from "@/lib/markdown-utils"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [markdownSections, setMarkdownSections] = useState<{ heading: string; content: string }[]>([])
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false)
  const [isAddingToIndex, setIsAddingToIndex] = useState(false)

  useEffect(() => {
    try {
      const fetchedNote = getNote(params.id)
      if (fetchedNote) {
        setNote(fetchedNote)
        setMarkdownSections(parseMarkdown(fetchedNote.notes))
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching note:", error)
      toast({
        title: "Error",
        description: "Failed to load note. Please try again.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [params.id, router])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        deleteNote(params.id)
        router.push("/")
      } catch (error) {
        console.error("Error deleting note:", error)
        toast({
          title: "Error",
          description: "Failed to delete note. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const generateFlashcards = () => {
    if (!note || markdownSections.length === 0) {
      toast({
        title: "Cannot generate flashcards",
        description: "This note doesn't have any sections to generate flashcards from.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGeneratingFlashcards(true)

      // Create a flashcard for each section
      let flashcardsCreated = 0
      markdownSections.forEach((section) => {
        if (section.heading && section.content.trim()) {
          createFlashcard({
            front: section.heading,
            back: section.content.trim(),
            noteId: params.id,
            tags: note.tags,
          })
          flashcardsCreated++
        }
      })

      if (flashcardsCreated > 0) {
        toast({
          title: "Flashcards generated",
          description: `Successfully created ${flashcardsCreated} flashcards from your note sections.`,
        })
      } else {
        toast({
          title: "No flashcards created",
          description: "Could not create flashcards. Make sure your note has headings and content.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating flashcards:", error)
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingFlashcards(false)
    }
  }

  const addToIndex = () => {
    if (!note) return

    try {
      setIsAddingToIndex(true)

      // Create an index entry from the note
      createIndexEntry({
        title: note.title,
        reference: note.reference || "From note",
        description: note.summary || note.notes.substring(0, 200) + (note.notes.length > 200 ? "..." : ""),
        tags: note.tags,
      })

      toast({
        title: "Added to index",
        description: "Note has been added to the reference index",
      })
    } catch (error) {
      console.error("Error adding to index:", error)
      toast({
        title: "Error",
        description: "Failed to add note to index. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToIndex(false)
    }
  }

  if (!note) {
    return <div className="container mx-auto px-4 py-4">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to notes
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl font-bold">{note.title}</h1>
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/notes/${params.id}/edit`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash className="mr-1 h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={addToIndex} disabled={isAddingToIndex}>
              <Plus className="mr-1 h-4 w-4" />
              Add to Index
            </Button>
            <Button size="sm" onClick={generateFlashcards} disabled={isGeneratingFlashcards}>
              <Wand2 className="mr-1 h-4 w-4" />
              Generate Flashcards
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-1">Last updated: {formatDate(note.updatedAt)}</p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {note.reference && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground mr-1">Reference:</span>
            <span className="flex items-center">
              {note.reference}
              {note.reference.startsWith("http") && (
                <a
                  href={note.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </span>
          </div>
        )}
      </div>

      <Card className="mb-4">
        <CardContent className="p-0">
          {markdownSections.length > 0 ? (
            <div className="divide-y">
              {markdownSections.map((section, index) => (
                <div key={index} className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 p-3 bg-muted/30">
                    <h3 className="font-medium">{section.heading}</h3>
                  </div>
                  <div className="lg:w-2/3 p-3">
                    <div className="prose dark:prose-invert max-w-none prose-sm">
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              This note has no content sections. Edit the note to add content with markdown headings.
            </div>
          )}
        </CardContent>
      </Card>

      {note.summary && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <h2 className="text-sm font-medium mb-1">Summary</h2>
            <div className="whitespace-pre-wrap text-sm">{note.summary}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
