"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bookmark, BookOpen } from "lucide-react"
import { usePlayer } from "@/lib/player-store"
import Link from "next/link"
import type { Playlist, Track } from "@/lib/types"

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [bookmarkedTracks, setBookmarkedTracks] = useState<string[]>([])
  const player = usePlayer()

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(console.error)

    if (typeof window !== "undefined") {
      const bookmarks = JSON.parse(localStorage.getItem("bible_bookmarks") || "[]")
      setBookmarkedTracks(bookmarks)
    }
  }, [])

  const getBookmarkedTracks = (): Array<{ track: Track; playlist: Playlist }> => {
    const tracks: Array<{ track: Track; playlist: Playlist }> = []
    playlists.forEach((playlist) => {
      playlist.tracks.forEach((track) => {
        if (bookmarkedTracks.includes(track.id)) {
          tracks.push({ track, playlist })
        }
      })
    })
    return tracks
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-muted-foreground mt-1">
          Your saved playlists and bookmarked lessons
        </p>
      </div>

      <Tabs defaultValue="playlists" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playlists">Saved Playlists</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-4">
          {playlists.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No saved playlists</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start learning to see your playlists here
                </p>
                <Button asChild>
                  <Link href="/learn">Explore Playlists</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="group cursor-pointer hover:bg-accent/50">
                  <Link href={`/playlist/${playlist.id}`}>
                    <div
                      className={`h-32 rounded-t-lg bg-gradient-to-br ${playlist.coverGradient || "from-primary to-primary/50"} flex items-center justify-center`}
                    >
                      <BookOpen className="h-12 w-12 text-white/80" />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{playlist.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {playlist.description}
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4">
          {getBookmarkedTracks().length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No bookmarks yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bookmark lessons you want to revisit by clicking the bookmark icon
                </p>
                <Button asChild>
                  <Link href="/learn">Start Learning</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {getBookmarkedTracks().map(({ track, playlist }) => (
                <Card
                  key={track.id}
                  className="group cursor-pointer hover:bg-accent/50"
                  onClick={() => player.playTrack(track.id, playlist.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{track.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {playlist.title} • {track.reference}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/track/${track.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

