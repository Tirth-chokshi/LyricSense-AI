import { searchSongs } from "@/lib/searchSongs";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchSongs(query);
    return Response.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json({ error: "Failed to search songs" }, { status: 500 });
  }
}
