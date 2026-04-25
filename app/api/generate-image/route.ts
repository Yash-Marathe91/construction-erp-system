import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.POLLINATIONS_API_KEY;

    // Use a high-quality, stable prompt preset
    const fullPrompt = `${prompt}, photorealistic architecture, ultra detailed, 8k, cinematic lighting`;
    
    // Using the authenticated image endpoint
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    const response = await fetch(imageUrl, {
      method: "GET",
      // Include the key if it's actually an OpenAI/Stability key (often the case with sk_ keys)
      headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
        throw new Error(`AI Server responded with ${response.status}`);
    }

    // Convert to base64 to ensure the browser doesn't have loading/cors issues
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/webp;base64,${base64Image}`;
    
    return NextResponse.json({ url: dataUrl });

  } catch (error: any) {
    console.error("Image Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
