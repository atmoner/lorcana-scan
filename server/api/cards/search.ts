export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string

  if (!searchQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing search query parameter "q"',
    })
  }

  try {
    const response = await fetch(
      `https://lorca-lab.com/api/cards/search?q=${encodeURIComponent(
        searchQuery
      )}`
    )

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `API Error: ${response.statusText}`,
      })
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Proxy API Error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch from Lorca Lab API",
    })
  }
})
