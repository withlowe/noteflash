"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TagFilterDialogProps {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagFilterDialog({ availableTags, selectedTags, onTagsChange }: TagFilterDialogProps) {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTags, setFilteredTags] = useState<string[]>(availableTags)

  // Update local state when props change
  useEffect(() => {
    setLocalSelectedTags(selectedTags)
  }, [selectedTags])

  // Filter tags based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(availableTags)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTags(availableTags.filter((tag) => tag.toLowerCase().includes(query)))
    }
  }, [searchQuery, availableTags])

  const handleTagToggle = (tag: string) => {
    setLocalSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleApply = () => {
    onTagsChange(localSelectedTags)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleReset = () => {
    setLocalSelectedTags([])
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Tag className="h-4 w-4" />
          Filter Tags
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 py-0">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Flashcards by Tags</DialogTitle>
          <DialogDescription>
            Select tags to filter your flashcards. Only cards with all selected tags will be shown.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Selected tags display */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md min-h-[60px]">
            {localSelectedTags.length > 0 ? (
              localSelectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer uppercase flex items-center gap-1 px-2 py-1"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  <X className="h-3 w-3" />
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tags selected</p>
            )}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tags..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tags list */}
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2 py-1 px-1 rounded hover:bg-muted/50">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={localSelectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer uppercase flex-1"
                    >
                      {tag}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No matching tags found</p>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
