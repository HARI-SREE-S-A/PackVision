import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, category } = body;

    // TODO: Implement actual ServiceNow REST API integration here
    /*
      const response = await fetch(`${process.env.SERVICENOW_INSTANCE}/api/now/table/incident`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${process.env.SERVICENOW_TOKEN}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ short_description: title, description, priority })
      });
    */

    // Simulated Response
    const incidentId = `INC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    return NextResponse.json({
      success: true,
      message: 'Incident successfully logged via mock API',
      data: {
        incident_id: incidentId,
        title,
        status: 'New',
        priority: priority || 'Medium',
        category: category || 'EUC Endpoint',
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create incident' }, { status: 500 });
  }
}

export async function GET() {
  // Simulated List Response
  return NextResponse.json({
    success: true,
    data: [
      { incident_id: 'INC092834', title: 'Outlook Crashing on Windows 11', status: 'In Progress' },
      { incident_id: 'INC092835', title: 'Application Installation Failure for Adobe', status: 'New' }
    ]
  });
}
