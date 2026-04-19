import fm from 'front-matter';

export function parsePost(raw) {
  const { attributes, body } = fm(raw);
  return {
    title: attributes.title,
    date: attributes.date,
    slug: attributes.slug,
    excerpt: attributes.excerpt,
    tags: attributes.tags || [],
    content: body,
  };
}

const req = require.context('!!raw-loader!../content/posts', false, /\.md$/);

const _posts = req
  .keys()
  .map((key) => parsePost(req(key).default))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getAllPosts() {
  return _posts.map(({ content, ...meta }) => meta);
}

export function getPostBySlug(slug) {
  return _posts.find((p) => p.slug === slug) || null;
}

export function getReadingTimeMinutes(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}
