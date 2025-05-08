"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, LinkIcon } from "lucide-react"
import type { Note } from "@/lib/types"
import { getNotes } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotesListProps {
  selectedTags?: string[]
}

export default function NotesList({ selectedTags = [] }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredNotes(notes)
    } else {
      setFilteredNotes(notes.filter((note) => selectedTags.every((tag) => note.tags.includes(tag))))
    }
  }, [notes, selectedTags])

  const navigateToNewNote = () => {
    window.location.href = "/create-note"
  }

  const navigateToNote = (id: string) => {
    window.location.href = `/notes/${id}`
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-6">Create your first note to get started</p>
        <Button onClick={navigateToNewNote}>Create a new note</Button>
      </div>
    )
  }

  if (filteredNotes.length === 0 && selectedTags.length > 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <h3 className="text-xl font-medium mb-2">No notes match the selected tags</h3>
        <p className="text-muted-foreground mb-4">Try selecting different tags or clear the filter</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear filters
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredNotes.map((note) => (
        <Card
          key={note.id}
          className="overflow-hidden border hover:border-primary/50 transition-colors h-full cursor-pointer"
          onClick={() => navigateToNote(note.id)}
        >
          <CardContent className="p-4">
            <h3 className="text-xl font-medium mb-2 hover:underline">{note.title}</h3>
            {note.reference && (
              <div className="flex items-start text-sm text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 mr-1 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{note.reference}</span>
              </div>
            )}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs uppercase">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
