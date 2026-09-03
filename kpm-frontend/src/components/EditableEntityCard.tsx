import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import EntityMetadata from './EntityMetadata'
import '../styles/DepartmentCard.css'

export interface EditableEntity {
  id: number
  name: string
  createdDate: Date | string
  modifiedDate: Date | string
}

interface EditableEntityCardProps {
  entity: EditableEntity
  entityLabel: string
  isBusy?: boolean
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string) => boolean | Promise<boolean>
}

function EditableEntityCard({
  entity,
  entityLabel,
  isBusy = false,
  onDelete,
  onUpdate,
}: EditableEntityCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(entity.name)

  async function handleSaveEdit() {
    const wasUpdated = await onUpdate(entity.id, editedName)

    if (wasUpdated) {
      setEditedName(editedName.trim().replace(/\s+/g, ' '))
      setIsEditing(false)
    }
  }

  function handleCancelEdit() {
    setEditedName(entity.name)
    setIsEditing(false)
  }

  return (
    <article className="department-card">
      <div className="department-card-header">
        {isEditing ? (
          <input
            className="department-card-edit-input"
            type="text"
            value={editedName}
            onChange={(event) => setEditedName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleSaveEdit()
              }
            }}
            aria-label={`${entityLabel} name`}
          />
        ) : (
          <h3 className="department-card-title">{entity.name}</h3>
        )}

        <div className="department-card-actions">
          {isEditing ? (
            <>
              <button
                className="department-card-icon-button department-card-save-button"
                type="button"
                onClick={handleSaveEdit}
                disabled={isBusy}
                aria-label={`Save ${entity.name}`}
                title={`Save ${entityLabel}`}
              >
                <Check size={17} aria-hidden="true" />
              </button>
              <button
                className="department-card-icon-button"
                type="button"
                onClick={handleCancelEdit}
                disabled={isBusy}
                aria-label={`Cancel editing ${entity.name}`}
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
                onClick={() => {
                  setEditedName(entity.name)
                  setIsEditing(true)
                }}
                disabled={isBusy}
                aria-label={`Edit ${entity.name}`}
                title={`Edit ${entityLabel}`}
              >
                <Pencil size={17} aria-hidden="true" />
              </button>
              <button
                className="department-card-icon-button department-card-delete-button"
                type="button"
                onClick={() => onDelete(entity.id)}
                disabled={isBusy}
                aria-label={`Delete ${entity.name}`}
                title={`Delete ${entityLabel}`}
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      <EntityMetadata
        createdDate={entity.createdDate}
        modifiedDate={entity.modifiedDate}
      />
    </article>
  )
}

export default EditableEntityCard
