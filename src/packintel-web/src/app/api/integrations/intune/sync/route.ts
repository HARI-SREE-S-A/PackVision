import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      const messages = [
        { type: 'info', message: 'Connecting to Microsoft Graph API...' },
        { type: 'info', message: 'Authenticated successfully. Starting device sync...' },
        { type: 'data', message: 'Synced 150 target groups.' },
        { type: 'data', message: 'Synced 45 line-of-business applications.' },
        { type: 'success', message: 'Intune synchronization completed successfully.' },
      ];

      for (const msg of messages) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
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
