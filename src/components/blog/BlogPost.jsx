import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPostBySlug, getReadingTimeMinutes } from '../../lib/posts';
import SectionHeader from '../shell/SectionHeader';

const mdComponents = {
  h1: ({ children }) => <h2 style={{ marginTop: '2rem' }}>{'// '}{children}</h2>,
  h2: ({ children }) => <h2 style={{ marginTop: '2rem' }}>{'// '}{children}</h2>,
  h3: ({ children }) => <h3 style={{ marginTop: '1.5rem', color: 'var(--fg-dim)' }}>{'// '}{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '2px solid var(--fg-dim)',
      paddingLeft: '1rem', margin: '1rem 0', fontStyle: 'italic', color: 'var(--fg-dim)',
    }}>{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} style={{ width: '100%', border: '1px solid var(--fg-faint)', borderRadius: 4, margin: '1rem 0' }} />
  ),
  code({ inline, className, children }) {
    const match = /language-(\w+)/.exec(className || '');
    if (inline) {
      return (
        <code style={{ background: 'var(--fg-faint)', padding: '0 4px', borderRadius: 3 }}>
          {children}
        </code>
      );
    }
    return (
      <SyntaxHighlighter language={match ? match[1] : 'text'} style={vscDarkPlus} PreTag="div">
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const minutes = getReadingTimeMinutes(post.content);

  return (
    <article style={{ maxWidth: 'var(--max-prose)' }}>
      <SectionHeader label={`blog / ${post.slug}`}>{post.title}</SectionHeader>
      <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        {post.date} · {minutes} min read · {post.tags.map((t) => `#${t}`).join(' · ')}
      </div>
      <div style={{ lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {post.content}
        </ReactMarkdown>
      </div>
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--fg-faint)', paddingTop: '1rem' }}>
        <Link to="/blog" style={{ color: 'var(--fg-dim)' }}>back to blog</Link>
      </div>
    </article>
  );
}
