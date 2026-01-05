"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Circle } from "lucide-react"

const READING_PLANS = [
  {
    id: "bible-in-year",
    name: "Bible in a Year",
    description: "Read through the entire Bible in 365 days",
    duration: "365 days",
    dailyTime: "15-20 min",
    status: "not-started",
  },
  {
    id: "new-testament-30",
    name: "New Testament in 30 Days",
    description: "Read through the New Testament in one month",
    duration: "30 days",
    dailyTime: "30-45 min",
    status: "not-started",
  },
  {
    id: "psalms-proverbs",
    name: "Psalms & Proverbs",
    description: "Read through Psalms and Proverbs with daily wisdom",
    duration: "90 days",
    dailyTime: "10 min",
    status: "not-started",
  },
  {
    id: "gospels",
    name: "The Gospels",
    description: "Read through Matthew, Mark, Luke, and John",
    duration: "28 days",
    dailyTime: "20 min",
    status: "not-started",
  },
]

export default function PlansPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Reading Plans</h1>
        <p className="text-muted-foreground mt-1">
          Structured Bible reading plans to guide your study
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {READING_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
                <Badge variant="secondary">{plan.status === "not-started" ? "New" : "Active"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Daily:</span>
                  <span>{plan.dailyTime}</span>
                </div>
              </div>
              <Button className="w-full mt-auto">Start Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Plans</CardTitle>
          <CardDescription>Your current reading progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No active plans</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a reading plan above to begin tracking your progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

