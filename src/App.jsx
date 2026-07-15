import { useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Button from './components/Button/Button'
import Box from './components/Box/Box'
import JoinUsBox from './components/JoinUsBox/JoinUsBox'
import LoginForm from './components/LoginForm/LoginForm'
import RegistrationForm from './components/RegistrationForm/RegistrationForm'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import Navigation from './components/Navigation/Navigation'
import Table from './components/Table/Table'
import MyAccountList from './components/MyAccountList/MyAccountList'
import MiniProfile from './components/MiniProfile/MiniProfile'
import Modal from './components/Modal/Modal'
import Toaster from './components/Toaster/Toaster'
import DatePicker from './components/DatePicker/DatePicker'

function Section({ title, children }) {
  return (
    <section className="py-8">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toasts, setToasts] = useState([
    { id: 1, type: 'success', message: 'Profile saved successfully' },
  ])
  const [date, setDate] = useState('')

  const addToast = () =>
    setToasts((t) => [
      ...t,
      { id: Date.now(), type: 'info', message: 'This is a toast notification' },
    ])

  return (
    <div className="min-h-full">
      <Header
        onSignIn={() => {}}
        onJoinUs={() => {}}
      />

      <main className="mx-auto max-w-6xl px-4">
        {/* Intro */}
        <div className="flex items-center justify-between py-8">
          <div>
            <Breadcrumbs />
            <h1 className="mt-2 text-3xl font-bold text-ink">
              Component library
            </h1>
            <p className="mt-1 text-muted">
              Markup skeleton for learn-app — Task: Implement markup
            </p>
          </div>
          <MiniProfile onSignOut={() => {}} />
        </div>

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <Button icon={<span>★</span>}>With icon</Button>
          </div>
        </Section>

        <Section title="Box">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Box tag="Design" title="Building a design system" date="Jul 15, 2026" timeToRead="5 min read">
              A short excerpt of dynamic content passed through props.
            </Box>
            <Box tag="React" title="Thinking in components" date="Jul 12, 2026" timeToRead="8 min read">
              Split the UI into independent, reusable pieces.
            </Box>
            <Box tag="CSS" title="Utility-first styling" date="Jul 10, 2026" timeToRead="4 min read">
              Styling the skeleton with Tailwind CSS.
            </Box>
          </div>
        </Section>

        <Section title="Join Us Box">
          <div className="grid gap-6 sm:grid-cols-2">
            <JoinUsBox role="Student" onSelect={() => {}} />
            <JoinUsBox role="Trainer" onSelect={() => {}} />
          </div>
        </Section>

        <Section title="Login & Registration forms">
          <div className="flex flex-wrap gap-6">
            <LoginForm onSubmit={() => {}} />
            <RegistrationForm onSubmit={() => {}} />
          </div>
        </Section>

        <Section title="My Account List">
          <MyAccountList onSave={() => {}} />
        </Section>

        <Section title="Table">
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'status', label: 'Status' },
            ]}
            rows={[
              { name: 'Jane Cooper', role: 'Student', status: 'Active' },
              { name: 'Cody Fisher', role: 'Trainer', status: 'Active' },
              { name: 'Esther Howard', role: 'Student', status: 'Pending' },
            ]}
          />
        </Section>

        <Section title="Navigation (desktop)">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line">
            <Navigation />
          </div>
        </Section>

        <Section title="DatePicker, Modal & Toaster">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-56">
              <DatePicker value={date} onChange={setDate} />
            </div>
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button variant="secondary" onClick={addToast}>
              Show toast
            </Button>
          </div>
        </Section>
      </main>

      <Footer />

      <Modal
        open={modalOpen}
        title="Confirm action"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        This is a modal-box skeleton. It can be swapped for MUI / react-modal
        in a later stage.
      </Modal>

      <Toaster
        toasts={toasts}
        onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
      />
    </div>
  )
}

export default App
