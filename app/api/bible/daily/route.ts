import { NextResponse } from "next/server"

const BIBLE_API_BASE = "https://bible-api.com"

// Popular verses for verse of the day rotation
const POPULAR_VERSES = [
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
  "Joshua 1:9",
  "Matthew 28:20",
  "Psalm 46:10",
  "Romans 12:2",
  "Galatians 2:20",
  "2 Timothy 1:7",
  "1 John 4:19",
  "Psalm 119:105",
  "Proverbs 16:3",
  "Isaiah 41:10",
  "Matthew 11:28",
  "John 14:6",
  "Romans 5:8",
  "1 Peter 5:7",
  "Psalm 34:8",
  "Proverbs 18:10",
  "Isaiah 53:5",
  "Matthew 5:16",
  "John 15:13",
  "Romans 15:13",
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const translation = searchParams.get("translation") || "kjv"
  const date = searchParams.get("date") // Optional: for consistent daily verse

  try {
    // Select verse based on date (consistent for same day)
    let verseIndex = 0
    if (date) {
      const dateObj = new Date(date)
      verseIndex = dateObj.getDate() % POPULAR_VERSES.length
    } else {
      // Use current date
      verseIndex = new Date().getDate() % POPULAR_VERSES.length
    }

    const reference = POPULAR_VERSES[verseIndex]
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Bible API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      date: date || new Date().toISOString().split("T")[0],
      reference: data.reference,
      verses: data.verses || [],
      text: data.text,
      translation: translation.toUpperCase(),
    })
  } catch (error: any) {
    console.error("Error fetching daily verse:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily verse" },
      { status: 500 }
    )
  }
}

