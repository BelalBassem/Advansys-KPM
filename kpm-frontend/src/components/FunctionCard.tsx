import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import type { Department } from '../api/APIs/departmentAPI'
import type { BusinessFunction } from '../api/APIs/functionAPI'
import EntityMetadata from './EntityMetadata'
import '../styles/DepartmentCard.css'
import '../styles/FunctionCard.css'

export interface ManagedFunction extends BusinessFunction {
  departmentIds: number[]
}

interface FunctionCardProps {
  businessFunction: ManagedFunction
  departments: Department[]
  isBusy?: boolean
  onDelete: (id: number) => void
  onUpdate: (
    id: number,
    name: string,
    departmentIds: number[],
  ) => boolean | Promise<boolean>
}

function FunctionCard({
  businessFunction,
  departments,
  isBusy = false,
  onDelete,
  onUpdate,
}: FunctionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(businessFunction.name)
  const [editedDepartmentIds, setEditedDepartmentIds] = useState(
    businessFunction.departmentIds,
  )

  const linkedDepartments = departments.filter((department) =>
    businessFunction.departmentIds.includes(department.id),
  )

  function toggleDepartment(departmentId: number) {
    setEditedDepartmentIds((current) =>
      current.includes(departmentId)
        ? current.filter((id) => id !== departmentId)
        : [...current, departmentId],
    )
  }

  function startEditing() {
    setEditedName(businessFunction.name)
    setEditedDepartmentIds(businessFunction.departmentIds)
    setIsEditing(true)
  }

  function cancelEditing() {
    setEditedName(businessFunction.name)
    setEditedDepartmentIds(businessFunction.departmentIds)
    setIsEditing(false)
  }

  async function saveChanges() {
    const wasUpdated = await onUpdate(
      businessFunction.id,
      editedName,
      editedDepartmentIds,
    )

    if (wasUpdated) {
      setEditedName(editedName.trim().replace(/\s+/g, ' '))
      setIsEditing(false)
    }
  }

  return (
    <article className="department-card function-card">
      <div className="department-card-header">
        {isEditing ? (
          <input
            className="department-card-edit-input"
            type="text"
            value={editedName}
            onChange={(event) => setEditedName(event.target.value)}
            disabled={isBusy}
            aria-label="Function name"
          />
        ) : (
          <h3 className="department-card-title">{businessFunction.name}</h3>
        )}

        <div className="department-card-actions">
          {isEditing ? (
            <>
              <button
                className="department-card-icon-button department-card-save-button"
                type="button"
                onClick={saveChanges}
                disabled={isBusy}
                aria-label={`Save ${businessFunction.name}`}
                title="Save function"
              >
                <Check size={17} aria-hidden="true" />
              </button>
              <button
                className="department-card-icon-button"
                type="button"
                onClick={cancelEditing}
                disabled={isBusy}
                aria-label={`Cancel editing ${businessFunction.name}`}
                title="Cancel"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                className="department-card-icon-button"
                type="button"
                onClick={startEditing}
                disabled={isBusy}
                aria-label={`Edit ${businessFunction.name}`}
                title="Edit function"
              >
                <Pencil size={17} aria-hidden="true" />
              </button>
              <button
                className="department-card-icon-button department-card-delete-button"
                type="button"
                onClick={() => onDelete(businessFunction.id)}
                disabled={isBusy}
                aria-label={`Delete ${businessFunction.name}`}
                title="Delete function"
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <fieldset className="function-card-department-editor">
          <legend>Linked Departments</legend>
          {departments.length > 0 ? (
            <div className="function-card-department-options">
              {departments.map((department) => (
                <label className="function-card-department-option" key={department.id}>
                  <input
                    type="checkbox"
                    checked={editedDepartmentIds.includes(department.id)}
                    onChange={() => toggleDepartment(department.id)}
                    disabled={isBusy}
                  />
                  <span>{department.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="function-card-no-departments">No departments available.</p>
          )}
        </fieldset>
      ) : (
        <div className="function-card-departments">
          <p className="function-card-section-label">Linked Departments</p>
          {linkedDepartments.length > 0 ? (
            <div className="function-card-chip-list">
              {linkedDepartments.map((department) => (
                <span className="function-card-chip" key={department.id}>
                  {department.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="function-card-no-departments">No departments linked.</p>
          )}
        </div>
      )}

      <EntityMetadata
        createdDate={businessFunction.createdDate}
        modifiedDate={businessFunction.lastModifiedDate}
      />
    </article>
  )
}

export default FunctionCard
