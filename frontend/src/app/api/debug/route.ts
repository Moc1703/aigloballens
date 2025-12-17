import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Count articles
    const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
    const count = countResult.rows[0]?.count || 0;
    
    // Get latest 3 articles
    const latestResult = await sql`
      SELECT id, title, source, published_at 
      FROM articles 
      ORDER BY created_at DESC 
      LIMIT 3
    `;
    
    return NextResponse.json({
      status: 'ok',
      database_connected: true,
      article_count: count,
      latest_articles: latestResult.rows
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database_connected: false,
      error: error.message
    }, { status: 500 });
  }
}
