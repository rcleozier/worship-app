"use client"

import { Play, Pause, SkipBack, SkipForward, List, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlayer } from "@/lib/player-store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getPlaylistVisual } from "@/lib/playlist-visuals"

export function NowPlayingBar() {
  const player = usePlayer()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [hasSeenPlayTooltip, setHasSeenPlayTooltip] = useState(false)

  useEffect(() => {
    if (player.currentTrackId && typeof window !== "undefined") {
      const bookmarks = JSON.parse(localStorage.getItem("bible_bookmarks") || "[]")
      setIsBookmarked(bookmarks.includes(player.currentTrackId))
      
      // Check if user has seen play tooltip
      const seen = localStorage.getItem("bible_play_tooltip_seen")
      setHasSeenPlayTooltip(seen === "true")
    }
  }, [player.currentTrackId])
  
  const handlePlayClick = () => {
    player.togglePlay()
    // Mark tooltip as seen after first interaction
    if (!hasSeenPlayTooltip && typeof window !== "undefined") {
      localStorage.setItem("bible_play_tooltip_seen", "true")
      setHasSeenPlayTooltip(true)
    }
  }

  if (!player.currentTrack) {
    return null
  }

  const handleBookmark = () => {
    if (!player.currentTrackId) return
    
    if (typeof window !== "undefined") {
      const bookmarks = JSON.parse(localStorage.getItem("bible_bookmarks") || "[]")
      if (isBookmarked) {
        const updated = bookmarks.filter((id: string) => id !== player.currentTrackId)
        localStorage.setItem("bible_bookmarks", JSON.stringify(updated))
        setIsBookmarked(false)
      } else {
        bookmarks.push(player.currentTrackId)
        localStorage.setItem("bible_bookmarks", JSON.stringify(bookmarks))
        setIsBookmarked(true)
      }
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = x / rect.width
    player.seek(progress)
  }

  const formatTime = (minutes: number) => {
    const totalSeconds = Math.floor(minutes * 60)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentTime = player.currentTrack.estimatedMinutes * player.progress
  const totalTime = player.currentTrack.estimatedMinutes

  // Get playlist visual for cover thumbnail
  const playlistVisual = player.currentPlaylist 
    ? getPlaylistVisual(player.currentPlaylist.id, player.currentPlaylist.tags)
    : null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      {/* Accent line when playing - subtle glow */}
      {player.isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      )}
      <div className="flex h-20 items-center gap-4 px-4">
        {/* Left: Cover Thumbnail + Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Cover thumbnail */}
          {playlistVisual && (
            <div
              className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 shadow-md"
              style={{
                backgroundImage: playlistVisual.imageUrl 
                  ? `url('${playlistVisual.imageUrl}')` 
                  : playlistVisual.bgImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${playlistVisual.gradient} opacity-85`} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link
              href={`/track/${player.currentTrackId}`}
              className="block truncate font-medium hover:underline"
            >
              {player.currentTrack.title}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {player.currentTrack.reference}
              {player.currentPlaylist && ` • ${player.currentPlaylist.title}`}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={player.prevTrack}
              disabled={!player.currentPlaylist}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            {/* Play button with one-time tooltip for beginners */}
            <TooltipProvider>
              <Tooltip open={!hasSeenPlayTooltip && !player.isPlaying ? undefined : false}>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className={`h-11 w-11 ${player.isPlaying ? "ring-2 ring-primary/30" : ""}`}
                    onClick={handlePlayClick}
                  >
                    {player.isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[180px]">
                  <p className="text-xs">
                    Press play to hear the verse read aloud. You can pause anytime.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              onClick={player.nextTrack}
              disabled={!player.currentPlaylist}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="min-w-[2.5rem] text-right">{formatTime(currentTime)}</span>
            <div
              className="h-1.5 w-40 cursor-pointer rounded-full bg-muted/60 hover:bg-muted transition-colors"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-primary transition-all shadow-sm"
                style={{ width: `${player.progress * 100}%` }}
              />
            </div>
            <span className="min-w-[2.5rem]">{formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Right: Speed & Actions */}
        <div className="flex items-center gap-2">
          <Select
            value={player.playbackSpeed.toString()}
            onValueChange={(val) => player.setPlaybackSpeed(parseFloat(val))}
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          {player.currentPlaylist && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="max-h-64 overflow-y-auto">
                  {player.currentPlaylist.tracks.map((track, idx) => (
                    <DropdownMenuItem
                      key={track.id}
                      onClick={() => player.playTrack(track.id, player.currentPlaylistId!)}
                      className={track.id === player.currentTrackId ? "bg-accent" : ""}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-muted-foreground w-6">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm">{track.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {track.reference}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

