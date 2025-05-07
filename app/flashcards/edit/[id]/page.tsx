"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save, ArrowLeft } from "lucide-react"
import type { Flashcard } from "@/lib/types"
import { getFlashcard, updateFlashcard } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

export default function EditFlashcardPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchedCard = getFlashcard(params.id)
    if (fetchedCard) {
      setFlashcard(fetchedCard)
      setFront(fetchedCard.front)
      setBack(fetchedCard.back)
      setTags(fetchedCard.tags)
    } else {
      toast({
        title: "Flashcard not found",
        description: "The flashcard you're trying to edit doesn't exist",
        variant: "destructive",
      })
      router.push("/flashcards")
    }
    setIsLoading(false)
  }, [params.id, router])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = () => {
    if (!front.trim() || !back.trim() || !flashcard) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both front and back of the flashcard",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Update the flashcard
      updateFlashcard(params.id, {
        front,
        back,
        tags,
      })

      // Show success message
      toast({
        title: "Flashcard updated",
        description: "Your flashcard has been updated successfully",
      })

      // Navigate back to flashcards
      router.push("/flashcards")
    } catch (error) {
      console.error("Error updating flashcard:", error)
      toast({
        title: "Error",
        description: "Failed to update flashcard. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!flashcard) {
    return <div className="container mx-auto px-4 py-8">Flashcard not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/flashcards" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to flashcards
        </Link>
        <h1 className="text-3xl font-bold">Edit Flashcard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flashcard Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Front (Question)</label>
            <Textarea
              placeholder="Enter the question or prompt"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Back (Answer)</label>
            <Textarea
              placeholder="Enter the answer or explanation"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="p-3 bg-muted/30 rounded-md mb-2 min-h-[60px]">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center bg-secondary rounded-md px-3 py-1.5 text-sm">
                    <span className="mr-2">{tag}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-muted-foreground text-sm">No tags added yet. Add tags below.</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/flashcards")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting || !front.trim() || !back.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
