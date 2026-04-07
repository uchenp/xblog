"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt?: string
  className?: string
}

export function OptimizedImage({ src, alt = "", className }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const isExternal = src.startsWith("http://") || src.startsWith("https://")
  const isLocal = src.startsWith("/")

  // For external and local images, use Next.js Image with optimization
  if (isExternal || isLocal) {
    return (
      <figure className="my-6">
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted/20">
          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-muted/40" />
          )}
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className={cn(
              "w-full h-auto transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError(true)
              setIsLoading(false)
            }}
            priority={false}
            quality={80}
          />
        </div>
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  }

  // Fallback for data URLs or invalid sources
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        className={cn("rounded-lg border max-w-full h-auto", className)}
        loading="lazy"
        decoding="async"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}
