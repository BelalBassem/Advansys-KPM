import type { Department } from '../api/APIs/departmentAPI'
import EditableEntityCard from './EditableEntityCard'

interface DepartmentCardProps {
  department: Department
  isBusy?: boolean
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string) => boolean | Promise<boolean>
}

function DepartmentCard({
  department,
  isBusy = false,
  onDelete,
  onUpdate,
}: DepartmentCardProps) {
  return (
    <EditableEntityCard
      entity={department}
      entityLabel="department"
      isBusy={isBusy}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  )
}

export default DepartmentCard
