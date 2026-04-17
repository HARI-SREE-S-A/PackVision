import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      const steps = [
        '[1/5] Initializing workspace and validating source parameters...',
        '[1/5] Done.',
        '[2/5] Downloading installer binaries from Blob storage...',
        '[2/5] Done. Starting packaging engine...',
        '[3/5] Converting installer to Intunewin format via Win32 Content Prep Tool...',
        '[3/5] Compressing contents...',
        '[3/5] Done. Intunewin package created.',
        '[4/5] Authenticating with Microsoft Intune (Graph API)...',
        '[4/5] Uploading package blocks: 25%...',
        '[4/5] Uploading package blocks: 50%...',
        '[4/5] Uploading package blocks: 100%...',
        '[4/5] Committing app configuration settings...',
        '[4/5] Done.',
        '[5/5] Assigning target Azure AD Groups...',
        '[5/5] Application deployment created successfully!',
      ];

      for (const step of steps) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: step })}\n\n`));
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
