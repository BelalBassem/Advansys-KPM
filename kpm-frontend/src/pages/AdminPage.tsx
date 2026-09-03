import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../api/APIs/departmentAPI'
import type { Department } from '../api/APIs/departmentAPI'
import {
  addFunctionToDepartment,
  createFunction,
  deleteFunction,
  getFunctionDepartments,
  getFunctions,
  removeFunctionFromDepartment,
  updateFunction,
} from '../api/APIs/functionAPI'
import {
  createIndustry,
  deleteIndustry,
  getIndustries,
  updateIndustry,
} from '../api/APIs/industryAPI'
import type { Industry } from '../api/APIs/industryAPI'
import AIButton from '../components/AIButton'
import DepartmentCard from '../components/DepartmentCard'
import FunctionCard from '../components/FunctionCard'
import type { ManagedFunction } from '../components/FunctionCard'
import Footer from '../components/Footer'
import IndustryCard from '../components/IndustryCard'
import Navbar from '../components/Navbar'
import '../styles/AdminPage.css'

interface Feedback {
  type: '' | 'error' | 'success'
  message: string
}

const emptyFeedback: Feedback = { type: '', message: '' }

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

async function getManagedFunctions() {
  const functions = await getFunctions()

  return Promise.all(
    functions.map(async (businessFunction): Promise<ManagedFunction> => {
      const linkedDepartments = await getFunctionDepartments(businessFunction.id)

      return {
        ...businessFunction,
        departmentIds: linkedDepartments.map((department) => department.id),
      }
    }),
  )
}

function AdminPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentName, setDepartmentName] = useState('')
  const [departmentFeedback, setDepartmentFeedback] =
    useState<Feedback>(emptyFeedback)
  const [busyDepartmentId, setBusyDepartmentId] = useState<number | null>(null)

  const [industries, setIndustries] = useState<Industry[]>([])
  const [industryName, setIndustryName] = useState('')
  const [industryFeedback, setIndustryFeedback] = useState<Feedback>(emptyFeedback)
  const [busyIndustryId, setBusyIndustryId] = useState<number | null>(null)

  const [businessFunctions, setBusinessFunctions] = useState<ManagedFunction[]>([])
  const [functionName, setFunctionName] = useState('')
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([])
  const [functionFeedback, setFunctionFeedback] = useState<Feedback>(emptyFeedback)
  const [busyFunctionId, setBusyFunctionId] = useState<number | null>(null)
  const [isCreatingFunction, setIsCreatingFunction] = useState(false)

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments()
        setDepartments(data)
      } catch {
        setDepartmentFeedback({ type: 'error', message: 'Could not load departments.' })
      }
    }

    async function loadIndustries() {
      try {
        const data = await getIndustries()
        setIndustries(data)
      } catch {
        setIndustryFeedback({ type: 'error', message: 'Could not load industries.' })
      }
    }

    async function loadFunctions() {
      try {
        setBusinessFunctions(await getManagedFunctions())
      } catch {
        setFunctionFeedback({ type: 'error', message: 'Could not load functions.' })
      }
    }

    loadIndustries()
    loadDepartments()
    loadFunctions()
  }, [])

  async function handleAddDepartment() {
    const normalizedDepartmentName = normalizeName(departmentName)

    if (!normalizedDepartmentName) {
      setDepartmentFeedback({ type: 'error', message: 'Enter a department name.' })
      return
    }

    if (
      departments.some(
        (department) =>
          department.name.toLowerCase() === normalizedDepartmentName.toLowerCase(),
      )
    ) {
      setDepartmentFeedback({
        type: 'error',
        message: 'Department name already exists.',
      })
      return
    }

    try {
      await createDepartment(normalizedDepartmentName)
      const updatedDepartments = await getDepartments()
      setDepartments(updatedDepartments)
      setDepartmentName('')
      setDepartmentFeedback({ type: 'success', message: 'Department added.' })
    } catch {
      setDepartmentFeedback({
        type: 'error',
        message: 'Could not add department. Please try again.',
      })
    }
  }

  async function refreshDepartments() {
    const updatedDepartments = await getDepartments()
    setDepartments(updatedDepartments)
  }

  async function handleUpdateDepartment(id: number, name: string) {
    const normalizedDepartmentName = normalizeName(name)

    if (!normalizedDepartmentName) {
      setDepartmentFeedback({ type: 'error', message: 'Enter a department name.' })
      return false
    }

    if (
      departments.some(
        (department) =>
          department.id !== id &&
          department.name.toLowerCase() === normalizedDepartmentName.toLowerCase(),
      )
    ) {
      setDepartmentFeedback({
        type: 'error',
        message: 'Department name already exists.',
      })
      return false
    }

    try {
      setBusyDepartmentId(id)
      await updateDepartment(id, normalizedDepartmentName)
      await refreshDepartments()
      setDepartmentFeedback({ type: 'success', message: 'Department updated.' })
      return true
    } catch {
      setDepartmentFeedback({
        type: 'error',
        message: 'Could not update department. Please try again.',
      })
      return false
    } finally {
      setBusyDepartmentId(null)
    }
  }

  async function handleDeleteDepartment(id: number) {
    try {
      setBusyDepartmentId(id)
      await deleteDepartment(id)
      await refreshDepartments()
      setSelectedDepartmentIds((current) =>
        current.filter((departmentId) => departmentId !== id),
      )
      try {
        await refreshFunctions()
      } catch {
        setFunctionFeedback({ type: 'error', message: 'Could not refresh functions.' })
      }
      setDepartmentFeedback({ type: 'success', message: 'Department deleted.' })
    } catch {
      setDepartmentFeedback({
        type: 'error',
        message: 'Could not delete department. Please try again.',
      })
    } finally {
      setBusyDepartmentId(null)
    }
  }

  async function refreshIndustries() {
    const updatedIndustries = await getIndustries()
    setIndustries(updatedIndustries)
  }

  async function handleAddIndustry() {
    const normalizedIndustryName = normalizeName(industryName)

    if (!normalizedIndustryName) {
      setIndustryFeedback({ type: 'error', message: 'Enter an industry name.' })
      return
    }

    if (
      industries.some(
        (industry) => industry.name.toLowerCase() === normalizedIndustryName.toLowerCase(),
      )
    ) {
      setIndustryFeedback({ type: 'error', message: 'Industry name already exists.' })
      return
    }

    try {
      await createIndustry(normalizedIndustryName)
      await refreshIndustries()
      setIndustryName('')
      setIndustryFeedback({ type: 'success', message: 'Industry added.' })
    } catch {
      setIndustryFeedback({
        type: 'error',
        message: 'Could not add industry. Please try again.',
      })
    }
  }

  async function handleUpdateIndustry(id: number, name: string) {
    const normalizedIndustryName = normalizeName(name)

    if (!normalizedIndustryName) {
      setIndustryFeedback({ type: 'error', message: 'Enter an industry name.' })
      return false
    }

    if (
      industries.some(
        (industry) =>
          industry.id !== id &&
          industry.name.toLowerCase() === normalizedIndustryName.toLowerCase(),
      )
    ) {
      setIndustryFeedback({ type: 'error', message: 'Industry name already exists.' })
      return false
    }

    try {
      setBusyIndustryId(id)
      await updateIndustry(id, normalizedIndustryName)
      await refreshIndustries()
      setIndustryFeedback({ type: 'success', message: 'Industry updated.' })
      return true
    } catch {
      setIndustryFeedback({
        type: 'error',
        message: 'Could not update industry. Please try again.',
      })
      return false
    } finally {
      setBusyIndustryId(null)
    }
  }

  async function handleDeleteIndustry(id: number) {
    try {
      setBusyIndustryId(id)
      await deleteIndustry(id)
      await refreshIndustries()
      setIndustryFeedback({ type: 'success', message: 'Industry deleted.' })
    } catch {
      setIndustryFeedback({
        type: 'error',
        message: 'Could not delete industry. Please try again.',
      })
    } finally {
      setBusyIndustryId(null)
    }
  }

  async function refreshFunctions() {
    setBusinessFunctions(await getManagedFunctions())
  }

  function toggleSelectedDepartment(departmentId: number) {
    setSelectedDepartmentIds((current) =>
      current.includes(departmentId)
        ? current.filter((id) => id !== departmentId)
        : [...current, departmentId],
    )
    setFunctionFeedback(emptyFeedback)
  }

  async function handleAddFunction() {
    const normalizedFunctionName = normalizeName(functionName)

    if (!normalizedFunctionName) {
      setFunctionFeedback({ type: 'error', message: 'Enter a function name.' })
      return
    }

    if (
      businessFunctions.some(
        (businessFunction) =>
          businessFunction.name.toLowerCase() === normalizedFunctionName.toLowerCase(),
      )
    ) {
      setFunctionFeedback({ type: 'error', message: 'Function name already exists.' })
      return
    }

    if (selectedDepartmentIds.length === 0) {
      setFunctionFeedback({
        type: 'error',
        message: 'Select at least one department.',
      })
      return
    }

    const [initialDepartmentId, ...additionalDepartmentIds] = selectedDepartmentIds

    try {
      setIsCreatingFunction(true)
      const functionId = await createFunction(
        normalizedFunctionName,
        initialDepartmentId,
      )

      await Promise.all(
        additionalDepartmentIds.map((departmentId) =>
          addFunctionToDepartment(functionId, departmentId),
        ),
      )

      await refreshFunctions()
      setFunctionName('')
      setSelectedDepartmentIds([])
      setFunctionFeedback({ type: 'success', message: 'Function added.' })
    } catch {
      await refreshFunctions().catch(() => undefined)
      setFunctionFeedback({
        type: 'error',
        message: 'Could not add the function or all department links.',
      })
    } finally {
      setIsCreatingFunction(false)
    }
  }

  async function handleUpdateFunction(
    id: number,
    name: string,
    departmentIds: number[],
  ) {
    const normalizedFunctionName = normalizeName(name)
    const validDepartmentIds = [...new Set(departmentIds)].filter((departmentId) =>
      departments.some((department) => department.id === departmentId),
    )

    if (!normalizedFunctionName) {
      setFunctionFeedback({ type: 'error', message: 'Enter a function name.' })
      return false
    }

    if (
      businessFunctions.some(
        (businessFunction) =>
          businessFunction.id !== id &&
          businessFunction.name.toLowerCase() === normalizedFunctionName.toLowerCase(),
      )
    ) {
      setFunctionFeedback({ type: 'error', message: 'Function name already exists.' })
      return false
    }

    if (validDepartmentIds.length === 0) {
      setFunctionFeedback({
        type: 'error',
        message: 'Select at least one department.',
      })
      return false
    }

    const currentFunction = businessFunctions.find(
      (businessFunction) => businessFunction.id === id,
    )

    if (!currentFunction) {
      setFunctionFeedback({ type: 'error', message: 'Function could not be found.' })
      return false
    }

    const departmentsToAdd = validDepartmentIds.filter(
      (departmentId) => !currentFunction.departmentIds.includes(departmentId),
    )
    const departmentsToRemove = currentFunction.departmentIds.filter(
      (departmentId) => !validDepartmentIds.includes(departmentId),
    )

    try {
      setBusyFunctionId(id)
      await updateFunction(id, normalizedFunctionName)
      await Promise.all([
        ...departmentsToAdd.map((departmentId) =>
          addFunctionToDepartment(id, departmentId),
        ),
        ...departmentsToRemove.map((departmentId) =>
          removeFunctionFromDepartment(id, departmentId),
        ),
      ])
      await refreshFunctions()
      setFunctionFeedback({ type: 'success', message: 'Function updated.' })
      return true
    } catch {
      await refreshFunctions().catch(() => undefined)
      setFunctionFeedback({
        type: 'error',
        message: 'Could not update the function or all department links.',
      })
      return false
    } finally {
      setBusyFunctionId(null)
    }
  }

  async function handleDeleteFunction(id: number) {
    try {
      setBusyFunctionId(id)
      await deleteFunction(id)
      await refreshFunctions()
      setFunctionFeedback({ type: 'success', message: 'Function deleted.' })
    } catch {
      setFunctionFeedback({
        type: 'error',
        message: 'Could not delete the function.',
      })
    } finally {
      setBusyFunctionId(null)
    }
  }

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-main">
        <section className="admin-header">
          <p className="admin-title">Admin</p>
          <p className="admin-description">
            Manage the departments, industries, and functions used to classify lessons.
          </p>
        </section>

        <div className="admin-layout">
          <section className="admin-panel">
            <p className="admin-panel-title">Departments</p>

            <div className="admin-field">
              <label className="admin-label" htmlFor="department-name">
                Department Name
              </label>
              <div className="admin-inline-add">
                <input
                  className="admin-control"
                  id="department-name"
                  type="text"
                  value={departmentName}
                  onChange={(event) => {
                    setDepartmentName(event.target.value)
                    setDepartmentFeedback(emptyFeedback)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddDepartment()
                    }
                  }}
                  placeholder="Add a department"
                  aria-describedby={
                    departmentFeedback.message ? 'department-feedback' : undefined
                  }
                />
                <button
                  className="admin-add-button"
                  type="button"
                  onClick={handleAddDepartment}
                  aria-label="Add department"
                  title="Add department"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>

              {departmentFeedback.message && (
                <p
                  className={
                    departmentFeedback.type === 'error'
                      ? 'admin-field-error'
                      : 'admin-field-success'
                  }
                  id="department-feedback"
                >
                  {departmentFeedback.message}
                </p>
              )}
            </div>

            <div className="admin-entity-list" aria-label="Departments">
              {departments.length > 0 ? (
                departments.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    isBusy={busyDepartmentId === department.id}
                    onDelete={handleDeleteDepartment}
                    onUpdate={handleUpdateDepartment}
                  />
                ))
              ) : (
                <p className="admin-empty">No departments found.</p>
              )}
            </div>
          </section>

          <section className="admin-panel">
            <p className="admin-panel-title">Industries</p>

            <div className="admin-field">
              <label className="admin-label" htmlFor="industry-name">
                Industry Name
              </label>
              <div className="admin-inline-add">
                <input
                  className="admin-control"
                  id="industry-name"
                  type="text"
                  value={industryName}
                  onChange={(event) => {
                    setIndustryName(event.target.value)
                    setIndustryFeedback(emptyFeedback)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddIndustry()
                    }
                  }}
                  placeholder="Add an industry"
                  aria-describedby={industryFeedback.message ? 'industry-feedback' : undefined}
                />
                <button
                  className="admin-add-button"
                  type="button"
                  onClick={handleAddIndustry}
                  aria-label="Add industry"
                  title="Add industry"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>

              {industryFeedback.message && (
                <p
                  className={
                    industryFeedback.type === 'error'
                      ? 'admin-field-error'
                      : 'admin-field-success'
                  }
                  id="industry-feedback"
                >
                  {industryFeedback.message}
                </p>
              )}
            </div>

            <div className="admin-entity-list" aria-label="Industries">
              {industries.length > 0 ? (
                industries.map((industry) => (
                  <IndustryCard
                    key={industry.id}
                    industry={industry}
                    isBusy={busyIndustryId === industry.id}
                    onDelete={handleDeleteIndustry}
                    onUpdate={handleUpdateIndustry}
                  />
                ))
              ) : (
                <p className="admin-empty">No industries added yet.</p>
              )}
            </div>
          </section>

          <section className="admin-panel">
            <p className="admin-panel-title">Functions</p>

            <form
              className="admin-function-form"
              onSubmit={(event) => {
                event.preventDefault()
                handleAddFunction()
              }}
            >
              <div className="admin-field">
                <label className="admin-label" htmlFor="function-name">
                  Function Name
                </label>
                <input
                  className="admin-control"
                  id="function-name"
                  type="text"
                  value={functionName}
                  onChange={(event) => {
                    setFunctionName(event.target.value)
                    setFunctionFeedback(emptyFeedback)
                  }}
                  placeholder="Add a function"
                  aria-describedby={functionFeedback.message ? 'function-feedback' : undefined}
                />
              </div>

              <fieldset className="admin-department-picker">
                <legend>Linked Departments</legend>
                {departments.length > 0 ? (
                  <div className="admin-department-options">
                    {departments.map((department) => (
                      <label className="admin-department-option" key={department.id}>
                        <input
                          type="checkbox"
                          checked={selectedDepartmentIds.includes(department.id)}
                          onChange={() => toggleSelectedDepartment(department.id)}
                        />
                        <span>{department.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="admin-picker-empty">No departments available.</p>
                )}
              </fieldset>

              <button
                className="admin-function-add-button"
                type="submit"
                disabled={isCreatingFunction}
              >
                <Plus size={18} aria-hidden="true" />
                <span>{isCreatingFunction ? 'Adding...' : 'Add Function'}</span>
              </button>
            </form>

            {functionFeedback.message && (
              <p
                className={
                  functionFeedback.type === 'error'
                    ? 'admin-field-error'
                    : 'admin-field-success'
                }
                id="function-feedback"
              >
                {functionFeedback.message}
              </p>
            )}

            <div className="admin-entity-list" aria-label="Functions">
              {businessFunctions.length > 0 ? (
                businessFunctions.map((businessFunction) => (
                  <FunctionCard
                    key={businessFunction.id}
                    businessFunction={businessFunction}
                    departments={departments}
                    isBusy={busyFunctionId === businessFunction.id}
                    onDelete={handleDeleteFunction}
                    onUpdate={handleUpdateFunction}
                  />
                ))
              ) : (
                <p className="admin-empty">No functions added yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <AIButton />
      <Footer />
    </div>
  )
}

export default AdminPage
