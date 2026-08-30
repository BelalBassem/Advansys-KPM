import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AIButton from '../components/AIButton'
import '../styles/CreateLesson.css'

function CreateLesson() {
  return (
    <div className="create-lesson-page">
      <Navbar />

      <main className="create-lesson-main">
        <section className="create-lesson-header">
          <p className="create-lesson-header-title">Create Lesson</p>
          <p className="create-lesson-header-description">
            Fill in the details below to create a new knowledge base lesson.
          </p>
        </section>

        <div className="create-lesson-layout">
          <div className="create-lesson-left-column">
            <section className="create-lesson-basic-information">
              <p className="create-lesson-basic-information-header">Basic Information</p>

              <label className="create-lesson-basic-information-title" htmlFor="lesson-title">
                Lesson Title
              </label>
              <input
                className="create-lesson-basic-information-title-box"
                id="lesson-title"
                type="text"
                placeholder="Enter lesson title"
              />

              <label className="create-lesson-basic-information-project" htmlFor="project-name">
                Project Name
              </label>
              <input
                className="create-lesson-basic-information-project-box"
                id="project-name"
                type="text"
                placeholder="Enter project name"
              />

              <label className="create-lesson-basic-information-industry" htmlFor="industry">
                Industry
              </label>
              <input
                className="create-lesson-basic-information-industry-box"
                id="industry"
                type="text"
                placeholder="Select industry"
              />
            </section>

            <section className="create-lesson-content">
              <p className="create-lesson-content-title">Lesson Content</p>
              <label className="create-lesson-content-label" htmlFor="lesson-description">
                Description
              </label>
              <textarea
                className="create-lesson-content-description"
                id="lesson-description"
                placeholder="Write the full description of the lesson"
                rows={6}
              />
            </section>

            <section className="create-lesson-attachments">
              <p className="create-lesson-attachments-title">Attachments</p>

              <div className="create-lesson-attachments-list">
                <label className="create-lesson-attachments-box">
                  <span className="create-lesson-attachments-box-title">Upload an image</span>
                  <span className="create-lesson-attachments-box-description">
                    SVG, PNG, JPG or GIF (max 5MB)
                  </span>
                  <input
                    className="create-lesson-attachments-input"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml"
                  />
                </label>

                <label className="create-lesson-attachments-box">
                  <span className="create-lesson-attachments-box-title">Upload a document</span>
                  <span className="create-lesson-attachments-box-description">
                    PDF, DOCX or PPTX (max 5MB)
                  </span>
                  <input
                    className="create-lesson-attachments-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                </label>
              </div>

              <p className="create-lesson-attachments-status">No files attached yet</p>
            </section>

            <section className="create-lesson-buttons">
              <button className="create-lesson-buttons-discard" type="button">
                Discard
              </button>
              <div className="create-lesson-buttons-save">
                <button className="create-lesson-buttons-draft" type="button">
                  Save as Draft
                </button>
                <button className="create-lesson-submit-lesson" type="button">
                  Submit Lesson
                </button>
              </div>
            </section>
          </div>

          <aside className="create-lesson-review">
            <p className="create-lesson-review-title">Review Summary</p>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Basic Information</p>
              <div className="create-lesson-review-row">
                <span>Lesson Title</span>
                <span>Not provided</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Project Name</span>
                <span>Not provided</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Industry</span>
                <span>Not provided</span>
              </div>
            </div>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Lesson Content</p>
              <div className="create-lesson-review-row">
                <span>Description</span>
                <span>Not provided</span>
              </div>
            </div>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Attachments</p>
              <div className="create-lesson-review-row">
                <span>Files</span>
                <span>0 items</span>
              </div>
            </div>

            <p className="create-lesson-review-note">
              You can save a draft or submit the lesson when ready.
            </p>
          </aside>
        </div>
      </main>

      <AIButton />
      <Footer />
    </div>
  )
}

export default CreateLesson
