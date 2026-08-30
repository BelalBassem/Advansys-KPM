import '../styles/LessonCard.css'

function LessonCard() {
  return (
    <article className="lesson-card">
      <div className="lesson-image-box">
        <span className="lesson-tag">Text</span>
        <img className="lesson-image" src="/" alt="" />
      </div>

      <div className="lesson-card-body">
        <label className="lesson-author">Author</label>
        <label className="lesson-description">Description</label>
        <button className="lesson-button">Open Lesson</button>
      </div>
    </article>
  )
}

export default LessonCard
