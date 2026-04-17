import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MOCK_CVES = [
  { id: 'CVE-2024-21415', severity: 'critical', score: 9.8, product: 'Microsoft Windows', message: 'Critical Remote Code Execution vulnerability in Windows TCP/IP' },
  { id: 'CVE-2024-10255', severity: 'high', score: 8.5, product: 'Adobe Acrobat Reader', message: 'Out-of-bounds read vulnerability leading to arbitrary code execution' },
  { id: 'CVE-2024-0012', severity: 'critical', score: 9.9, product: 'Google Chrome', message: 'Type Confusion in V8 engine' },
  { id: 'CVE-2024-4411', severity: 'medium', score: 6.5, product: 'Node.js', message: 'Denial of Service via poorly formed URL' },
];

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      let index = 0;
      let isActive = true;

      const emitLoop = async () => {
        while (isActive) {
          if (index < MOCK_CVES.length) {
            const cve = MOCK_CVES[index];
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(cve)}\n\n`));
            } catch (e) {
              isActive = false;
              break;
            }
            index++;
          } else {
            const randomCVE = {
              id: `CVE-2024-[NEW]-${Math.floor(Math.random() * 9000) + 1000}`,
              severity: Math.random() > 0.8 ? 'critical' : 'medium',
              score: (Math.random() * 4 + 6).toFixed(1),
              product: 'Enterprise Asset',
              message: 'Newly detected vulnerability pattern via Threat Intelligence Feed.'
            };
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(randomCVE)}\n\n`));
            } catch (e) {
              isActive = false;
              break;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 8000));
        }
      };

      emitLoop();

      request.signal.addEventListener('abort', () => {
        isActive = false;
        try { controller.close(); } catch(e) {}
      });
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
