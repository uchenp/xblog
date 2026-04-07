"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { CodeBlock } from "@/components/code-block"
import { OptimizedImage } from "@/components/optimized-image"
import "highlight.js/styles/github.css"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
        prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-6
        prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:leading-relaxed prose-p:text-foreground prose-p:my-4
        prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
        prose-ul:my-4 prose-ol:my-4
        prose-li:text-foreground prose-li:leading-relaxed prose-li:my-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/10 prose-blockquote:italic prose-blockquote:text-foreground prose-blockquote:rounded-r-lg prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:my-6
        prose-hr:border-border prose-hr:my-8
        prose-table:block prose-table:overflow-x-auto
        prose-img:my-6"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: function CodeComponent({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            if (!inline && match) {
              const language = match[1]
              const codeString = String(children).replace(/\n$/, "")
              return <CodeBlock code={codeString} language={language} />
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          blockquote: function Blockquote({ children, ...props }: any) {
            return (
              <blockquote className="border-l-4 border-primary bg-muted/10 italic rounded-r-lg px-6 py-4 my-6" {...props}>
                {children}
              </blockquote>
            )
          },
          table: function Table({ children, ...props }: any) {
            return (
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse border rounded-lg overflow-hidden" {...props}>
                  {children}
                </table>
              </div>
            )
          },
          th: function TH({ children, ...props }: any) {
            return (
              <th className="border bg-muted px-4 py-2 text-left font-semibold" {...props}>
                {children}
              </th>
            )
          },
          td: function TD({ children, ...props }: any) {
            return (
              <td className="border px-4 py-2" {...props}>
                {children}
              </td>
            )
          },
          img: function OptimizedImg({ src, alt, ...props }: any) {
            if (!src) return null
            return <OptimizedImage src={src} alt={alt || ""} />
          },
          a: function Link({ href, children, ...props }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                {...props}
              >
                {children}
              </a>
            )
          },
          hr: function HR({ ...props }: any) {
            return <hr className="border-border my-8" {...props} />
          },
          h1: function H1({ children, ...props }: any) {
            const slug = generateSlug(String(children))
            return (
              <h1 id={slug} className="scroll-mt-20" {...props}>
                {children}
              </h1>
            )
          },
          h2: function H2({ children, ...props }: any) {
            const slug = generateSlug(String(children))
            return (
              <h2 id={slug} className="scroll-mt-20" {...props}>
                {children}
              </h2>
            )
          },
          h3: function H3({ children, ...props }: any) {
            const slug = generateSlug(String(children))
            return (
              <h3 id={slug} className="scroll-mt-20" {...props}>
                {children}
              </h3>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
