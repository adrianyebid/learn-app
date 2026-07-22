import Table from '../../components/Table/Table'

const COLUMNS = [
  { key: 'course', label: 'Course' },
  { key: 'level', label: 'Level' },
  { key: 'duration', label: 'Duration' },
  { key: 'status', label: 'Status' },
]

const COURSES = [
  { course: 'React Fundamentals', level: 'Beginner', duration: '6 weeks', status: 'Open' },
  { course: 'Advanced TypeScript', level: 'Intermediate', duration: '4 weeks', status: 'Open' },
  { course: 'Frontend Architecture', level: 'Advanced', duration: '8 weeks', status: 'Waitlist' },
]

/** Public catalogue of available training courses. */
function Training() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-ink">Training</h1>
      <p className="mt-1 text-muted">Available courses and their current status.</p>
      <div className="mt-6">
        <Table columns={COLUMNS} rows={COURSES} />
      </div>
    </section>
  )
}

export default Training
