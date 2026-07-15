import { useState } from 'react'
import Button from '../Button/Button'

/**
 * My Account List - personal dashboard showing account details with a
 * view mode and an "Edit Profile" mode for updating personal data.
 * Data is passed via props (pure w.r.t. props).
 */
const DEFAULT_USER = {
  firstName: 'Jane',
  lastName: 'Cooper',
  email: 'jane.cooper@example.com',
  phone: '+1 202 555 0134',
  address: '4517 Washington Ave, Kentucky',
}

const FIELDS = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
]

function MyAccountList({ user = DEFAULT_USER, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user)

  const save = () => {
    setEditing(false)
    onSave?.(draft)
  }

  return (
    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm ring-1 ring-line">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-light text-lg font-semibold text-brand">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <dl className="mt-6 divide-y divide-line">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted">{f.label}</dt>
            {editing ? (
              <input
                value={draft[f.key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                }
                className="w-1/2 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-brand"
              />
            ) : (
              <dd className="text-sm font-medium text-ink">{user[f.key]}</dd>
            )}
          </div>
        ))}
      </dl>

      {editing && (
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(user)
              setEditing(false)
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={save}>
            Save changes
          </Button>
        </div>
      )}
    </div>
  )
}

export default MyAccountList
