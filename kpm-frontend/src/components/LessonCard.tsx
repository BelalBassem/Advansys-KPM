import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../api/APIs/lessonAPI'
import '../styles/LessonCard.css'

interface LessonCardProps {
  lesson: Lesson
  departmentName: string
}

function formatKeyword(keyword: string) {
  return keyword.startsWith('#') ? keyword : `#${keyword}`
}

function LessonCard({ lesson, departmentName }: LessonCardProps) {
  const contactName = lesson.personToContact?.name ?? 'Contact unavailable'
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const imageUrl = lesson.imageUrl?.trim()
  const showImage = Boolean(imageUrl) && !imageLoadFailed

  return (
    <article className="lesson-card">
      <div
        className={
          showImage ? 'lesson-image-box lesson-image-box--with-image' : 'lesson-image-box'
        }
      >
        {showImage && (
          <img
            className="lesson-image"
            src={imageUrl}
            alt=""
            onError={() => setImageLoadFailed(true)}
          />
        )}
        <span className="lesson-tag">{departmentName}</span>
      </div>

      <div className="lesson-card-body">
        <h2 className="lesson-description">{lesson.title}</h2>
        <p className="lesson-project-name">Project: {lesson.projectName}</p>
        <p className="lesson-author">Person to contact: {contactName}</p>

        {lesson.keywords.length > 0 && (
          <div className="lesson-keywords" aria-label="Keywords">
            {lesson.keywords.map((keyword, index) => (
              <span className="lesson-keyword" key={`${keyword}-${index}`}>
                {formatKeyword(keyword)}
              </span>
            ))}
          </div>
        )}

        <Link
          className="lesson-button"
          to={`/lesson-details?lessonId=${encodeURIComponent(lesson.id)}`}
          aria-label={`Open lesson ${lesson.title}`}
        >
          Open Lesson
        </Link>
      </div>
    </article>
  )
}

export default LessonCard
