import { NextResponse } from "next/server"

const BIBLE_API_BASE = "https://bible-api.com"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const book = searchParams.get("book")
  const chapter = searchParams.get("chapter")
  const translation = searchParams.get("translation") || "kjv"

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Book and chapter parameters are required" },
      { status: 400 }
    )
  }

  try {
    const reference = `${book} ${chapter}`
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Chapter not found" },
          { status: 404 }
        )
      }
      throw new Error(`Bible API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      book,
      chapter: parseInt(chapter),
      reference: data.reference,
      verses: data.verses || [],
      text: data.text,
      translation: translation.toUpperCase(),
    })
  } catch (error: any) {
    console.error("Error fetching Bible chapter:", error)
    return NextResponse.json(
      { error: "Failed to fetch Bible chapter" },
      { status: 500 }
    )
  }
}

