"use client"

import { PlusCircle, Book, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getAllTags } from "@/lib/storage"
import { ImportExport } from "@/components/import-export"
import { Badge } from "@/components/ui/badge"

export function SidebarContent({ className = "" }: { className?: string }) {
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    setTags(getAllTags())
  }, [])

  const navigateToNewNote = () => {
    window.location.href = "/create-note"
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={navigateToNewNote}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Note
        </Button>
        <ImportExport />
      </div>

      <div>
        <h2 className="text-base font-medium mb-3 flex items-center">
          <Book className="mr-2 h-4 w-4" />
          Navigation
        </h2>
        <nav className="space-y-1">
          <a href="/" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary">
            All Notes
          </a>
          <a href="/flashcards" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary">
            Flashcards
          </a>
          <a href="/due-review" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary">
            Review
          </a>
          <a href="/quiz" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-secondary">
            Quiz
          </a>
        </nav>
      </div>

      <div>
        <h2 className="text-base font-medium mb-3 flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          Tags
        </h2>
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary/80">
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && <span className="text-sm text-muted-foreground">No tags yet</span>}
        </div>
      </div>
    </div>
  )
}
