import matter from 'gray-matter';

function loadPostsWebpack() {
  const req = require.context('!!raw-loader!../content/posts', false, /\.md$/);
  return req.keys().map((key) => {
    const raw = req(key).default;
    const { data, content } = matter(raw);
    return {
      title: data.title,
      date: data.date,
      slug: data.slug,
      excerpt: data.excerpt,
      tags: data.tags || [],
      content,
    };
  });
}

function loadPostsNode() {
  // eslint-disable-next-line
  const fs = require('fs');
  // eslint-disable-next-line
  const path = require('path');
  const dir = path.resolve(__dirname, '../content/posts');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      return {
        title: data.title,
        date: data.date,
        slug: data.slug,
        excerpt: data.excerpt,
        tags: data.tags || [],
        content,
      };
    });
}

const _posts = (typeof require.context === 'function'
  ? loadPostsWebpack()
  : loadPostsNode()
).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

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
