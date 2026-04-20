export const CATEGORIES = {
  lang:    { label: 'languages',       hue: 0 },
  style:   { label: 'styling',         hue: 320 },
  react:   { label: 'react',           hue: 190 },
  backend: { label: 'backend',         hue: 140 },
  test:    { label: 'testing',         hue: 50 },
  api:     { label: 'apis',            hue: 260 },
  media:   { label: 'audio/media',     hue: 20 },
  build:   { label: 'build tools',     hue: 90 },
  db:      { label: 'databases',       hue: 210 },
  cloud:   { label: 'cloud',           hue: 170 },
  ci:      { label: 'ci/cd',           hue: 30 },
  docker:  { label: 'containers',      hue: 200 },
  pay:     { label: 'integrations',    hue: 300 },
  obs:     { label: 'observability',   hue: 10 },
  ai:      { label: 'ai / llm',        hue: 280 },
  exp:     { label: 'experimentation', hue: 60 },
  prac:    { label: 'practices',       hue: 0 },
};

export const NODES = [
  // id, label, category
  ['javascript', 'JavaScript', 'lang'],
  ['typescript', 'TypeScript', 'lang'],
  ['python', 'Python', 'lang'],
  ['java', 'Java', 'lang'],
  ['bash', 'Bash', 'lang'],
  ['sql', 'SQL', 'lang'],

  ['html', 'HTML', 'style'],
  ['css', 'CSS', 'style'],
  ['sass', 'Sass', 'style'],
  ['tailwind', 'Tailwind', 'style'],
  ['styled-components', 'Styled Components', 'style'],
  ['emotion', 'Emotion', 'style'],
  ['css-modules', 'CSS Modules', 'style'],
  ['flexbox', 'Flexbox', 'style'],
  ['grid', 'Grid', 'style'],

  ['react', 'React', 'react'],
  ['react-native', 'React Native', 'react'],
  ['nextjs', 'Next.js', 'react'],
  ['redux', 'Redux', 'react'],
  ['react-query', 'React Query', 'react'],
  ['zustand', 'Zustand', 'react'],
  ['react-hook-form', 'React Hook Form', 'react'],
  ['react-router', 'React Router', 'react'],
  ['mui', 'MUI', 'react'],

  ['node', 'Node.js', 'backend'],
  ['express', 'Express', 'backend'],
  ['fastapi', 'FastAPI', 'backend'],
  ['sqlalchemy', 'SQLAlchemy', 'backend'],
  ['alembic', 'Alembic', 'backend'],
  ['pydantic', 'Pydantic', 'backend'],

  ['jest', 'Jest', 'test'],
  ['jasmine', 'Jasmine', 'test'],
  ['rtl', 'React Testing Library', 'test'],
  ['cypress', 'Cypress', 'test'],
  ['playwright', 'Playwright', 'test'],
  ['pytest', 'pytest', 'test'],

  ['rest', 'REST', 'api'],
  ['graphql', 'GraphQL', 'api'],
  ['grpc', 'gRPC', 'api'],
  ['protobuf', 'Protobuf', 'api'],
  ['websockets', 'WebSockets', 'api'],
  ['jwt', 'JWT', 'api'],
  ['oauth', 'OAuth', 'api'],
  ['webhooks', 'Webhooks', 'api'],
  ['signed-urls', 'Signed URLs', 'api'],

  ['web-audio', 'Web Audio API', 'media'],
  ['media-session', 'MediaSession API', 'media'],
  ['howler', 'Howler.js', 'media'],

  ['webpack', 'Webpack', 'build'],
  ['vite', 'Vite', 'build'],
  ['babel', 'Babel', 'build'],
  ['eslint', 'ESLint', 'build'],
  ['prettier', 'Prettier', 'build'],
  ['ruff', 'Ruff', 'build'],
  ['storybook', 'Storybook', 'build'],
  ['npm', 'npm', 'build'],
  ['yarn', 'yarn', 'build'],
  ['pnpm', 'pnpm', 'build'],

  ['postgres', 'PostgreSQL', 'db'],
  ['sqlite', 'SQLite', 'db'],

  ['aws', 'AWS', 'cloud'],
  ['gcp', 'GCP', 'cloud'],
  ['cloud-run', 'Cloud Run', 'cloud'],
  ['cloud-storage', 'Cloud Storage', 'cloud'],
  ['secret-manager', 'Secret Manager', 'cloud'],
  ['artifact-registry', 'Artifact Registry', 'cloud'],
  ['cloudflare', 'Cloudflare', 'cloud'],
  ['cf-pages', 'Cloudflare Pages', 'cloud'],
  ['cf-workers', 'Cloudflare Workers', 'cloud'],
  ['neon', 'Neon', 'cloud'],
  ['railway', 'Railway', 'cloud'],

  ['git', 'Git', 'ci'],
  ['github', 'GitHub', 'ci'],
  ['gh-actions', 'GitHub Actions', 'ci'],
  ['jenkins', 'Jenkins', 'ci'],
  ['spinnaker', 'Spinnaker', 'ci'],
  ['circleci', 'CircleCI', 'ci'],

  ['docker', 'Docker', 'docker'],
  ['docker-compose', 'Docker Compose', 'docker'],

  ['stripe', 'Stripe', 'pay'],
  ['sendgrid', 'SendGrid', 'pay'],

  ['datadog', 'Datadog', 'obs'],
  ['sentry', 'Sentry', 'obs'],

  ['claude-api', 'Claude API', 'ai'],
  ['claude-code', 'Claude Code', 'ai'],
  ['cursor', 'Cursor', 'ai'],
  ['copilot', 'GitHub Copilot', 'ai'],
  ['gemini-api', 'Gemini API', 'ai'],
  ['aidlc', 'AIDLC', 'ai'],

  ['devcycle', 'DevCycle', 'exp'],
  ['taplytics', 'Taplytics', 'exp'],

  ['agile', 'Agile/Scrum', 'prac'],
  ['tdd', 'TDD', 'prac'],
  ['a11y', 'Accessibility (WCAG/ARIA)', 'prac'],
  ['ab-testing', 'A/B Testing', 'prac'],
  ['feature-flags', 'Feature Flags', 'prac'],
  ['i18n', 'i18n', 'prac'],
  ['seo', 'SEO', 'prac'],
  ['security', 'Security Review', 'prac'],
  ['rate-limiting', 'Rate Limiting', 'prac'],
  ['cicd', 'CI/CD', 'prac'],
  ['monorepos', 'Monorepos', 'prac'],
  ['git-hooks', 'Git Hooks', 'prac'],
];

