import type { Industry } from '../api/APIs/industryAPI'
import EditableEntityCard from './EditableEntityCard'

interface IndustryCardProps {
  industry: Industry
  isBusy?: boolean
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string) => boolean | Promise<boolean>
}

function IndustryCard({
  industry,
  isBusy = false,
  onDelete,
  onUpdate,
}: IndustryCardProps) {
  return (
    <EditableEntityCard
      entity={industry}
      entityLabel="industry"
      isBusy={isBusy}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  )
}

export default IndustryCard
