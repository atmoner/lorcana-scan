export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing card ID",
    })
  }

  try {
    const response = await fetch(
      `https://lorca-lab.com/api/cards/${encodeURIComponent(id)}`
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
      statusMessage: error.message || "Failed to fetch card from Lorca Lab API",
    })
  }
})
