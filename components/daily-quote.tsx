'use client'

import { useEffect, useState } from 'react'
import { Quote, BookOpen } from 'lucide-react'

interface QuoteData {
  text: string
  author: string
  source: string
  dynasty?: string
}

interface DailyQuoteProps {
  compact?: boolean
}

export function DailyQuote({ compact = false }: DailyQuoteProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quote')
      .then((res) => res.json())
      .then((data) => {
        setQuote(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading || !quote) {
    return null
  }

  if (compact) {
    return (
      <div className="rounded-xl border border-border/50 bg-muted/30 px-6 py-5">
        <div className="flex items-start gap-3">
          <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-base leading-relaxed text-foreground">
              {quote.text}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">—— {quote.author}</span>
              {quote.dynasty && (
                <>
                  <span>·</span>
                  <span>{quote.dynasty}</span>
                </>
              )}
              {quote.source && (
                <>
                  <span>·</span>
                  <span className="italic">{quote.source}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border border-primary/20">
      <Quote className="absolute -top-4 -left-4 h-24 w-24 text-primary/5" />
      
      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
              {quote.text}
            </p>
            
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">—— {quote.author}</span>
              {quote.dynasty && (
                <>
                  <span>·</span>
                  <span>{quote.dynasty}</span>
                </>
              )}
              {quote.source && (
                <>
                  <span>·</span>
                  <span className="italic">{quote.source}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 opacity-5">
        <BookOpen className="h-32 w-32" />
      </div>
    </div>
  )
}
