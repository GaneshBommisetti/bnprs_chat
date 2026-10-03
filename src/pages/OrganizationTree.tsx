import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Code2, MessageCircle, Palette, Phone, Plus, ShoppingBag, Trash2, Truck, UsersRound, X } from 'lucide-react'

import './OrganizationTree.css'

type OrgPerson = {
  id: string
  name: string
  title: string
  department: string
  managerId: string | null
}

const initialPeople: OrgPerson[] = [
  { id: 'pattabhi', name: 'Pattabhi', title: 'Founder and CEO', department: 'Management', managerId: null },
  { id: 'ramesh', name: 'Ramesh', title: 'CTO', department: 'Management', managerId: 'pattabhi' },
  { id: 'ranjith', name: 'Ranjith', title: 'CCO', department: 'Management', managerId: 'pattabhi' },
  { id: 'murali', name: 'Murali', title: 'Technical Head', department: 'Management', managerId: 'pattabhi' },
  { id: 'ganesh', name: 'Ganesh', title: 'Engineering', department: 'Engineering', managerId: 'murali' },
  { id: 'venkatesh', name: 'Venkatesh', title: 'Engineering', department: 'Engineering', managerId: 'murali' },
  { id: 'suneel', name: 'Suneel', title: 'Operations', department: 'Operations', managerId: 'ranjith' },
  { id: 'venkat', name: 'Venkat', title: 'Operations', department: 'Operations', managerId: 'ranjith' },
  { id: 'balaji', name: 'Balaji', title: 'Engineering', department: 'Engineering', managerId: 'ramesh' },
]

const retiredDefaultIds = new Set(['vignesh', 'anil', 'pallavi', 'deepa', 'sneha'])

const departments = [
  { name: 'Management', summary: 'Founder & CEO · Company leadership', icon: BriefcaseBusiness },
  { name: 'Product', summary: 'AandhiPe · bRuID · mGate', icon: ShoppingBag, products: ['AandhiPe', 'bRuID', 'mGate'] },
  { name: 'Engineering', summary: 'Software · Security · Infrastructure', icon: Code2 },
  { name: 'Design', summary: 'Product and experience design', icon: Palette },
  { name: 'Operations', summary: 'Business and company operations', icon: Truck },
]

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function loadPeople(): OrgPerson[] {
  try {
    const savedPeople = window.localStorage.getItem('bnprs-organization-tree')
    if (!savedPeople) return initialPeople
    const parsedPeople = JSON.parse(savedPeople) as OrgPerson[]
    if (Array.isArray(parsedPeople) && parsedPeople.some((person) => person.id === 'pattabhi')) {
      const existing = parsedPeople
        .filter((person) => person.id !== 'tejas' && !retiredDefaultIds.has(person.id))
        .map((person) => ({
          ...person,
          department: person.department === 'Technology' ? 'Engineering' :
            person.department === 'Executive' || person.department === 'Commercial' ? 'Management' :
              person.department,
        }))
      const existingById = new Map(existing.map((person) => [person.id, person]))
      const normalizedDefaults = initialPeople.map((person) => {
        const savedPerson = existingById.get(person.id)
        return savedPerson
          ? { ...savedPerson, department: person.department, managerId: person.managerId, title: person.title }
          : person
      })
      const savedCustomPeople = existing.filter((person) => !initialPeople.some((initialPerson) => initialPerson.id === person.id))
      return [...normalizedDefaults, ...savedCustomPeople]
    }
  } catch {
    return initialPeople
  }
  return initialPeople
}

