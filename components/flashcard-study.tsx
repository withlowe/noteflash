"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react"
import type { Flashcard } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface FlashcardStudyProps {
  flashcards: Flashcard[]
  onComplete: () => void
}

export default function FlashcardStudy({ flashcards, onComplete }: FlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set())

  // Safety check to prevent errors when flashcards array is empty
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No flashcards available</h3>
        <Button onClick={onComplete}>Return to Flashcards</Button>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]
  const totalCards = flashcards.length
  const remainingCards = totalCards - studiedCards.size
  const progressPercentage = (studiedCards.size / totalCards) * 100

  const handleNext = () => {
    if (!currentCard) return

    // Mark current card as studied
    setStudiedCards((prev) => {
      const updated = new Set(prev)
      updated.add(currentCard.id)
      return updated
    })

    setShowAnswer(false)

    // Find the next card that hasn't been studied yet
    let nextIndex = (currentIndex + 1) % totalCards
    let loopCount = 0

    // If we've studied all cards, just go to the next one
    if (studiedCards.size >= totalCards - 1) {
      setCurrentIndex(nextIndex)
      return
    }

    // Otherwise, find the next unstudied card
    while (studiedCards.has(flashcards[nextIndex].id) && loopCount < totalCards) {
      nextIndex = (nextIndex + 1) % totalCards
      loopCount++
    }

    setCurrentIndex(nextIndex)
  }

  const handlePrevious = () => {
    setShowAnswer(false)
    setCurrentIndex((currentIndex - 1 + totalCards) % totalCards)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setStudiedCards(new Set())
  }

  // Additional safety check
  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">Error loading flashcard</h3>
        <Button onClick={onComplete}>Return to Flashcards</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with progress */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8">
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={onComplete} className="h-8">
            <X className="mr-1 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>

      <Progress value={progressPercentage} className="h-2 mb-6" />

      {/* Flashcard */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="min-h-[150px] flex items-center justify-center">
            <h3 className="text-xl font-medium text-center">{currentCard.front}</h3>
          </div>

          {showAnswer && (
            <div className="border-t pt-6 mt-6">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentCard.back }} />
              </div>

              {/* Card tags */}
              {currentCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {currentCard.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs uppercase">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {!showAnswer && (
          <CardFooter className="p-6 pt-0 flex justify-center">
            <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
          </CardFooter>
        )}
      </Card>

      {/* Navigation controls */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          {studiedCards.has(currentCard.id) ? "Next" : "Mark as Studied"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
