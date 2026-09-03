import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link2, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getDepartments } from '../api/APIs/departmentAPI'
import type { Department } from '../api/APIs/departmentAPI'
import { getFunctions } from '../api/APIs/functionAPI'
import type { BusinessFunction } from '../api/APIs/functionAPI'
import { getIndustries } from '../api/APIs/industryAPI'
import type { Industry } from '../api/APIs/industryAPI'
import { createLesson } from '../api/APIs/lessonAPI'
import AIButton from '../components/AIButton'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../styles/CreateLesson.css'

interface SubmissionFeedback {
  type: '' | 'error' | 'success'
  message: string
}

const contacts = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Hossam Shaaban',
    role: 'Automation Lead',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Belal Bassem',
    role: 'Software Engineer',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Omar Sultan',
    role: 'Project Manager',
  },
]

const emptySubmissionFeedback: SubmissionFeedback = { type: '', message: '' }

function getCreateErrorMessage(error: unknown) {
  if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
    return error.response.data
  }

  return 'Could not create the lesson. Please try again.'
}

function CreateLesson() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    projectName: '',
    summary: '',
    description: '',
  })

  const [departments, setDepartments] = useState<Department[]>([])
  const [functions, setFunctions] = useState<BusinessFunction[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>('')
  const [selectedFunctionId, setSelectedFunctionId] = useState<number | ''>('')
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | ''>('')
  const [selectedContactId, setSelectedContactId] = useState('')
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(false)
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true)
  const [departmentLoadError, setDepartmentLoadError] = useState('')
  const [functionLoadError, setFunctionLoadError] = useState('')
  const [industryLoadError, setIndustryLoadError] = useState('')

  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [linkInput, setLinkInput] = useState('')
  const [links, setLinks] = useState<string[]>([])
  const [linkError, setLinkError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [documentCount, setDocumentCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionFeedback, setSubmissionFeedback] =
    useState<SubmissionFeedback>(emptySubmissionFeedback)

  const fileCount = (imageUrl.trim() ? 1 : 0) + documentCount
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId,
  )
  const selectedFunction = functions.find(
    (businessFunction) => businessFunction.id === selectedFunctionId,
  )
  const selectedIndustry = industries.find(
    (industry) => industry.id === selectedIndustryId,
  )
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId)

  useEffect(() => {
    let isActive = true

    async function loadDepartments() {
      try {
        const data = await getDepartments()

        if (isActive) {
          setDepartments(data)
        }
      } catch {
        if (isActive) {
          setDepartmentLoadError('Could not load departments.')
        }
      } finally {
        if (isActive) {
          setIsLoadingDepartments(false)
        }
      }
    }

    async function loadIndustries() {
      try {
        const data = await getIndustries()

        if (isActive) {
          setIndustries(data)
        }
      } catch {
        if (isActive) {
          setIndustryLoadError('Could not load industries.')
        }
      } finally {
        if (isActive) {
          setIsLoadingIndustries(false)
        }
      }
    }

    loadDepartments()
    loadIndustries()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const departmentId = selectedDepartmentId

    if (departmentId === '') {
      return
    }

    async function loadFunctions(id: number) {
      try {
        const data = await getFunctions(id)

        if (isActive) {
          setFunctions(data)
        }
      } catch {
        if (isActive) {
          setFunctionLoadError('Could not load functions for this department.')
        }
      } finally {
        if (isActive) {
          setIsLoadingFunctions(false)
        }
      }
    }

    loadFunctions(departmentId)

    return () => {
      isActive = false
    }
  }, [selectedDepartmentId])

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setSubmissionFeedback(emptySubmissionFeedback)
  }

  function addKeyword() {
    const keyword = keywordInput.trim()

    if (!keyword) return

    setKeywords((current) =>
      current.some((item) => item.toLowerCase() === keyword.toLowerCase())
        ? current
        : [...current, keyword],
    )
    setKeywordInput('')
  }

  function addLink() {
    const value = linkInput.trim()

    if (!value) return

    const normalizedLink = /^https?:\/\//i.test(value) ? value : `https://${value}`

    try {
      new URL(normalizedLink)
    } catch {
      setLinkError('Enter a valid link.')
      return
    }

    setLinks((current) =>
      current.includes(normalizedLink) ? current : [...current, normalizedLink],
    )
    setLinkInput('')
    setLinkError('')
  }

  async function handleCreateLesson() {
    const title = form.title.trim()
    const projectName = form.projectName.trim()
    const summary = form.summary.trim()
    const description = form.description.trim()

    if (
      !title ||
      !projectName ||
      selectedDepartmentId === '' ||
      selectedFunctionId === '' ||
      selectedIndustryId === '' ||
      !selectedContactId ||
      !summary ||
      !description
    ) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Complete all required fields before submitting.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setSubmissionFeedback(emptySubmissionFeedback)

      await createLesson({
        title,
        projectName,
        departmentId: selectedDepartmentId,
        functionId: selectedFunctionId,
        industryId: selectedIndustryId,
        personToContactId: selectedContactId,
        summary,
        description,
        imageUrl: imageUrl.trim(),
        links,
        keywords,
        documents: [],
      })

      setSubmissionFeedback({
        type: 'success',
        message: 'Lesson created successfully.',
      })
    } catch (error) {
      setSubmissionFeedback({
        type: 'error',
        message: getCreateErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <form
          className="create-lesson-layout"
          onSubmit={(event) => {
            event.preventDefault()
            handleCreateLesson()
          }}
          noValidate
        >
          <div className="create-lesson-left-column">
            <section className="create-lesson-basic-information">
              <p className="create-lesson-section-title">Basic Information</p>

              <div className="create-lesson-field-grid">
                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="lesson-title">
                    Lesson Title
                  </label>
                  <input
                    className="create-lesson-control"
                    id="lesson-title"
                    type="text"
                    value={form.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="Enter lesson title"
                    required
                  />
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="project-name">
                    Project Name
                  </label>
                  <input
                    className="create-lesson-control"
                    id="project-name"
                    type="text"
                    value={form.projectName}
                    onChange={(event) => updateField('projectName', event.target.value)}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="department">
                    Department
                  </label>
                  <select
                    className="create-lesson-control"
                    id="department"
                    value={selectedDepartmentId}
                    onChange={(event) => {
                      const value = event.target.value
                      const departmentId = value ? Number(value) : ''

                      setSelectedDepartmentId(departmentId)
                      setFunctions([])
                      setSelectedFunctionId('')
                      setFunctionLoadError('')
                      setIsLoadingFunctions(departmentId !== '')
                      setSubmissionFeedback(emptySubmissionFeedback)
                    }}
                    disabled={isLoadingDepartments}
                    required
                    aria-describedby={
                      departmentLoadError ? 'department-load-error' : undefined
                    }
                  >
                    <option value="">
                      {isLoadingDepartments ? 'Loading departments...' : 'Select department'}
                    </option>
                    {departments.map((department) => (
                      <option value={department.id} key={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {departmentLoadError && (
                    <p className="create-lesson-field-error" id="department-load-error">
                      {departmentLoadError}
                    </p>
                  )}
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="function">
                    Function
                  </label>
                  <select
                    className="create-lesson-control"
                    id="function"
                    value={selectedFunctionId}
                    onChange={(event) => {
                      const value = event.target.value
                      setSelectedFunctionId(value ? Number(value) : '')
                      setSubmissionFeedback(emptySubmissionFeedback)
                    }}
                    disabled={
                      selectedDepartmentId === '' ||
                      isLoadingFunctions ||
                      functions.length === 0
                    }
                    required
                    aria-describedby={functionLoadError ? 'function-load-error' : undefined}
                  >
                    <option value="">
                      {selectedDepartmentId === ''
                        ? 'Select department first'
                        : isLoadingFunctions
                          ? 'Loading functions...'
                          : functions.length === 0
                            ? 'No functions available'
                            : 'Select function'}
                    </option>
                    {functions.map((businessFunction) => (
                      <option value={businessFunction.id} key={businessFunction.id}>
                        {businessFunction.name}
                      </option>
                    ))}
                  </select>
                  {functionLoadError && (
                    <p className="create-lesson-field-error" id="function-load-error">
                      {functionLoadError}
                    </p>
                  )}
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="industry">
                    Industry
                  </label>
                  <select
                    className="create-lesson-control"
                    id="industry"
                    value={selectedIndustryId}
                    onChange={(event) => {
                      const value = event.target.value
                      setSelectedIndustryId(value ? Number(value) : '')
                      setSubmissionFeedback(emptySubmissionFeedback)
                    }}
                    disabled={isLoadingIndustries}
                    required
                    aria-describedby={industryLoadError ? 'industry-load-error' : undefined}
                  >
                    <option value="">
                      {isLoadingIndustries ? 'Loading industries...' : 'Select industry'}
                    </option>
                    {industries.map((industry) => (
                      <option value={industry.id} key={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                  {industryLoadError && (
                    <p className="create-lesson-field-error" id="industry-load-error">
                      {industryLoadError}
                    </p>
                  )}
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="person-to-contact">
                    Person to Contact
                  </label>
                  <select
                    className="create-lesson-control"
                    id="person-to-contact"
                    value={selectedContactId}
                    onChange={(event) => {
                      setSelectedContactId(event.target.value)
                      setSubmissionFeedback(emptySubmissionFeedback)
                    }}
                    required
                  >
                    <option value="">Select person to contact</option>
                    {contacts.map((contact) => (
                      <option value={contact.id} key={contact.id}>
                        {contact.name} - {contact.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="create-lesson-content">
              <p className="create-lesson-section-title">Lesson Content</p>

              <div className="create-lesson-content-fields">
                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="lesson-summary">
                    Summary
                  </label>
                  <textarea
                    className="create-lesson-control create-lesson-summary"
                    id="lesson-summary"
                    value={form.summary}
                    onChange={(event) => updateField('summary', event.target.value)}
                    placeholder="Write a short summary of the lesson"
                    rows={3}
                    required
                  />
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="lesson-description">
                    Description
                  </label>
                  <textarea
                    className="create-lesson-control create-lesson-description"
                    id="lesson-description"
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Write the full description of the lesson"
                    rows={6}
                    required
                  />
                </div>

                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="lesson-keyword">
                    Keywords
                  </label>
                  <div className="create-lesson-inline-add">
                    <input
                      className="create-lesson-control"
                      id="lesson-keyword"
                      type="text"
                      value={keywordInput}
                      onChange={(event) => setKeywordInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addKeyword()
                        }
                      }}
                      placeholder="Add a keyword"
                    />
                    <button
                      className="create-lesson-add-button"
                      type="button"
                      onClick={addKeyword}
                      aria-label="Add keyword"
                      title="Add keyword"
                    >
                      <Plus size={18} aria-hidden="true" />
                    </button>
                  </div>

                  {keywords.length > 0 && (
                    <div className="create-lesson-chip-list" aria-label="Added keywords">
                      {keywords.map((keyword) => (
                        <span className="create-lesson-chip" key={keyword}>
                          {keyword}
                          <button
                            type="button"
                            onClick={() =>
                              setKeywords((current) =>
                                current.filter((item) => item !== keyword),
                              )
                            }
                            aria-label={`Remove ${keyword}`}
                            title={`Remove ${keyword}`}
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="create-lesson-attachments">
              <p className="create-lesson-section-title">Attachments</p>

              <div className="create-lesson-attachments-list">
                <div className="create-lesson-field">
                  <label className="create-lesson-label" htmlFor="lesson-image-url">
                    Image URL
                  </label>
                  <input
                    className="create-lesson-control"
                    id="lesson-image-url"
                    type="text"
                    value={imageUrl}
                    maxLength={2048}
                    onChange={(event) => {
                      setImageUrl(event.target.value)
                      setSubmissionFeedback(emptySubmissionFeedback)
                    }}
                    placeholder="/images/lesson-image.jpg"
                  />
                </div>

                <label className="create-lesson-attachments-box">
                  <span className="create-lesson-attachments-box-title">Upload a document</span>
                  <span className="create-lesson-attachments-box-description">
                    PDF, DOCX or PPTX (max 5MB)
                  </span>
                  <input
                    className="create-lesson-attachments-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(event) => setDocumentCount(event.target.files?.length ?? 0)}
                  />
                </label>
              </div>

              <p className="create-lesson-attachments-status">
                {fileCount === 0
                  ? 'No files attached yet'
                  : `${fileCount} ${fileCount === 1 ? 'file' : 'files'} attached`}
              </p>

              <div className="create-lesson-links-section">
                <div className="create-lesson-links-heading">
                  <Link2 size={18} aria-hidden="true" />
                  <p>Links</p>
                </div>
                <div className="create-lesson-inline-add">
                  <input
                    className="create-lesson-control"
                    id="lesson-link"
                    type="url"
                    value={linkInput}
                    onChange={(event) => {
                      setLinkInput(event.target.value)
                      setLinkError('')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addLink()
                      }
                    }}
                    placeholder="https://example.com/resource"
                    aria-label="Resource link"
                    aria-describedby={linkError ? 'lesson-link-error' : undefined}
                  />
                  <button
                    className="create-lesson-add-button"
                    type="button"
                    onClick={addLink}
                    aria-label="Attach link"
                    title="Attach link"
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>

                {linkError && (
                  <p className="create-lesson-field-error" id="lesson-link-error">
                    {linkError}
                  </p>
                )}

                {links.length > 0 && (
                  <div className="create-lesson-link-list">
                    {links.map((link) => (
                      <div className="create-lesson-link-item" key={link}>
                        <a href={link} target="_blank" rel="noreferrer">
                          {link}
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setLinks((current) => current.filter((item) => item !== link))
                          }
                          aria-label={`Remove ${link}`}
                          title="Remove link"
                        >
                          <X size={16} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="create-lesson-submit-area">
              <div className="create-lesson-buttons">
                <button
                  onClick={() => navigate('/')}
                  className="create-lesson-buttons-discard"
                  type="button"
                >
                  Discard
                </button>
                <div className="create-lesson-buttons-save">
                  <button className="create-lesson-buttons-draft" type="button">
                    Save as Draft
                  </button>
                  <button
                    className="create-lesson-submit-lesson"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Submit Lesson'}
                  </button>
                </div>
              </div>

              {submissionFeedback.message && (
                <p
                  className={`create-lesson-submit-feedback create-lesson-submit-feedback-${submissionFeedback.type}`}
                  role={submissionFeedback.type === 'error' ? 'alert' : 'status'}
                >
                  {submissionFeedback.message}
                </p>
              )}
            </section>
          </div>

          <aside className="create-lesson-review">
            <p className="create-lesson-section-title">Review Summary</p>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Basic Information</p>
              <div className="create-lesson-review-row">
                <span>Lesson Title</span>
                <span>{form.title || 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Project Name</span>
                <span>{form.projectName || 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Department</span>
                <span>{selectedDepartment?.name || 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Function</span>
                <span>{selectedFunction?.name || 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Industry</span>
                <span>{selectedIndustry?.name || 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Person to Contact</span>
                <span>{selectedContact?.name || 'Not provided'}</span>
              </div>
            </div>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Lesson Content</p>
              <div className="create-lesson-review-row">
                <span>Summary</span>
                <span>{form.summary ? 'Added' : 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Description</span>
                <span>{form.description ? 'Added' : 'Not provided'}</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Keywords</span>
                <span>{keywords.length} added</span>
              </div>
            </div>

            <div className="create-lesson-review-section">
              <p className="create-lesson-review-section-title">Attachments</p>
              <div className="create-lesson-review-row">
                <span>Files</span>
                <span>{fileCount} items</span>
              </div>
              <div className="create-lesson-review-row">
                <span>Links</span>
                <span>{links.length} added</span>
              </div>
            </div>

            <p className="create-lesson-review-note">
              You can save a draft or submit the lesson when ready.
            </p>
          </aside>
        </form>
      </main>

      <AIButton />
      <Footer />
    </div>
  )
}

export default CreateLesson
