import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  Download,
  FileText,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Share2,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getDepartments } from '../api/APIs/departmentAPI'
import { getLessonByID } from '../api/APIs/lessonAPI'
import type { Lesson as LessonData } from '../api/APIs/lessonAPI'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../styles/Lesson.css'

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || '?'
}

function getDocumentType(contentType: string) {
  const type = contentType.split('/').pop()
  return type ? type.toUpperCase() : 'DOCUMENT'
}

function formatKeyword(keyword: string) {
  return keyword.startsWith('#') ? keyword : `#${keyword}`
}

function Lesson() {
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [departmentName, setDepartmentName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadRequest, setReloadRequest] = useState(0)
  const [shareMessage, setShareMessage] = useState('')
  const [imageLoadFailed, setImageLoadFailed] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadLesson() {
      if (!lessonId) {
        setLesson(null)
        setLoadError('No lesson was selected.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setLoadError('')
      setImageLoadFailed(false)

      try {
        const [lessonData, departments] = await Promise.all([
          getLessonByID(lessonId),
          getDepartments(),
        ])

        if (!isActive) return

        setLesson(lessonData)
        setDepartmentName(
          departments.find((department) => department.id === lessonData.departmentId)?.name ??
            'Department unavailable',
        )
      } catch {
        if (isActive) {
          setLesson(null)
          setLoadError('Could not load this lesson. Please try again.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadLesson()

    return () => {
      isActive = false
    }
  }, [lessonId, reloadRequest])

  async function handleShare() {
    if (!lesson) return

    setShareMessage('')
    const currentUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: lesson.title, url: currentUrl })
        setShareMessage('Shared.')
        return
      }

      await navigator.clipboard.writeText(currentUrl)
      setShareMessage('Link copied.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareMessage('Could not share the link.')
    }
  }

  const contactName = lesson?.personToContact?.name ?? 'Contact unavailable'

  return (
    <div className="lesson-details-page">
      <Navbar />

      <main className="lesson-details-main">
        {isLoading ? (
          <div className="lesson-details-status">Loading lesson...</div>
        ) : loadError ? (
          <div className="lesson-details-status lesson-details-load-error" role="alert">
            <p>{loadError}</p>
            {lessonId && (
              <button
                className="lesson-details-retry-button"
                type="button"
                onClick={() => setReloadRequest((request) => request + 1)}
              >
                <RefreshCw size={17} aria-hidden="true" />
                <span>Retry</span>
              </button>
            )}
            <Link className="lesson-details-status-back" to="/">
              Back to Lessons
            </Link>
          </div>
        ) : lesson ? (
          <div className="lesson-details-layout">
            <div className="lesson-details-left-column">
              <article className="lesson-details-card">
                {lesson.imageUrl?.trim() && !imageLoadFailed && (
                  <div className="lesson-details-image-box">
                    <img
                      className="lesson-details-image"
                      src={lesson.imageUrl}
                      alt={`${lesson.title} lesson`}
                      onError={() => setImageLoadFailed(true)}
                    />
                  </div>
                )}
                <header className="lesson-details-header">
                  <span className="lesson-details-tag">{departmentName}</span>
                  <h1 className="lesson-details-title">{lesson.title}</h1>
                  <p className="lesson-details-project">Project: {lesson.projectName}</p>
                </header>

                <div className="lesson-details-body">
                  <section className="lesson-details-author-row">
                    <div className="lesson-details-author">
                      <span className="lesson-details-author-avatar">
                        {getInitials(contactName)}
                      </span>
                      <div className="lesson-details-author-information">
                        <span className="lesson-details-author-label">Person to contact</span>
                        <span className="lesson-details-author-name">{contactName}</span>
                      </div>
                    </div>

                    <div className="lesson-details-actions">
                      <button
                        className="lesson-details-share-button"
                        type="button"
                        onClick={handleShare}
                      >
                        <Share2 className="lesson-details-share-icon" aria-hidden="true" />
                        Share
                      </button>
                      {shareMessage && (
                        <span className="lesson-details-share-status" role="status">
                          {shareMessage}
                        </span>
                      )}
                    </div>
                  </section>

                  <section className="lesson-details-section">
                    <h2 className="lesson-details-section-title">Lesson Summary</h2>
                    <p className="lesson-details-summary">{lesson.summary}</p>
                  </section>

                  <section className="lesson-details-section" id="lesson-description">
                    <h2 className="lesson-details-section-title">Description</h2>
                    <div className="lesson-details-description">
                      <p>{lesson.description}</p>
                    </div>
                  </section>
                </div>
              </article>

              <Link className="lesson-details-back-button" to="/">
                <ChevronLeft className="lesson-details-back-icon" aria-hidden="true" />
                Back to Lessons
              </Link>
            </div>

            <aside className="lesson-details-sidebar">
              <section className="lesson-details-sidebar-panel">
                <h2 className="lesson-details-sidebar-title">Attachments</h2>
                {lesson.documents.length > 0 ? (
                  <div className="lesson-details-attachment-list">
                    {lesson.documents.map((document, index) => (
                      <div
                        className="lesson-details-attachment"
                        key={document.id ?? `${document.fileUrl}-${index}`}
                      >
                        <FileText className="lesson-details-attachment-icon" aria-hidden="true" />
                        <div className="lesson-details-attachment-information">
                          <span className="lesson-details-attachment-name">
                            {document.fileName}
                          </span>
                          <span className="lesson-details-attachment-size">
                            {getDocumentType(document.contentType)}
                          </span>
                        </div>
                        <a
                          className="lesson-details-download-button"
                          href={document.fileUrl}
                          download={document.fileName}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Download ${document.fileName}`}
                          title="Download attachment"
                        >
                          <Download className="lesson-details-download-icon" aria-hidden="true" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="lesson-details-empty">No attachments.</p>
                )}
              </section>

              <section className="lesson-details-sidebar-panel">
                <h2 className="lesson-details-sidebar-title">Quick Links</h2>
                {lesson.links.length > 0 ? (
                  <div className="lesson-details-link-list">
                    {lesson.links.map((url, index) => (
                      <a
                        className="lesson-details-quick-link"
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        key={`${url}-${index}`}
                      >
                        <LinkIcon
                          className="lesson-details-quick-link-icon"
                          aria-hidden="true"
                        />
                        <span>{url}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="lesson-details-empty">No links.</p>
                )}
              </section>

              <section className="lesson-details-sidebar-panel">
                <h2 className="lesson-details-sidebar-title">Keywords</h2>
                {lesson.keywords.length > 0 ? (
                  <div className="lesson-details-keywords">
                    {lesson.keywords.map((keyword, index) => (
                      <span className="lesson-details-keyword" key={`${keyword}-${index}`}>
                        {formatKeyword(keyword)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="lesson-details-empty">No keywords.</p>
                )}
              </section>

              <section className="lesson-details-create-panel">
                <h2 className="lesson-details-create-title">Have a similar lesson?</h2>
                <p className="lesson-details-create-description">
                  Sharing your experience helps our engineering community grow stronger.
                </p>
                <Link className="lesson-details-create-button" to="/create-lesson">
                  <Plus className="lesson-details-create-icon" aria-hidden="true" />
                  Create Lesson
                </Link>
              </section>
            </aside>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default Lesson
