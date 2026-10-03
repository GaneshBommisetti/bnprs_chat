import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Network, Plus, UsersRound, X } from 'lucide-react'

import './OrganizationTree.css'

type OrgPerson = {
  id: string
  name: string
  title: string
  department: string
  managerId: string | null
}

const initialPeople: OrgPerson[] = [
  { id: 'pattabhi', name: 'Pattabhi', title: 'CEO', department: 'Executive', managerId: null },
  { id: 'ramesh', name: 'Ramesh', title: 'CTO', department: 'Technology', managerId: 'pattabhi' },
  { id: 'ranjith', name: 'Ranjith', title: 'CCO', department: 'Commercial', managerId: 'pattabhi' },
  { id: 'murali', name: 'Murali', title: 'Technical Head', department: 'Technology', managerId: 'pattabhi' },
  { id: 'tejas', name: 'Tejas', title: 'Security Analyst', department: 'Technology', managerId: 'murali' },
  { id: 'vignesh', name: 'Vignesh', title: 'Security Architect', department: 'Technology', managerId: 'murali' },
  { id: 'anil', name: 'Anil', title: 'Infrastructure Engineer', department: 'Technology', managerId: 'murali' },
  { id: 'pallavi', name: 'Pallavi', title: 'Migrations Engineer', department: 'Technology', managerId: 'murali' },
  { id: 'deepa', name: 'Deepa', title: 'Release Manager', department: 'Technology', managerId: 'murali' },
  { id: 'sneha', name: 'Sneha', title: 'Product Manager', department: 'Product', managerId: 'pattabhi' },
]

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function OrganizationNode({ person, people, onDelete }: { person: OrgPerson; people: OrgPerson[]; onDelete: (personId: string) => void }) {
  const reports = people.filter((candidate) => candidate.managerId === person.id)

  return (
    <li className="org-tree-node">
      <article className={`org-person-card ${reports.length ? 'is-manager' : ''}`}>
        <span className="org-person-avatar">{getInitials(person.name)}</span>
        <span className="org-person-details">
          <strong>{person.name}</strong>
          <span>{person.title}</span>
          <small>{person.department}</small>
        </span>
        <div className="org-card-actions">
          {person.id !== 'pattabhi' ? (
            <button type="button" className="org-delete-button" onClick={() => onDelete(person.id)} aria-label={`Delete ${person.name}`}>
              Delete
            </button>
          ) : null}
          {reports.length ? <span className="org-report-count" aria-label={`${reports.length} direct reports`}>{reports.length}</span> : null}
        </div>
      </article>
      {reports.length ? (
        <ul className="org-tree-children">
          {reports.map((report) => <OrganizationNode key={report.id} person={report} people={people} onDelete={onDelete} />)}
        </ul>
      ) : null}
    </li>
  )
}

function loadPeople(): OrgPerson[] {
  try {
    const savedPeople = window.localStorage.getItem('bnprs-organization-tree')
    if (!savedPeople) return initialPeople
    const parsedPeople = JSON.parse(savedPeople) as OrgPerson[]
    if (Array.isArray(parsedPeople) && parsedPeople.some((person) => person.id === 'pattabhi')) {
      const normalizedPeople = parsedPeople.map((person) => person.id === 'murali' ? { ...person, managerId: 'pattabhi' } : person)
      if (normalizedPeople.length >= initialPeople.length) return normalizedPeople
      return initialPeople
    }
  } catch {
    return initialPeople
  }
  return initialPeople
}

export default function OrganizationTreePage() {
  const [people, setPeople] = useState<OrgPerson[]>(loadPeople)
  const [formOpen, setFormOpen] = useState(false)
  const [managerId, setManagerId] = useState('pattabhi')

  useEffect(() => {
    window.localStorage.setItem('bnprs-organization-tree', JSON.stringify(people))
  }, [people])

  const root = people.find((person) => person.id === 'pattabhi') ?? initialPeople[0]

  const handleDeletePerson = (personId: string) => {
    setPeople((currentPeople) => {
      const target = currentPeople.find((person) => person.id === personId)
      if (!target) return currentPeople
      return currentPeople
        .filter((person) => person.id !== personId)
        .map((person) => (person.managerId === personId ? { ...person, managerId: target.managerId ?? 'pattabhi' } : person))
    })
  }

  const handleAddPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const title = String(formData.get('title') ?? '').trim()
    const department = String(formData.get('department') ?? '').trim()
    if (!name || !title || !department) return

    setPeople((currentPeople) => [...currentPeople, {
      id: crypto.randomUUID(),
      name,
      title,
      department,
      managerId,
    }])
    event.currentTarget.reset()
    setManagerId('pattabhi')
    setFormOpen(false)
  }

  return (
    <main className="org-tree-page">
      <div className="org-tree-shell">
        <header className="org-tree-heading">
          <div>
            <p className="org-tree-eyebrow"><Network size={14} /> PEOPLE & REPORTING</p>
            <h1>BNPRS Tree</h1>
            <p className="org-tree-summary">{people.length} members <span /> {people.length - 1} reporting lines</p>
          </div>
          <button className="org-add-button" type="button" onClick={() => setFormOpen((open) => !open)} aria-expanded={formOpen}>
            {formOpen ? <X size={17} /> : <Plus size={17} />}
            {formOpen ? 'Close' : 'Add employee'}
          </button>
        </header>

        {formOpen ? (
          <form className="org-add-form" onSubmit={handleAddPerson}>
            <label>Name<input name="name" required placeholder="Employee name" /></label>
            <label>Job title<input name="title" required placeholder="e.g. Product Manager" /></label>
            <label>Department<input name="department" required placeholder="e.g. Product" /></label>
            <label>Reports to
              <select value={managerId} onChange={(event) => setManagerId(event.target.value)}>
                {people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.title}</option>)}
              </select>
            </label>
            <div className="org-form-actions">
              <button className="org-add-button" type="submit"><Plus size={16} /> Add to tree</button>
            </div>
          </form>
        ) : null}

        <section className="org-tree-panel" aria-label="BNPRS reporting structure">
          <div className="org-tree-panel-heading">
            <div><UsersRound size={17} /><h2>Reporting structure</h2></div>
            <span>{people.length} employees in the network</span>
          </div>
          <div className="org-tree-viewport">
            <ul className="org-tree-root">
              <OrganizationNode person={root} people={people} onDelete={handleDeletePerson} />
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}