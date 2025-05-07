import Link from "next/link"
import { PlusCircle, Menu, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ImportExport } from "@/components/import-export"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="text-xl font-bold flex items-center">
                  <Book className="mr-2 h-5 w-5" />
                  Super Learn
                </Link>
                <nav className="flex flex-col gap-4">
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
                  <Link href="/notes/new" className="text-base font-medium hover:text-primary transition-colors">
                    New Note
                  </Link>
                </nav>
                <div className="pt-4">
                  <ImportExport />
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
          <div className="hidden sm:block">
            <ImportExport />
          </div>
          <Button size="sm" asChild className="hidden sm:flex">
            <Link href="/notes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
          <Button size="icon" variant="ghost" asChild className="sm:hidden">
            <Link href="/notes/new">
              <PlusCircle className="h-5 w-5" />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
