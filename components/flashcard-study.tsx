"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react"
import type { Flashcard } from "@/lib/types"

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Study Flashcards</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onComplete}>
            <X className="mr-1 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="text-sm text-muted-foreground">
          {remainingCards} card{remainingCards !== 1 ? "s" : ""} remaining
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="min-h-[200px] flex flex-col justify-center">
            <h3 className="text-xl font-medium mb-6 text-center">{currentCard.front}</h3>

            {showAnswer ? (
              <div className="border-t pt-6 mt-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentCard.back }} />
                </div>
              </div>
            ) : (
              <div className="text-center mt-auto">
                <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          {studiedCards.has(currentCard.id) ? "Next" : "Mark as Studied"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
