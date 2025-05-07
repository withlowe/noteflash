"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TagFilterDropdownProps {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagFilterDropdown({ availableTags, selectedTags, onTagsChange }: TagFilterDropdownProps) {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleClearAll = () => {
    onTagsChange([])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Tag className="h-4 w-4" />
          Filter Tags
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 py-0">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <ScrollArea className="h-[300px]">
          {availableTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => handleTagToggle(tag)}
              className="uppercase"
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>

        {selectedTags.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearAll} className="justify-center text-sm">
              Clear All Filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
