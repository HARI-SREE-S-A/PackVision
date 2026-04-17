import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, risk, type } = body;

    // Simulated Response
    const changeId = `CHG${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    return NextResponse.json({
      success: true,
      message: 'Change Request successfully logged via mock API',
      data: {
        change_id: changeId,
        title,
        status: 'Assess',
        risk: risk || 'High',
        type: type || 'Emergency',
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create CHG' }, { status: 500 });
  }
}
