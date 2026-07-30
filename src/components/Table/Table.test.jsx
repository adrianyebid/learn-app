import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Table from './Table'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
]

describe('Table', () => {
  it('renders column headers and row cells', () => {
    render(<Table columns={columns} rows={[{ name: 'Ada', age: 30 }]} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('renders only the header row when there is no data', () => {
    render(<Table columns={columns} rows={[]} />)
    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
