// Node/Jest implementation of the posts loader.
// Used via jest moduleNameMapper instead of posts.js (which uses require.context).
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function parsePost(raw) {
  const { data, content } = matter(raw);
  return {
    title: data.title,
    date: data.date,
    slug: data.slug,
    excerpt: data.excerpt,
    tags: data.tags || [],
    content,
  };
}

const dir = path.resolve(__dirname, '../content/posts');
const _posts = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parsePost(fs.readFileSync(path.join(dir, f), 'utf8')))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

function getAllPosts() {
  return _posts.map(({ content, ...meta }) => meta);
}

function getPostBySlug(slug) {
  return _posts.find((p) => p.slug === slug) || null;
}

function getReadingTimeMinutes(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

module.exports = { getAllPosts, getPostBySlug, getReadingTimeMinutes, parsePost };
