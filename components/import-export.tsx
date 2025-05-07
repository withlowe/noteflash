"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, AlertCircle, CheckCircle2, FileJson } from "lucide-react"
import { exportData, importData } from "@/lib/storage"

interface ImportExportProps {
  variant?: "icon" | "text"
}

export function ImportExport({ variant = "text" }: ImportExportProps) {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `super-learn-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const success = importData(content)

      setImportStatus(success ? "success" : "error")

      // Reset file input
      event.target.value = ""

      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus("idle")
      }, 3000)
    }

    reader.readAsText(file)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" title="Import/Export">
            <FileJson className="h-5 w-5" />
            <span className="sr-only">Import/Export</span>
          </Button>
        ) : (
          <Button variant="outline">Import/Export</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import/Export Data</DialogTitle>
          <DialogDescription>Export your notes and flashcards or import from a backup file.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Export Data</h3>
            <p className="text-sm text-muted-foreground">Download all your notes and flashcards as a JSON file.</p>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Import Data</h3>
            <p className="text-sm text-muted-foreground">
              Import notes and flashcards from a previously exported file.
              <strong className="block mt-1">Warning: This will replace all your current data.</strong>
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" asChild>
                <label className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Select File to Import
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </Button>

              {importStatus === "success" && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Data imported successfully!</AlertDescription>
                </Alert>
              )}

              {importStatus === "error" && (
                <Alert className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Failed to import data. Please check your file format.</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
