import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get('url');
    
    // When no URL is provided, show the default marketing OG image
    const isDefault = !urlParam;
    const displayUrl = urlParam || 'your-site.com';

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
            backgroundColor: '#050508',
            // Create a pseudo-Spline glow effect using CSS gradients
            backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(88,28,235,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 100%, rgba(234,88,12,0.3) 0%, transparent 60%)',
          }}
        >
          {/* Glass Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 80px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 100, marginBottom: 30 }}>🔥</div>
            
            <div
              style={{
                display: 'flex',
                fontSize: 70,
                fontWeight: 800,
                color: 'white',
                marginBottom: 20,
                letterSpacing: '-0.03em',
              }}
            >
              Roast My Website
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: 36,
                color: '#a1a1aa',
                marginBottom: 10,
              }}
            >
              {isDefault ? 'The brutal truth about' : 'AI senior dev is reviewing:'}
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: 55,
                fontWeight: 800,
                color: '#f97316', // orange-500
              }}
            >
              {displayUrl}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
