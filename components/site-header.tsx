"use client"

import { useState } from "react"
import { PlusCircle, Menu, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ImportExport } from "@/components/import-export"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <div className="flex flex-col gap-6 py-6">
                <a href="/" className="text-xl font-bold flex items-center" onClick={closeMenu}>
                  <Book className="mr-2 h-5 w-5" />
                  Super Learn
                </a>
                <nav className="flex flex-col gap-4">
                  <a
                    href="/"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Notes
                  </a>
                  <a
                    href="/flashcards"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Flashcards
                  </a>
                  <a
                    href="/due-review"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Review
                  </a>
                  <a
                    href="/quiz"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Quiz
                  </a>
                  <a
                    href="/create-note"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    New Note
                  </a>
                </nav>
                <div className="pt-4">
                  <ImportExport variant="text" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <a href="/" className="font-bold text-xl flex items-center">
            <Book className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Super Learn</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-base font-medium hover:text-primary transition-colors">
              Notes
            </a>
            <a href="/flashcards" className="text-base font-medium hover:text-primary transition-colors">
              Flashcards
            </a>
            <a href="/due-review" className="text-base font-medium hover:text-primary transition-colors">
              Review
            </a>
            <a href="/quiz" className="text-base font-medium hover:text-primary transition-colors">
              Quiz
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ImportExport variant="icon" />

          {/* Direct HTML button with onclick handler */}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 hidden sm:flex"
            onClick={() => (window.location.href = "/create-note")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </button>

          {/* Direct HTML button for mobile */}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 sm:hidden"
            onClick={() => (window.location.href = "/create-note")}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New Note</span>
          </button>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
