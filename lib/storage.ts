"use client"

import type { Note, Flashcard, CreateNoteInput, CreateFlashcardInput } from "./types"

// Notes Storage
export function getNotes(): Note[] {
  if (typeof window === "undefined") return []

  try {
    const notes = localStorage.getItem("notes")
    return notes ? JSON.parse(notes) : []
  } catch (error) {
    console.error("Error getting notes:", error)
    return []
  }
}

export function getNote(id: string): Note | null {
  const notes = getNotes()
  return notes.find((note) => note.id === id) || null
}

export function createNote(input: CreateNoteInput): Note {
  try {
    // Get existing notes
    const notes = getNotes()

    // Create new note
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add the new note to the array
    const updatedNotes = [...notes, newNote]

    // Save to localStorage
    localStorage.setItem("notes", JSON.stringify(updatedNotes))

    return newNote
  } catch (error) {
    console.error("Error creating note:", error)
    throw new Error("Failed to create note: " + (error instanceof Error ? error.message : String(error)))
  }
}

export function updateNote(id: string, updatedNote: Partial<Note>): Note {
  try {
    // Get all notes
    const notes = getNotes()

    // Find the note to update
    const existingNoteIndex = notes.findIndex((note) => note.id === id)

    if (existingNoteIndex === -1) {
      throw new Error("Note not found")
    }

    // Get the existing note
    const existingNote = notes[existingNoteIndex]

    // Create the updated note
    const mergedNote = {
      ...existingNote,
      ...updatedNote,
      updatedAt: new Date().toISOString(),
    }

    // Replace the old note with the updated one
    notes[existingNoteIndex] = mergedNote

    // Save all notes back to localStorage
    localStorage.setItem("notes", JSON.stringify(notes))

    return mergedNote
  } catch (error) {
    console.error("Error updating note:", error)
    throw new Error("Failed to update note: " + (error instanceof Error ? error.message : String(error)))
  }
}

export function deleteNote(id: string): void {
  try {
    const notes = getNotes()
    const updatedNotes = notes.filter((note) => note.id !== id)

    localStorage.setItem("notes", JSON.stringify(updatedNotes))

    // Also delete associated flashcards
    const flashcards = getFlashcards()
    const updatedFlashcards = flashcards.filter((card) => card.noteId !== id)
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards))
  } catch (error) {
    console.error("Error deleting note:", error)
    throw new Error("Failed to delete note")
  }
}

// Flashcards Storage
export function getFlashcards(): Flashcard[] {
  if (typeof window === "undefined") return []

  try {
    const flashcards = localStorage.getItem("flashcards")
    return flashcards ? JSON.parse(flashcards) : []
  } catch (error) {
    console.error("Error getting flashcards:", error)
    return []
  }
}

export function getFlashcard(id: string): Flashcard | null {
  const flashcards = getFlashcards()
  return flashcards.find((card) => card.id === id) || null
}

export function createFlashcard(input: CreateFlashcardInput): Flashcard {
  try {
    const flashcards = getFlashcards()

    const newFlashcard: Flashcard = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
      lastReviewed: new Date().toISOString(),
      nextReview: new Date().toISOString(), // Due immediately for first review
      easeFactor: 2.5, // Initial ease factor
      interval: 0, // Initial interval in days
    }

    const updatedFlashcards = [...flashcards, newFlashcard]
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards))
    return newFlashcard
  } catch (error) {
    console.error("Error creating flashcard:", error)
    throw new Error("Failed to create flashcard")
  }
}

export function updateFlashcard(id: string, updatedCard: Partial<Flashcard>): Flashcard {
  try {
    const flashcards = getFlashcards()
    const existingCardIndex = flashcards.findIndex((card) => card.id === id)

    if (existingCardIndex === -1) {
      throw new Error("Flashcard not found")
    }

    const existingCard = flashcards[existingCardIndex]

    const mergedCard = {
      ...existingCard,
      ...updatedCard,
    }

    flashcards[existingCardIndex] = mergedCard
    localStorage.setItem("flashcards", JSON.stringify(flashcards))

    return mergedCard
  } catch (error) {
    console.error("Error updating flashcard:", error)
    throw new Error("Failed to update flashcard")
  }
}

export function deleteFlashcard(id: string): void {
  try {
    const flashcards = getFlashcards()
    const updatedFlashcards = flashcards.filter((card) => card.id !== id)

    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards))
  } catch (error) {
    console.error("Error deleting flashcard:", error)
    throw new Error("Failed to delete flashcard")
  }
}

// Search functionality
export function searchNotes(query: string): Note[] {
  if (!query.trim()) return []

  const notes = getNotes()
  const lowerQuery = query.toLowerCase()

  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.notes.toLowerCase().includes(lowerQuery) ||
      note.summary.toLowerCase().includes(lowerQuery) ||
      note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

export function searchFlashcards(query: string): Flashcard[] {
  if (!query.trim()) return []

  const flashcards = getFlashcards()
  const lowerQuery = query.toLowerCase()

  return flashcards.filter(
    (card) =>
      card.front.toLowerCase().includes(lowerQuery) ||
      card.back.toLowerCase().includes(lowerQuery) ||
      card.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

// Get all unique tags from notes and flashcards
export function getAllTags(): string[] {
  const notes = getNotes()
  const flashcards = getFlashcards()

  const noteTags = notes.flatMap((note) => note.tags)
  const flashcardTags = flashcards.flatMap((card) => card.tags)

  // Combine and deduplicate tags
  const allTags = [...new Set([...noteTags, ...flashcardTags])]
  return allTags
}

// Import/Export functionality
export function exportData(): string {
  const notes = getNotes()
  const flashcards = getFlashcards()

  const data = {
    notes,
    flashcards,
    exportDate: new Date().toISOString(),
  }

  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)

    if (!data.notes || !data.flashcards || !Array.isArray(data.notes) || !Array.isArray(data.flashcards)) {
      throw new Error("Invalid data format")
    }

    localStorage.setItem("notes", JSON.stringify(data.notes))
    localStorage.setItem("flashcards", JSON.stringify(data.flashcards))

    return true
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}

interface IndexEntry {
  title: string
  reference: string
  description: string
  tags: string[]
}

const INDEX_KEY = "indexEntries"

export function createIndexEntry(entry: IndexEntry): void {
  try {
    const existingEntries = getIndexEntries()
    const updatedEntries = [...existingEntries, { id: crypto.randomUUID(), ...entry }]
    localStorage.setItem(INDEX_KEY, JSON.stringify(updatedEntries))
  } catch (error) {
    console.error("Error creating index entry:", error)
    throw new Error("Failed to create index entry")
  }
}

function getIndexEntries(): any[] {
  try {
    const entries = localStorage.getItem(INDEX_KEY)
    return entries ? JSON.parse(entries) : []
  } catch (error) {
    console.error("Error getting index entries:", error)
    return []
  }
}
