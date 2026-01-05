import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "playlists.json")
    const fileContents = await readFile(filePath, "utf8")
    const playlists = JSON.parse(fileContents)
    return NextResponse.json(playlists)
  } catch (error) {
    console.error("Error reading playlists:", error)
    return NextResponse.json({ error: "Failed to load playlists" }, { status: 500 })
  }
}

