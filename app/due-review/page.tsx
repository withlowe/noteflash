"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, BarChart, Brain, CheckCircle, AlertTriangle } from "lucide-react"
import type { Flashcard } from "@/lib/types"
import { getFlashcards } from "@/lib/storage"
import FlashcardReview from "@/components/flashcard-review"

export default function ReviewPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([])
  const [reviewMode, setReviewMode] = useState(false)
  const [stats, setStats] = useState({
    totalCards: 0,
    dueCards: 0,
    reviewedToday: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    dueByTag: {} as Record<string, number>,
  })

  useEffect(() => {
    const cards = getFlashcards()
    setFlashcards(cards)

    const due = cards.filter((card) => new Date(card.nextReview) <= new Date())
    setDueFlashcards(due)

    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const reviewedToday = cards.filter((card) => new Date(card.lastReviewed) >= today).length

    const masteredCards = cards.filter((card) => card.easeFactor >= 2.5 && card.interval > 7).length
    const learningCards = cards.filter((card) => card.interval > 0 && card.interval <= 7).length
    const newCards = cards.filter((card) => card.interval === 0).length

    // Calculate due cards by tag
    const dueByTag: Record<string, number> = {}
    due.forEach((card) => {
      card.tags.forEach((tag) => {
        dueByTag[tag] = (dueByTag[tag] || 0) + 1
      })
    })

    setStats({
      totalCards: cards.length,
      dueCards: due.length,
      reviewedToday,
      masteredCards,
      learningCards,
      newCards,
      dueByTag,
    })
  }, [])

  // Calculate upcoming reviews
  const upcomingReviews = () => {
    const upcoming: Record<string, number> = {
      Today: dueFlashcards.length,
      Tomorrow: 0,
      "This week": 0,
      Later: 0,
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59, 999)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(23, 59, 59, 999)

    flashcards.forEach((card) => {
      const reviewDate = new Date(card.nextReview)
      if (reviewDate <= new Date()) {
        // Already counted in "Today"
      } else if (reviewDate <= tomorrow) {
        upcoming["Tomorrow"]++
      } else if (reviewDate <= nextWeek) {
        upcoming["This week"]++
      } else {
        upcoming["Later"]++
      }
    })

    return upcoming
  }

  const upcoming = upcomingReviews()

  // Calculate retention rate (simplified)
  const retentionRate = stats.totalCards > 0 ? Math.round((stats.masteredCards / stats.totalCards) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review</h1>
        <p className="text-muted-foreground text-base mb-6">Track your progress and review due flashcards</p>
      </div>

      {reviewMode ? (
        <FlashcardReview flashcards={dueFlashcards} onComplete={() => setReviewMode(false)} />
      ) : (
        <div className="space-y-6">
          {/* Review summary card */}
          <Card className="bg-primary/2 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex justify-between items-center">
                <span>Review Summary</span>
                {stats.dueCards > 0 && <Button onClick={() => setReviewMode(true)}>Start Review</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due for review</p>
                    <p className="text-2xl font-bold">{stats.dueCards}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed today</p>
                    <p className="text-2xl font-bold">{stats.reviewedToday}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Brain className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention rate</p>
                    <p className="text-2xl font-bold">{retentionRate}%</p>
                  </div>
                </div>
              </div>

              {stats.dueCards > 0 ? (
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm mb-2">
                    You have <span className="font-medium">{stats.dueCards} cards</span> due for review today.
                  </p>
                  <Button variant="default" size="sm" className="w-full" onClick={() => setReviewMode(true)}>
                    Start Review Session
                  </Button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    All caught up! No cards due for review.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mastered</span>
                      <span>{stats.masteredCards} cards</span>
                    </div>
                    <Progress value={(stats.masteredCards / stats.totalCards) * 100 || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Learning</span>
                      <span>{stats.learningCards} cards</span>
                    </div>
                    <Progress value={(stats.learningCards / stats.totalCards) * 100 || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>New</span>
                      <span>{stats.newCards} cards</span>
                    </div>
                    <Progress value={(stats.newCards / stats.totalCards) * 100 || 0} className="h-2" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-base font-medium mb-2">Total Flashcards</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.totalCards}</span>
                    <Button variant="outline" size="sm" onClick={() => router.push("/flashcards")}>
                      View All Flashcards
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Upcoming Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(upcoming).map(([period, count]) => (
                    <div key={period} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                      <div className="flex items-center">
                        {period === "Today" ? (
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                        ) : period === "Tomorrow" ? (
                          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                        ) : (
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        <span>{period}</span>
                      </div>
                      <Badge variant={period === "Today" ? "default" : "secondary"}>{count} cards</Badge>
                    </div>
                  ))}
                </div>

                {Object.keys(stats.dueByTag).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-base font-medium mb-2">Due by Tag</h4>
                    <div className="space-y-2">
                      {Object.entries(stats.dueByTag)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([tag, count]) => (
                          <div key={tag} className="flex justify-between items-center">
                            <Badge variant="outline">{tag}</Badge>
                            <span className="text-sm">{count} due</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <Brain className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Spaced Repetition</h4>
                    <p className="text-sm text-muted-foreground">
                      Review cards just before you're likely to forget them to strengthen memory.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-green-500/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Consistent Practice</h4>
                    <p className="text-sm text-muted-foreground">
                      Short, daily review sessions are more effective than cramming.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Active Recall</h4>
                    <p className="text-sm text-muted-foreground">
                      Test yourself rather than passively reviewing information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" onClick={() => router.push("/quiz")}>
                <BarChart className="mr-2 h-4 w-4" />
                Take a Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
