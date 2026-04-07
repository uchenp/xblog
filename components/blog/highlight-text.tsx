/**
 * 高亮文本组件：在文本中高亮匹配的关键词
 */
export function HighlightText({
  text,
  query,
  className = '',
}: {
  text: string
  query: string
  className?: string
}) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery || !lowerText.includes(lowerQuery)) {
    return <span className={className}>{text}</span>
  }

  const parts: React.ReactNode[] = []
  let currentIndex = 0
  let matchIndex = lowerText.indexOf(lowerQuery, currentIndex)

  while (matchIndex !== -1) {
    // 匹配前的文本
    if (matchIndex > currentIndex) {
      parts.push(
        <span key={`text-${currentIndex}`}>
          {text.slice(currentIndex, matchIndex)}
        </span>
      )
    }
    // 高亮匹配的文本
    parts.push(
      <mark
        key={`match-${matchIndex}`}
        className="bg-primary/20 text-primary rounded px-0.5"
      >
        {text.slice(matchIndex, matchIndex + lowerQuery.length)}
      </mark>
    )
    currentIndex = matchIndex + lowerQuery.length
    matchIndex = lowerText.indexOf(lowerQuery, currentIndex)
  }

  // 剩余文本
  if (currentIndex < text.length) {
    parts.push(
      <span key={`text-end-${currentIndex}`}>
        {text.slice(currentIndex)}
      </span>
    )
  }

  return <span className={className}>{parts}</span>
}
