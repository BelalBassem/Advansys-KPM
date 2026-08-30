import '../styles/LessonsPage.css'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LessonCard from '../components/LessonCard'
import SearchBar from '../components/Search'
import AIButton from '../components/AIButton'

function LessonsPage() {
  return (
    <div className="lessons-page">
      <Navbar />

      <main className="lessons-main">
        <section className="lessons-header">
          <div className="lessons-title-box">
            <p className="lessons-title">Lesson Learned</p>
            <p className="lessons-description">
              A dedicated space for automation engineers to reflect, share, and
              grow - documenting key learnings, challenges, and solutions
              discovered during project lifecycles.
            </p>
          </div>

          <Link className="create-button" to="/create-lesson">
            <Plus className="create-button-icon" />
            Create Lesson
          </Link>
        </section>

        <section className="lessons-content">
          <SearchBar />
          <button className="group-button">Group by Department</button>

          <div className="lesson-list">
            <LessonCard />
          </div>

        </section>
      </main>

      <AIButton />
      <Footer />
    </div>
  )
}

export default LessonsPage
