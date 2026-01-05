"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

interface Favorite {
  reference: string
  text: string
  date: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("bible_favorites") || "[]")
      setFavorites(saved)
    }
  }, [])

  const removeFavorite = (reference: string) => {
    const updated = favorites.filter((f) => f.reference !== reference)
    setFavorites(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("bible_favorites", JSON.stringify(updated))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Favorite Verses</h1>
        <p className="text-muted-foreground mt-1">
          Your saved Bible verses
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No favorites yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Start saving verses by clicking the heart icon on any verse you love
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{favorite.reference}</CardTitle>
                    <CardDescription>
                      Saved on {new Date(favorite.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <CopyButton text={`${favorite.reference}\n\n${favorite.text}`} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(favorite.reference)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{favorite.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

