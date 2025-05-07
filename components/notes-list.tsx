"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Edit, FileText } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import type { Note } from "@/lib/types"
import { getNotes } from "@/lib/storage"
import { Button } from "@/components/ui/button"

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

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No notes yet</h3>
        <p className="text-muted-foreground mb-6">Create your first note to get started</p>
        <Button asChild>
          <Link href="/notes/new">Create a new note</Link>
        </Button>
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
          className="overflow-hidden border hover:border-primary/50 transition-colors h-full flex flex-col"
        >
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/notes/${note.id}`} className="hover:underline">
                <h3 className="text-xl font-medium line-clamp-1">{note.title}</h3>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href={`/notes/${note.id}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-base line-clamp-3 mb-3">{note.summary}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 px-4 pb-4 text-sm text-muted-foreground border-t mt-auto">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formatDistanceToNow(note.updatedAt)}
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