export default function OrganizationTreePage() {
  const [people, setPeople] = useState<OrgPerson[]>(loadPeople)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>('Management')
  const [managerId, setManagerId] = useState('pattabhi')
  const root = people.find((person) => person.id === 'pattabhi') ?? initialPeople[0]

  useEffect(() => {
    window.localStorage.setItem('bnprs-organization-tree', JSON.stringify(people))
  }, [people])

  const handleDeletePerson = (personId: string) => {
    setPeople((currentPeople) => {
      const target = currentPeople.find((person) => person.id === personId)
      if (!target || target.id === 'pattabhi') return currentPeople
      return currentPeople
        .filter((person) => person.id !== personId)
        .map((person) => (person.managerId === personId ? { ...person, managerId: target.managerId ?? root.id } : person))
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
    setManagerId(root.id)
    setFormOpen(false)
  }

  const visibleEmployees = selectedDepartment
    ? people.filter((person) => person.department === selectedDepartment)
    : []
  const renderOrgBranch = (person: OrgPerson): ReactNode => {
    const children = people.filter((candidate) => candidate.managerId === person.id)
    const contact = `/chat?contact=${encodeURIComponent(person.id)}&name=${encodeURIComponent(person.name)}`
    const manager = people.find((candidate) => candidate.id === person.managerId)
    return (
      <div className="org-chart-branch" key={person.id}>
        <article className="org-team-card">
          <span className="org-person-avatar">{getInitials(person.name)}</span>
          <div className="org-person-details">
            <strong>{person.name}</strong>
            <span>{person.title}</span>
            <small>{manager ? `Reports to ${manager.name}` : 'Company founder'}</small>
          </div>
          <div className="org-person-actions">
            <Link to={contact} aria-label={`Message ${person.name}`} title={`Message ${person.name}`}><MessageCircle size={15} /></Link>
            <Link to={`${contact}&call=audio`} aria-label={`Call ${person.name}`} title={`Call ${person.name}`}><Phone size={15} /></Link>
            {manager ? <button type="button" className="org-delete-button" onClick={() => handleDeletePerson(person.id)} aria-label={`Delete ${person.name}`} title={`Remove ${person.name}`}><Trash2 size={15} /></button> : null}
          </div>
        </article>
        {children.length ? <div className="org-chart-children">{children.map(renderOrgBranch)}</div> : null}
      </div>
    )
  }

  return (
    <main className="org-tree-page">
      <div className="org-tree-shell">
        <header className="org-tree-heading">
          <div>
            <p className="org-tree-eyebrow"><UsersRound size={14} /> BNPRS · COMPANY STRUCTURE</p>
            <h1>BNPRS Tree</h1>
            <p className="org-tree-summary">{people.length} employees <span /> {departments.length} departments · Select a department to view its team</p>
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
            <label>Department
              <select name="department" required defaultValue="Management">
                {departments.map((department) => <option key={department.name}>{department.name}</option>)}
              </select>
            </label>
            <label>Reports to
              <select value={managerId} onChange={(event) => setManagerId(event.target.value)}>
                {people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.title}</option>)}
              </select>
            </label>
            <div className="org-form-actions">
              <button className="org-add-button" type="submit"><Plus size={16} /> Add employee</button>
            </div>
          </form>
        ) : null}

        <section className="org-tree-panel" aria-label="BNPRS company hierarchy">
          <div className="org-tree-panel-heading">
            <div><BriefcaseBusiness size={17} /><h2>BNPRS</h2></div>
            <span>Company</span>
          </div>
          <div className="org-hierarchy-root">
            <div className="org-company-node"><span className="org-company-mark">B</span><span><strong>BNPRS</strong><small>Biometric identity & payment technology</small></span></div>
            <div className="org-department-grid">
              {departments.map((department) => {
                const DepartmentIcon = department.icon
                const members = people.filter((person) => person.department === department.name)
                const selected = selectedDepartment === department.name
                return (
                  <button
                    className={`org-department-card ${selected ? 'is-selected' : ''}`}
                    type="button"
                    key={department.name}
                    aria-expanded={selected}
                    aria-pressed={selected}
                    onClick={() => setSelectedDepartment(selected ? null : department.name)}
                  >
                    <span className="org-department-icon"><DepartmentIcon size={18} /></span>
                    <span className="org-department-copy"><strong>{department.name}</strong><small>{department.summary}</small></span>
                    <span className="org-department-count">{members.length} {members.length === 1 ? 'member' : 'members'}</span>
                    {department.products ? <span className="org-product-list">{department.products.map((product) => <span key={product}>{product}</span>)}</span> : null}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {selectedDepartment ? (
          <section className="org-team-section" aria-labelledby="selected-department-title">
            <div className="org-team-heading">
              <div><h2 id="selected-department-title">{selectedDepartment}</h2><p>{visibleEmployees.length ? 'Employees in this department' : 'No employees have been added to this department yet.'}</p></div>
            </div>
            {visibleEmployees.length ? (
              selectedDepartment === 'Management'
                ? <div className="org-reporting-tree">{renderOrgBranch(root)}</div>
                : <div className="org-team-grid">
                    {visibleEmployees.map((person) => {
                      const manager = people.find((candidate) => candidate.id === person.managerId) ?? root
                      const contact = `/chat?contact=${encodeURIComponent(person.id)}&name=${encodeURIComponent(person.name)}`
                      return (
                        <article className="org-team-card" key={person.id}>
                          <span className="org-person-avatar">{getInitials(person.name)}</span>
                          <div className="org-person-details">
                            <strong>{person.name}</strong>
                            <span>{person.title}</span>
                            <small>{person.id === root.id ? 'Company founder' : `Reports to ${manager.name}`}</small>
                          </div>
                          <div className="org-person-actions">
                            <Link to={contact} aria-label={`Message ${person.name}`} title={`Message ${person.name}`}><MessageCircle size={15} /></Link>
                            <Link to={`${contact}&call=audio`} aria-label={`Call ${person.name}`} title={`Call ${person.name}`}><Phone size={15} /></Link>
                            <button type="button" className="org-delete-button" onClick={() => handleDeletePerson(person.id)} aria-label={`Delete ${person.name}`} title={`Remove ${person.name}`}><Trash2 size={15} /></button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  )
}
