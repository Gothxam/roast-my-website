import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Params from the analyze results
    const score = searchParams.get('score') || '0';
    const rawUrl = searchParams.get('url') || 'website';
    const punchline = searchParams.get('punchline') || "The roast you didn't ask for.";

    // Clean URL for display
    let displayUrl = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (displayUrl.length > 25) displayUrl = displayUrl.substring(0, 22) + '...';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              padding: '60px',
              width: '90%',
              maxWidth: '1000px',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header: URL */}
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', fontSize: '24px', marginBottom: '20px', letterSpacing: '4px', textTransform: 'uppercase' }}>
              Auditing: {displayUrl}
            </div>

            {/* Score Ring / Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
              <div style={{ fontSize: '100px', fontWeight: 'bold', color: '#fff', background: 'linear-gradient(to bottom right, #ff4d4d, #f9cb28)', backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>
                {score}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>Vibe Score</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>🔥 Brutally Honest</div>
              </div>
            </div>

            {/* The Punchline */}
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '1.2',
                marginTop: '10px',
              }}
            >
              "{punchline}"
            </div>

            {/* Branding Footer */}
            <div
              style={{
                display: 'flex',
                marginTop: '60px',
                padding: '10px 30px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>RoastMyWebsite.ai</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
