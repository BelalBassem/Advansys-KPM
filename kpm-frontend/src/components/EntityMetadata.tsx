interface EntityMetadataProps {
  createdDate: Date | string
  modifiedDate: Date | string
}

function formatDate(value: Date | string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getTimeSince(value: Date | string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const unit of units) {
    const count = Math.floor(seconds / unit.seconds)

    if (count > 0) {
      return `${count} ${unit.label}${count === 1 ? '' : 's'} ago`
    }
  }

  return 'Just now'
}

function EntityMetadata({ createdDate, modifiedDate }: EntityMetadataProps) {
  return (
    <dl className="department-card-meta">
      <div>
        <dt>Created</dt>
        <dd>{formatDate(createdDate)}</dd>
      </div>
      <div>
        <dt>Modified</dt>
        <dd>{formatDate(modifiedDate)}</dd>
      </div>
      <div>
        <dt>Last Change</dt>
        <dd>{getTimeSince(modifiedDate)}</dd>
      </div>
    </dl>
  )
}

export default EntityMetadata
