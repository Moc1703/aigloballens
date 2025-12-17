import { sql } from '@vercel/postgres';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  original_url: string;
  image_url: string;
  source: string;
  published_at: string;
  category?: string;
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const { rows } = await sql<Article>`
      SELECT 
        id, title, summary, content, original_url,
        image_url, source, published_at, category
      FROM articles
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const { rows } = await sql<Article>`
      SELECT 
        id, title, summary, content, original_url,
        image_url, source, published_at, category
      FROM articles
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
