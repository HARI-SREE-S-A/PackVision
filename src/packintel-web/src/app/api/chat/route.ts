import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { messages, apiKey, isMockMode } = await request.json();

    const encoder = new TextEncoder();

    if (!isMockMode && apiKey && apiKey.length > 5) {
      try {
        const contents = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        if (contents.length > 0 && contents[0].role === 'user') {
          contents[0].parts[0].text = `You are PackIntel AI, an EUC and Intune packaging expert. You assist engineers in deploying applications, writing Powershell remediation scripts, reading Intune logs, and managing vulnerabilities. Keep your answers clear, concise, and professional.\n\nUser Question: ${contents[0].parts[0].text}`;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });

        if (!response.ok || !response.body) {
          throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        return new NextResponse(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
          },
        });
      } catch (e: any) {
        console.error('Gemini connection failed:', e);
        // Fallthrough to mock
      }
    }

    const customReadable = new ReadableStream({
      async start(controller) {
        const mockText = `I'm operating in **Simulated Mock Mode** because no valid Gemini API key was provided. 

Here is an example Intune remediation script you might find useful:

\`\`\`powershell
# Script to cleanup temporary packaging files
$tempPath = "C:\\Windows\\Temp\\PackIntel"
if (Test-Path $tempPath) {
    Remove-Item -Path $tempPath -Recurse -Force
    Write-Output "Cleaned up PackIntel temp files."
} else {
    Write-Output "No temp files found."
}
\`\`\`

To enable real-time generative capabilities, please disable Mock Mode and add a valid Google Gemini API Key in the **Administration -> Integrations** panel.`;
        
        const chunks = mockText.match(/.{1,4}/g) || [];
        for (const chunk of chunks) {
          const payload = {
            candidates: [{ content: { parts: [{ text: chunk }] } }]
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          await new Promise(resolve => setTimeout(resolve, 30));
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
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