// Pairs of related node ids. Undirected edges; each pair listed once.
export const EDGES = [
  // React ecosystem internal
  ['react', 'typescript'], ['react', 'javascript'], ['react', 'nextjs'], ['react', 'react-native'],
  ['react', 'redux'], ['react', 'react-query'], ['react', 'zustand'],
  ['react', 'react-hook-form'], ['react', 'react-router'], ['react', 'mui'], ['react', 'rtl'],
  ['react', 'jest'], ['react', 'cypress'], ['react', 'playwright'], ['react', 'storybook'],

  // Styling
  ['css', 'html'], ['css', 'sass'], ['css', 'tailwind'], ['css', 'styled-components'],
  ['css', 'emotion'], ['css', 'css-modules'], ['css', 'flexbox'], ['css', 'grid'],
  ['styled-components', 'emotion'],

  // Backend
  ['python', 'fastapi'], ['fastapi', 'sqlalchemy'], ['fastapi', 'pydantic'], ['fastapi', 'alembic'],
  ['sqlalchemy', 'postgres'], ['sqlalchemy', 'sqlite'], ['alembic', 'postgres'],
  ['node', 'express'], ['node', 'javascript'], ['node', 'typescript'],
  ['python', 'pytest'], ['python', 'ruff'],

  // API / Protocols
  ['rest', 'express'], ['rest', 'fastapi'], ['graphql', 'react-query'],
  ['jwt', 'fastapi'], ['jwt', 'oauth'], ['webhooks', 'stripe'], ['signed-urls', 'cloud-storage'],
  ['grpc', 'protobuf'],

  // Audio/media
  ['howler', 'web-audio'], ['howler', 'media-session'], ['howler', 'javascript'],

  // Build tooling
  ['webpack', 'javascript'], ['vite', 'react'], ['babel', 'javascript'], ['babel', 'typescript'],
  ['eslint', 'prettier'], ['eslint', 'javascript'], ['eslint', 'typescript'],
  ['npm', 'yarn'], ['npm', 'pnpm'], ['yarn', 'pnpm'],

  // Databases
  ['postgres', 'sql'], ['sqlite', 'sql'],

  // Cloud: GCP cluster
  ['gcp', 'cloud-run'], ['gcp', 'cloud-storage'], ['gcp', 'secret-manager'],
  ['gcp', 'artifact-registry'],
  // Cloudflare cluster
  ['cloudflare', 'cf-pages'], ['cloudflare', 'cf-workers'],
  // Hosted DBs
  ['neon', 'postgres'], ['railway', 'postgres'],

  // CI/CD
  ['git', 'github'], ['github', 'gh-actions'], ['gh-actions', 'cicd'],
  ['jenkins', 'cicd'], ['spinnaker', 'cicd'], ['circleci', 'cicd'],

  // Containers
  ['docker', 'docker-compose'], ['docker', 'cloud-run'],

  // Payments
  ['stripe', 'webhooks'], ['stripe', 'fastapi'],

  // Observability
  ['datadog', 'sentry'],

  // AI
  ['claude-api', 'claude-code'], ['claude-code', 'aidlc'], ['cursor', 'aidlc'],
  ['copilot', 'aidlc'], ['gemini-api', 'claude-api'],

  // Experimentation
  ['devcycle', 'feature-flags'], ['devcycle', 'ab-testing'],
  ['taplytics', 'feature-flags'], ['taplytics', 'ab-testing'],

  // Practices cross-connections
  ['tdd', 'jest'], ['tdd', 'pytest'], ['tdd', 'rtl'],
  ['a11y', 'html'], ['a11y', 'css'],
  ['cicd', 'gh-actions'], ['cicd', 'docker'],
  ['security', 'jwt'], ['security', 'signed-urls'], ['security', 'rate-limiting'],
  ['git-hooks', 'git'], ['monorepos', 'github'],

  // Orphan anchors
  ['java', 'javascript'],        // lang neighbors
  ['bash', 'git'],               // shell scripting → git
  ['jasmine', 'jest'],           // test framework siblings
  ['websockets', 'rest'],        // API transport siblings
  ['aws', 'gcp'],                // cloud siblings
  ['sendgrid', 'fastapi'],       // email via backend
  ['agile', 'github'],           // practice neighbor
  ['i18n', 'react'],             // i18n is typically a React concern
  ['seo', 'html'],               // SEO relies on HTML
];
