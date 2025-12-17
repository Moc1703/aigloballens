import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    // Check API Key for authentication
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.SYNC_API_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { error: 'Server configuration error: SYNC_API_KEY not set' },
        { status: 500 }
      );
    }

    if (apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const articles = body.articles;

    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: articles array required' },
        { status: 400 }
      );
    }

    // Upsert articles into database
    let insertedCount = 0;
    let updatedCount = 0;

    for (const article of articles) {
      const {
        id,
        title,
        summary,
        content,
        original_url,
        image_url,
        source,
        published_at,
        category,
      } = article;

      // Check if article exists
      const existing = await sql`
        SELECT id FROM articles WHERE id = ${id}
      `;

      if (existing.rows.length > 0) {
        // Update existing
        await sql`
          UPDATE articles
          SET 
            title = ${title},
            summary = ${summary},
            content = ${content},
            original_url = ${original_url},
            image_url = ${image_url},
            source = ${source},
            published_at = ${published_at},
            category = ${category}
          WHERE id = ${id}
        `;
        updatedCount++;
      } else {
        // Insert new
        await sql`
          INSERT INTO articles (
            id, title, summary, content, original_url,
            image_url, source, published_at, category
          ) VALUES (
            ${id}, ${title}, ${summary}, ${content}, ${original_url},
            ${image_url}, ${source}, ${published_at}, ${category}
          )
        `;
        insertedCount++;
      }
    }

    // Cleanup: Delete articles older than 14 days
    const cleanupResult = await sql`
      DELETE FROM articles 
      WHERE created_at < NOW() - INTERVAL '14 days'
    `;
    const deletedCount = cleanupResult.rowCount || 0;

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      updated: updatedCount,
      deleted: deletedCount,
      total: articles.length,
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Also allow GET to check if endpoint is alive
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Sync API endpoint is active' 
  });
}
