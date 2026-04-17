import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TOOLS = [
  {
    name: 'sync_intune_devices',
    description: 'Synchronizes device compliance and posture from Microsoft Intune.',
    inputSchema: {
      type: 'object',
      properties: {
        forceFullSync: { type: 'boolean', description: 'Force a full sync instead of delta.' }
      }
    }
  },
  {
    name: 'create_servicenow_incident',
    description: 'Creates a security incident or general incident in ServiceNow for Eugene/EUC issues.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string', enum: ['high', 'medium', 'low'] }
      },
      required: ['title', 'description']
    }
  },
  {
    name: 'deploy_application',
    description: 'Deploys an MSIX or Intunewin packaged application to a targeted Intune group.',
    inputSchema: {
      type: 'object',
      properties: {
        appName: { type: 'string' },
        targetGroup: { type: 'string' }
      },
      required: ['appName', 'targetGroup']
    }
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Standard MCP JSON-RPC
    if (body.jsonrpc !== '2.0') {
      return NextResponse.json({ error: { code: -32600, message: 'Invalid Request' } }, { status: 400 });
    }

    const { id, method, params } = body;

    // Route: tools/list
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      });
    }

    // Route: tools/call
    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};
      
      let resultText = '';

      if (name === 'sync_intune_devices') {
        // Here we provision for real Intune Graph API
        resultText = 'Successfully synchronized 3,421 devices from Intune mockup environment.';
      } else if (name === 'create_servicenow_incident') {
        resultText = `Mock ServiceNow Incident INC88390 created: ${args?.title || 'Unknown'}`;
      } else if (name === 'deploy_application') {
        resultText = `Successfully created deployment intent for ${args?.appName} targeting ${args?.targetGroup}.`;
      } else {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: 'Method not found' }
        });
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: resultText }],
          isError: false
        }
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: 'Method not found' }
    });

  } catch (error) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' }
    }, { status: 500 });
  }
}
