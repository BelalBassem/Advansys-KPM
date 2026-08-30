import {
  ChevronLeft,
  Download,
  FileText,
  Link as LinkIcon,
  Plus,
  Share2,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/Lesson.css'

function Lesson() {
  return (
    <div className="lesson-details-page">
      <Navbar />

      <main className="lesson-details-main">
        <div className="lesson-details-layout">
          <div className="lesson-details-left-column">
            <article className="lesson-details-card">
              <header className="lesson-details-header">
                <span className="lesson-details-tag">Design</span>
                <h1 className="lesson-details-title">
                  Improving Operator UX in Challenging Environments
                </h1>
                <p className="lesson-details-project">Project: Automation Solutions Phase 2</p>
              </header>

              <div className="lesson-details-body">
                <section className="lesson-details-author-row">
                  <div className="lesson-details-author">
                    <span className="lesson-details-author-avatar">HS</span>
                    <div className="lesson-details-author-information">
                      <span className="lesson-details-author-label">Author</span>
                      <span className="lesson-details-author-name">Hossam Shaaban</span>
                    </div>
                  </div>

                  <div className="lesson-details-rating-share">
                    <div className="lesson-details-rating" aria-label="Rated 4.6 out of 5">
                      <span className="lesson-details-stars" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star className="lesson-details-star" key={star} />
                        ))}
                      </span>
                      <span className="lesson-details-rating-text">4.6 (13 reviews)</span>
                    </div>
                    <button className="lesson-details-share-button" type="button">
                      <Share2 className="lesson-details-share-icon" />
                      Share
                    </button>
                  </div>
                </section>

                <section className="lesson-details-section">
                  <h2 className="lesson-details-section-title">Lesson Summary</h2>
                  <p className="lesson-details-summary">
                    A detailed guide on refining PLC logic to reduce cycle times in high-speed
                    packaging lines by 15%.
                  </p>
                </section>

                <section className="lesson-details-section" id="lesson-description">
                  <h2 className="lesson-details-section-title">Description</h2>
                  <div className="lesson-details-description">
                    <p>
                      This lesson documents the specific logic adjustments made to the high-speed
                      sorting system. It covers the transition from traditional sequential processing
                      to event-driven execution, significantly reducing idle time between cycles.
                    </p>
                    <p>
                      Key technical steps include optimization of task priorities and implementing
                      high-speed interrupt routines for sensor feedback. By adjusting the task cycle
                      time from 15ms to a variable execution model based on sensor triggers, the
                      overall throughput was increased without compromising system stability.
                    </p>
                  </div>
                </section>
              </div>
            </article>

            <Link className="lesson-details-back-button" to="/">
              <ChevronLeft className="lesson-details-back-icon" />
              Back to Lessons
            </Link>
          </div>

          <aside className="lesson-details-sidebar">
            <section className="lesson-details-sidebar-panel">
              <h2 className="lesson-details-sidebar-title">Attachments</h2>
              <div className="lesson-details-attachment">
                <FileText className="lesson-details-attachment-icon" />
                <div className="lesson-details-attachment-information">
                  <span className="lesson-details-attachment-name">PLC Logic_Rev4.pdf</span>
                  <span className="lesson-details-attachment-size">2.4 MB · PDF</span>
                </div>
                <button
                  className="lesson-details-download-button"
                  type="button"
                  aria-label="Download PLC Logic Revision 4 PDF"
                  title="Download attachment"
                >
                  <Download className="lesson-details-download-icon" />
                </button>
              </div>
            </section>

            <section className="lesson-details-sidebar-panel">
              <h2 className="lesson-details-sidebar-title">Quick Links</h2>
              <a className="lesson-details-quick-link" href="#lesson-description">
                <LinkIcon className="lesson-details-quick-link-icon" />
                Internal Wiki - Automation
              </a>
            </section>

            <section className="lesson-details-sidebar-panel">
              <h2 className="lesson-details-sidebar-title">Keywords</h2>
              <div className="lesson-details-keywords">
                <span className="lesson-details-keyword">#automation</span>
                <span className="lesson-details-keyword">#PLC</span>
                <span className="lesson-details-keyword">#Packaging</span>
              </div>
            </section>

            <section className="lesson-details-create-panel">
              <h2 className="lesson-details-create-title">Have a similar lesson?</h2>
              <p className="lesson-details-create-description">
                Sharing your experience helps our engineering community grow stronger.
              </p>
              <Link className="lesson-details-create-button" to="/create-lesson">
                <Plus className="lesson-details-create-icon" />
                Create Lesson
              </Link>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Lesson
