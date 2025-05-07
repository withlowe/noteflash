interface MarkdownSection {
  heading: string
  content: string
}

export function parseMarkdown(markdown: string): MarkdownSection[] {
  if (!markdown) return []

  // Split the markdown by headings (# Heading)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const sections: MarkdownSection[] = []

  // Find all headings and their positions
  const headings: { level: number; title: string; position: number }[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      title: match[2],
      position: match.index,
    })
  }

  // Extract content between headings
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i]
    const nextHeading = headings[i + 1]

    const content = nextHeading
      ? markdown.substring(heading.position + heading.title.length + heading.level + 1, nextHeading.position).trim()
      : markdown.substring(heading.position + heading.title.length + heading.level + 1).trim()

    sections.push({
      heading: heading.title,
      content: formatMarkdownContent(content),
    })
  }

  // If there's content before the first heading
  if (headings.length > 0 && headings[0].position > 0) {
    const introContent = markdown.substring(0, headings[0].position).trim()
    if (introContent) {
      sections.unshift({
        heading: "Introduction",
        content: formatMarkdownContent(introContent),
      })
    }
  }

  // If there are no headings, treat the entire content as one section
  if (sections.length === 0 && markdown.trim()) {
    sections.push({
      heading: "Notes",
      content: formatMarkdownContent(markdown.trim()),
    })
  }

  return sections
}

// Function to format markdown content, especially tables and lists
function formatMarkdownContent(content: string): string {
  let formattedContent = content

  // Process lists - convert markdown lists to HTML lists
  formattedContent = formatLists(formattedContent)

  // Process tables if content contains a table
  if (formattedContent.includes("|")) {
    formattedContent = formatTables(formattedContent)
  }

  return formattedContent
}

// Helper function to format lists
function formatLists(content: string): string {
  // Convert unordered lists (- item or * item)
  let result = content.replace(/^[\s]*[-*][\s]+(.*?)$/gm, "<li>$1</li>")

  // Convert ordered lists (1. item)
  result = result.replace(/^[\s]*\d+\.[\s]+(.*?)$/gm, "<li>$1</li>")

  // Group consecutive <li> elements into <ul> or <ol>
  const lines = result.split("\n")
  let inList = false
  let listType = ""
  const formattedLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isListItem = line.trim().startsWith("<li>")

    // Start of a list
    if (isListItem && !inList) {
      inList = true
      // Determine if it's likely an ordered list by checking previous line
      listType = i > 0 && lines[i - 1].match(/^\s*\d+\.\s/) ? "ol" : "ul"
      formattedLines.push(`<${listType}>`)
      formattedLines.push(line)
    }
    // Continue list
    else if (isListItem && inList) {
      formattedLines.push(line)
    }
    // End of a list
    else if (!isListItem && inList) {
      inList = false
      formattedLines.push(`</${listType}>`)
      formattedLines.push(line)
    }
    // Not in a list
    else {
      formattedLines.push(line)
    }
  }

  // Close any open list at the end
  if (inList) {
    formattedLines.push(`</${listType}>`)
  }

  return formattedLines.join("\n")
}

// Helper function to format a table block
function formatTables(content: string): string {
  const lines = content.split("\n")
  let inTable = false
  let tableContent = ""
  let formattedContent = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isTableLine = line.trim().startsWith("|") && line.trim().endsWith("|")

    // Start of a table
    if (isTableLine && !inTable) {
      inTable = true
      tableContent = line + "\n"
    }
    // Continue table
    else if (isTableLine && inTable) {
      tableContent += line + "\n"
    }
    // End of a table
    else if (!isTableLine && inTable) {
      inTable = false
      formattedContent += processTable(tableContent) + "\n" + line + "\n"
      tableContent = ""
    }
    // Not in a table
    else {
      formattedContent += line + "\n"
    }
  }

  // Handle case where table is at the end of content
  if (inTable) {
    formattedContent += processTable(tableContent)
  }

  return formattedContent.trim()
}

// Process a table string into HTML
function processTable(tableContent: string): string {
  const rows = tableContent.trim().split("\n")

  if (rows.length < 2) return tableContent // Not a proper table

  let tableHtml =
    '<div class="overflow-x-auto my-4"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">'

  // Process header row
  const headerCells = rows[0].split("|").filter((cell) => cell.trim() !== "")
  tableHtml += "<thead><tr>"
  headerCells.forEach((cell) => {
    tableHtml += `<th class="px-4 py-2 text-left font-medium">${cell.trim()}</th>`
  })
  tableHtml += "</tr></thead>"

  // Skip the separator row (---|---) and process data rows
  if (rows.length > 2) {
    tableHtml += "<tbody>"
    for (let i = 2; i < rows.length; i++) {
      if (!rows[i].includes("|")) continue // Skip non-table lines

      const cells = rows[i].split("|").filter((cell) => cell.trim() !== "")
      tableHtml += "<tr>"
      cells.forEach((cell) => {
        tableHtml += `<td class="px-4 py-2 border-t">${cell.trim()}</td>`
      })
      tableHtml += "</tr>"
    }
    tableHtml += "</tbody>"
  }

  tableHtml += "</table></div>"
  return tableHtml
}

// Function to extract flashcards from markdown
export function extractFlashcardsFromMarkdown(markdown: string): { front: string; back: string }[] {
  const sections = parseMarkdown(markdown)

  return sections
    .filter((section) => section.heading && section.content.trim())
    .map((section) => ({
      front: section.heading,
      back: section.content.trim(),
    }))
}
