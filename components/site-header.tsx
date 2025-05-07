"use client"

import { useState } from "react"
import Link from "next/link"
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
                <Link href="/" className="text-xl font-bold flex items-center" onClick={closeMenu}>
                  <Book className="mr-2 h-5 w-5" />
                  Super Learn
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Notes
                  </Link>
                  <Link
                    href="/flashcards"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Flashcards
                  </Link>
                  <Link
                    href="/due-review"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Review
                  </Link>
                  <Link
                    href="/quiz"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    Quiz
                  </Link>
                  <Link
                    href="/notes/new"
                    className="text-base font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    New Note
                  </Link>
                </nav>
                <div className="pt-4">
                  <ImportExport variant="text" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-bold text-xl flex items-center">
            <Book className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Super Learn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-base font-medium hover:text-primary transition-colors">
              Notes
            </Link>
            <Link href="/flashcards" className="text-base font-medium hover:text-primary transition-colors">
              Flashcards
            </Link>
            <Link href="/due-review" className="text-base font-medium hover:text-primary transition-colors">
              Review
            </Link>
            <Link href="/quiz" className="text-base font-medium hover:text-primary transition-colors">
              Quiz
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ImportExport variant="icon" />
          <Button size="sm" className="hidden sm:flex" asChild>
            <Link href="/notes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
          <Button size="icon" variant="ghost" className="sm:hidden" asChild>
            <Link href="/notes/new">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">New Note</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
