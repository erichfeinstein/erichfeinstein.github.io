import { getAllPosts, getPostBySlug } from './posts';

describe('posts loader', () => {
  test('getAllPosts returns posts sorted newest-first', () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  test('each post has required frontmatter fields', () => {
    for (const p of getAllPosts()) {
      expect(typeof p.title).toBe('string');
      expect(typeof p.date).toBe('string');
      expect(typeof p.slug).toBe('string');
      expect(typeof p.excerpt).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });

  test('getPostBySlug returns full post content', () => {
    const p = getPostBySlug('claude-redesigned-my-website');
    expect(p).not.toBeNull();
    expect(p.title).toBe('i let claude redesign my website');
    expect(p.content).toMatch(/full redesign/i);
  });

  test('getPostBySlug returns null for unknown slug', () => {
    expect(getPostBySlug('does-not-exist')).toBeNull();
  });
});
