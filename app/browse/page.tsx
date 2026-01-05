"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

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

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (selectedBook) {
      fetchChapter(selectedBook, selectedChapter)
    }
  }, [selectedBook, selectedChapter])

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

  const fetchChapter = async (book: string, chapter: number) => {
    setIsLoadingChapter(true)
    try {
      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}`
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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Bible</h1>
        <p className="text-muted-foreground mt-1">
          Read the Bible by book and chapter
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Book Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Book</CardTitle>
            <CardDescription>Choose a book from the Bible</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <Tabs defaultValue="old" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="old">Old Testament</TabsTrigger>
                  <TabsTrigger value="new">New Testament</TabsTrigger>
                </TabsList>
                <TabsContent value="old" className="space-y-2 max-h-[500px] overflow-y-auto">
                  {oldTestament.map((book) => (
                    <Button
                      key={book.name}
                      variant={selectedBook === book.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedBook(book.name)
                        setSelectedChapter(1)
                      }}
                    >
                      {book.name}
                    </Button>
                  ))}
                </TabsContent>
                <TabsContent value="new" className="space-y-2 max-h-[500px] overflow-y-auto">
                  {newTestament.map((book) => (
                    <Button
                      key={book.name}
                      variant={selectedBook === book.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedBook(book.name)
                        setSelectedChapter(1)
                      }}
                    >
                      {book.name}
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Chapter Selection & Reading */}
        <div className="lg:col-span-2 space-y-4">
          {selectedBookData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedBook}</CardTitle>
                    <CardDescription>Select a chapter</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={selectedChapter <= 1}
                      onClick={() => setSelectedChapter(selectedChapter - 1)}
                    >
                      Previous
                    </Button>
                    <Select
                      value={selectedChapter.toString()}
                      onValueChange={(val) => setSelectedChapter(parseInt(val))}
                    >
                      <SelectTrigger className="w-[120px]">
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
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingChapter ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : chapterData ? (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {chapterData.book} {chapterData.chapter}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {chapterData.translation}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {chapterData.verses.map((verse: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <span className="text-sm font-semibold text-primary min-w-[3rem]">
                            {verse.verse}
                          </span>
                          <span className="text-base flex-1 leading-relaxed">{verse.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a book and chapter to read
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

