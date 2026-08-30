import '../styles/LessonCard.css'
import { Link } from 'react-router-dom'

function LessonCard({ tag , author, description }: { tag:string ; author: string; description: string }) {
  return (
    <article className="lesson-card">
      <div className="lesson-image-box">
        <span className="lesson-tag">{tag}</span>
        <img className="lesson-image" src="/" alt="" />
      </div>

      <div className="lesson-card-body">
        <label className="lesson-author">{author}</label>
        <label className="lesson-description">{description}</label>
        <Link className="lesson-button" to="/lesson-details">
          Open Lesson
        </Link>
      </div>
    </article>
  )
}

export default LessonCard
