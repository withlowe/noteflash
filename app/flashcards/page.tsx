"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Tag, Edit, Clock, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Flashcard } from "@/lib/types"
import { getFlashcards, getAllTags, deleteFlashcard } from "@/lib/storage"
import FlashcardReview from "@/components/flashcard-review"
import { toast } from "@/components/ui/use-toast"
import FlashcardStudy from "@/components/flashcard-study"

export default function FlashcardsPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([])
  const [reviewMode, setReviewMode] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    loadFlashcards()
    setAllTags(getAllTags())
  }, [])

  const loadFlashcards = () => {
    const cards = getFlashcards()
    setFlashcards(cards)
    setFilteredFlashcards(cards)
  }

  useEffect(() => {
    let filtered = [...flashcards]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (card) => card.front.toLowerCase().includes(query) || card.back.toLowerCase().includes(query),
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((card) => selectedTags.every((tag) => card.tags.includes(tag)))
    }

    setFilteredFlashcards(filtered)
  }, [flashcards, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
  }

  const handleEditFlashcard = (id: string) => {
    router.push(`/flashcards/edit/${id}`)
  }

  const handleDeleteFlashcard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      try {
        deleteFlashcard(id)
        toast({
          title: "Flashcard deleted",
          description: "The flashcard has been deleted successfully",
        })
        loadFlashcards()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete flashcard",
          variant: "destructive",
        })
      }
    }
  }

  const dueFlashcards = filteredFlashcards.filter((card) => new Date(card.nextReview) <= new Date())

  // Function to strip HTML tags for display in the card list
  const stripHtml = (html: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
        <p className="text-muted-foreground text-base mb-6">Review your flashcards using spaced repetition</p>
      </div>

      {reviewMode ? (
        <FlashcardReview
          flashcards={dueFlashcards.length > 0 ? dueFlashcards : []}
          onComplete={() => setReviewMode(false)}
        />
      ) : studyMode ? (
        <FlashcardStudy
          flashcards={filteredFlashcards.length > 0 ? filteredFlashcards : []}
          onComplete={() => setStudyMode(false)}
        />
      ) : (
        <>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search flashcards..."
                  className="pl-8 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {allTags.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Tag className="mr-2 h-4 w-4" />
                        Filter by Tag
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                      {allTags.map((tag) => (
                        <DropdownMenuCheckboxItem
                          key={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                          className="uppercase"
                        >
                          {tag}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button onClick={() => setStudyMode(true)} disabled={filteredFlashcards.length === 0}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Cards ({filteredFlashcards.length})
                </Button>
                <Button onClick={() => setReviewMode(true)} disabled={dueFlashcards.length === 0}>
                  <Clock className="mr-2 h-4 w-4" />
                  Review Due ({dueFlashcards.length})
                </Button>
              </div>
            </div>

            {(selectedTags.length > 0 || searchQuery) && (
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium mr-1">Filtered by:</span>
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 uppercase"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80"
                      onClick={() => setSearchQuery("")}
                    >
                      "{searchQuery}" ×
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlashcards.map((card) => (
              <Card
                key={card.id}
                className={`h-full flex flex-col ${new Date(card.nextReview) <= new Date() ? "border-primary" : ""}`}
              >
                <CardContent className="p-4 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium">{card.front}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditFlashcard(card.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </div>
                  <div className="text-base text-muted-foreground line-clamp-3">{stripHtml(card.back)}</div>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 uppercase">
                        {tag}
                      </Badge>
                    ))}
                    {card.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{card.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(card.nextReview) <= new Date()
                      ? "Due now"
                      : new Date(card.nextReview).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredFlashcards.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No flashcards found</h3>
              {flashcards.length === 0 ? (
                <p className="text-muted-foreground mb-4">Create flashcards from your notes to get started</p>
              ) : (
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
