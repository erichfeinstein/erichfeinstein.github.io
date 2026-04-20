import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Music from './components/Music';
import Nav from './components/shell/Nav';
import Intro from './components/shell/Intro';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

const Background = lazy(() => import('./components/shell/Background'));

function App() {
  const location = useLocation();

  return (
    <>
      <Intro />
      <Suspense fallback={null}><Background /></Suspense>
      <Nav />
      <main style={{ paddingTop: 64, paddingInline: 24, paddingBottom: 96, maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Routes location={location}>
              <Route path="/" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/music" element={<Music />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
