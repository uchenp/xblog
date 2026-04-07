import { getRandomQuote } from '@/lib/quotes'

export async function GET() {
  const quote = getRandomQuote()
  return Response.json(quote)
}
