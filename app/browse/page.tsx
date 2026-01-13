"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ChevronRight, ChevronLeft, Search, Grid, List } from "lucide-react"
import Link from "next/link"
import { getBookVisual } from "@/lib/book-visuals"

interface BibleBook {
  name: string
  chapters: number
  testament: string
}

export default function BrowsePage() {
  const [books, setBooks] = useState<BibleBook[]>([])
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [chapterData, setChapterData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingChapter, setIsLoadingChapter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"old" | "new">("old")
  const [translation, setTranslation] = useState<string>("kjv")

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (selectedBook) {
      fetchChapter(selectedBook, selectedChapter, translation)
    }
  }, [selectedBook, selectedChapter, translation])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bible/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books || [])
        if (data.books?.length > 0) {
          setSelectedBook(data.books[0].name)
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChapter = async (book: string, chapter: number, translation: string = "kjv") => {
    setIsLoadingChapter(true)
    try {
      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`
      )
      if (response.ok) {
        const data = await response.json()
        setChapterData(data)
      }
    } catch (error) {
      console.error("Error fetching chapter:", error)
    } finally {
      setIsLoadingChapter(false)
    }
  }

  const oldTestament = books.filter((b) => b.testament === "Old")
  const newTestament = books.filter((b) => b.testament === "New")
  const selectedBookData = books.find((b) => b.name === selectedBook)

  // Filter books based on search
  const filteredOldTestament = oldTestament.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredNewTestament = newTestament.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-8 bg-gradient-to-b from-background via-background to-background/95">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 bg-clip-text text-transparent">
              Browse Bible
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-3 font-medium">
              Explore all 66 books of the Bible
            </p>
            <p className="text-base text-foreground/70">
              Read any book and chapter at your own pace
            </p>
          </div>
        </div>
      </div>

      {/* Search, Translation, and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Translation Selector */}
          <Select value={translation} onValueChange={setTranslation}>
            <SelectTrigger className="w-[160px]">
              <BookOpen className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kjv">KJV - King James</SelectItem>
              <SelectItem value="asv">ASV - American Standard</SelectItem>
              <SelectItem value="web">WEB - World English</SelectItem>
              <SelectItem value="ylt">YLT - Young's Literal</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Books Grid/List View */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as "old" | "new")}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50">
            <TabsTrigger value="old" className="data-[state=active]:bg-background">
              Old Testament
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-background">
              New Testament
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="old" className="space-y-6">
            {filteredOldTestament.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No books found matching "{searchQuery}"</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredOldTestament.map((book, idx) => (
                  <BookCard
                    key={book.name}
                    book={book}
                    isSelected={selectedBook === book.name}
                    onClick={() => {
                      setSelectedBook(book.name)
                      setSelectedChapter(1)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredOldTestament.map((book, idx) => (
                  <BookListItem
                    key={book.name}
                    book={book}
                    isSelected={selectedBook === book.name}
                    onClick={() => {
                      setSelectedBook(book.name)
                      setSelectedChapter(1)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new" className="space-y-6">
            {filteredNewTestament.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No books found matching "{searchQuery}"</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredNewTestament.map((book, idx) => (
                  <BookCard
                    key={book.name}
                    book={book}
                    isSelected={selectedBook === book.name}
                    onClick={() => {
                      setSelectedBook(book.name)
                      setSelectedChapter(1)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNewTestament.map((book, idx) => (
                  <BookListItem
                    key={book.name}
                    book={book}
                    isSelected={selectedBook === book.name}
                    onClick={() => {
                      setSelectedBook(book.name)
                      setSelectedChapter(1)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Chapter Reading View */}
      {selectedBookData && (
        <section className="relative pt-4">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/3 via-primary/2 to-transparent rounded-2xl -z-10" />
          <div className="relative">

            <Card className="border-0 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm" style={{ borderRadius: "1.5rem" }}>
              {/* Book Header with Visual */}
              <div 
                className="relative h-48 overflow-hidden"
                style={{
                  backgroundImage: `url('${getBookVisual(selectedBook).imageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getBookVisual(selectedBook).gradient} opacity-85`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <Badge variant="secondary" className="w-fit mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {selectedBookData.testament} Testament
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {selectedBook}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {selectedBookData.chapters} chapters
                  </p>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-xl">Chapter {selectedChapter}</CardTitle>
                      <CardDescription className="mt-1">
                        {translation === "kjv" && "King James Version"}
                        {translation === "asv" && "American Standard Version"}
                        {translation === "web" && "World English Bible"}
                        {translation === "ylt" && "Young's Literal Translation"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={selectedChapter <= 1}
                      onClick={() => setSelectedChapter(selectedChapter - 1)}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Select
                      value={selectedChapter.toString()}
                      onValueChange={(val) => setSelectedChapter(parseInt(val))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: selectedBookData.chapters }, (_, i) => i + 1).map(
                          (ch) => (
                            <SelectItem key={ch} value={ch.toString()}>
                              Chapter {ch}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={selectedChapter >= selectedBookData.chapters}
                      onClick={() => setSelectedChapter(selectedChapter + 1)}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-8">
                {isLoadingChapter ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : chapterData ? (
                  <div className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="space-y-4 leading-relaxed">
                        {chapterData.verses.map((verse: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="flex gap-4 group hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors"
                          >
                            <span className="text-sm font-semibold text-primary min-w-[3rem] pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              {verse.verse}
                            </span>
                            <span className="text-base md:text-lg flex-1 leading-relaxed text-foreground/90">
                              {verse.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a chapter to begin reading</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}

// Book Card Component (Grid View)
function BookCard({
  book,
  isSelected,
  onClick,
}: {
  book: BibleBook
  isSelected: boolean
  onClick: () => void
}) {
  const visual = getBookVisual(book.name)
  
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      style={{ borderRadius: "1rem" }}
      onClick={onClick}
    >
      <div
        className="relative h-32 overflow-hidden"
        style={{
          backgroundImage: `url('${visual.imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative h-full flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-white opacity-60" />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{book.name}</h3>
        <p className="text-xs text-muted-foreground">{book.chapters} chapters</p>
      </CardContent>
    </Card>
  )
}

// Book List Item Component (List View)
function BookListItem({
  book,
  isSelected,
  onClick,
}: {
  book: BibleBook
  isSelected: boolean
  onClick: () => void
}) {
  const visual = getBookVisual(book.name)
  
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 overflow-hidden border-0 shadow-sm hover:shadow-md hover:bg-accent/30 ${
        isSelected ? "bg-accent ring-2 ring-primary" : ""
      }`}
      style={{ borderRadius: "0.75rem" }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 shadow-md"
            style={{
              backgroundImage: `url('${visual.imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-85`} />
            <div className="relative h-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white opacity-70" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1">{book.name}</h3>
            <p className="text-sm text-muted-foreground">{book.chapters} chapters</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  )
}

