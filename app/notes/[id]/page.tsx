"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash, Wand2, ExternalLink } from "lucide-react"
import type { Note } from "@/lib/types"
import { getNote, deleteNote, createFlashcard } from "@/lib/storage"
import { formatDate } from "@/lib/utils"
import { parseMarkdown } from "@/lib/markdown-utils"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [markdownSections, setMarkdownSections] = useState<{ heading: string; content: string }[]>([])
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false)

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
            <Button size="sm" onClick={generateFlashcards} disabled={isGeneratingFlashcards}>
              <Wand2 className="mr-1 h-4 w-4" />
              Generate Flashcards
            </Button>
          </div>
        </div>
      </div>

      {/* Note Content */}
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
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
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

      {/* Summary */}
      {note.summary && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <h2 className="text-sm font-medium mb-1">Summary</h2>
            <div className="whitespace-pre-wrap text-sm">{note.summary}</div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-medium mb-1">Last Updated</h2>
              <p className="text-sm text-muted-foreground">{formatDate(note.updatedAt)}</p>
            </div>

            {note.tags.length > 0 && (
              <div>
                <h2 className="text-sm font-medium mb-1">Tags</h2>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {note.reference && (
              <div>
                <h2 className="text-sm font-medium mb-1">Reference</h2>
                <div className="text-sm flex items-center">
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
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
