declare module "google-trends-api" {
  interface InterestOverTimeOptions {
    keyword: string | string[]
    startTime?: Date
    endTime?: Date
    geo?: string
    hl?: string
    category?: number
    granularTimeUnit?: string
  }

  interface InterestOverTimeResult {
    default: {
      timelineData: Array<{
        time: string
        formattedTime: string
        formattedAxisTime: string
        value: number[]
      }>
      averages?: number[]
    }
  }

  function interestOverTime(
    options: InterestOverTimeOptions
  ): Promise<string>

  const googleTrends: {
    interestOverTime: typeof interestOverTime
  }

  export = googleTrends
}

