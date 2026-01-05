import { NextResponse } from "next/server"

// Using ESV API for search (free tier available)
// Alternative: Use bible-api.com with book/chapter iteration
const ESV_API_BASE = "https://api.esv.org/v3/passage/search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const translation = searchParams.get("translation") || "kjv"

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }

  try {
    // For now, we'll use a simple approach with bible-api.com
    // Search by iterating through common verses (this is a simplified approach)
    // In production, you'd want to use ESV API or another search-enabled API
    
    // Common books to search through
    const commonReferences = [
      "John 3:16",
      "Romans 8:28",
      "Philippians 4:13",
      "Jeremiah 29:11",
      "Proverbs 3:5-6",
      "1 Corinthians 13:4-7",
      "Matthew 6:26",
      "Isaiah 40:31",
      "Psalm 23:1",
      "Ephesians 2:8-9",
    ]

    const results = []
    
    // Search through common verses (simplified - in production use proper search API)
    for (const ref of commonReferences) {
      try {
        const verseResponse = await fetch(
          `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}`
        )
        if (verseResponse.ok) {
          const verseData = await verseResponse.json()
          const text = verseData.text?.toLowerCase() || ""
          if (text.includes(query.toLowerCase())) {
            results.push({
              reference: verseData.reference,
              text: verseData.text,
              verses: verseData.verses,
            })
          }
        }
      } catch (e) {
        // Continue searching
      }
    }

    return NextResponse.json({
      query,
      results,
      count: results.length,
    })
  } catch (error: any) {
    console.error("Error searching Bible:", error)
    return NextResponse.json(
      { error: "Failed to search Bible" },
      { status: 500 }
    )
  }
}

