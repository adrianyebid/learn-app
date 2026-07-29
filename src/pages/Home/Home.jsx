import { useNavigate } from 'react-router-dom'
import Box from '../../components/Box/Box'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'

const ARTICLES = [
  {
    tag: 'Design',
    title: 'Building a design system',
    date: 'Jul 15, 2026',
    timeToRead: '5 min read',
    excerpt: 'A short excerpt of dynamic content passed through props.',
  },
  {
    tag: 'React',
    title: 'Thinking in components',
    date: 'Jul 12, 2026',
    timeToRead: '8 min read',
    excerpt: 'Split the UI into independent, reusable pieces.',
  },
  {
    tag: 'Routing',
    title: 'Navigating a single-page app',
    date: 'Jul 10, 2026',
    timeToRead: '4 min read',
    excerpt: 'How react-router keeps the URL and the UI in sync.',
  },
]

/** Landing page and the application's default route. */
function Home() {
  const navigate = useNavigate()

  return (
    <section>
      <div className="rounded-2xl bg-surface p-10 text-center shadow-sm ring-1 ring-line">
        <h1 className="text-3xl font-bold text-ink">Welcome to learn-app</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Grow your skills with hands-on training. Explore courses, join as a
          student or trainer, and manage everything from your account.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(PATHS.training)}>
            Browse training
          </Button>
          <Button variant="outline" onClick={() => navigate(PATHS.joinUs)}>
            Join us
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <Box
            key={article.title}
            tag={article.tag}
            title={article.title}
            date={article.date}
            timeToRead={article.timeToRead}
          >
            {article.excerpt}
          </Box>
        ))}
      </div>
    </section>
  )
}

export default Home
