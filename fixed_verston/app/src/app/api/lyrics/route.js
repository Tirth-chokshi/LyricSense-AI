import extractLyrics from "@/lib/extractLyrics";
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const lyrics = await extractLyrics(url);

    if (!lyrics) {
      return Response.json({ error: "Lyrics not found" }, { status: 404 });
    }

    return Response.json({ lyrics });
  } catch (error) {
    console.error("Lyrics API error:", error);
    return Response.json(
      { error: "Failed to extract lyrics" },
      { status: 500 }
    );
  }
}
