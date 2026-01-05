import { NextResponse } from "next/server"

// Bible API - using bible-api.com (free, no auth required)
const BIBLE_API_BASE = "https://bible-api.com"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get("reference") // e.g., "John 3:16" or "1 John 3:16-18"
  const translation = searchParams.get("translation") || "kjv" // kjv, asv, basicenglish, web, ylt

  if (!reference) {
    return NextResponse.json(
      { error: "Reference parameter is required (e.g., 'John 3:16')" },
      { status: 400 }
    )
  }

  try {
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Verse not found. Please check the reference format." },
          { status: 404 }
        )
      }
      throw new Error(`Bible API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      reference: data.reference,
      verses: data.verses || [],
      text: data.text,
      translation: translation.toUpperCase(),
    })
  } catch (error: any) {
    console.error("Error fetching Bible verse:", error)
    return NextResponse.json(
      { error: "Failed to fetch Bible verse" },
      { status: 500 }
    )
  }
}

