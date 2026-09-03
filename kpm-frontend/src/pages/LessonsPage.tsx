import { useEffect, useMemo, useState } from 'react'
import '../styles/LessonsPage.css'
import { Layers3, Plus, RefreshCw, Rows3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDepartments } from '../api/APIs/departmentAPI'
import type { Department } from '../api/APIs/departmentAPI'
import { getAllLessons } from '../api/APIs/lessonAPI'
import type { Lesson } from '../api/APIs/lessonAPI'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LessonCard from '../components/LessonCard'
import SearchBar from '../components/Search'
import type { LessonSearchFilters } from '../components/Search'
import AIButton from '../components/AIButton'

const emptySearchFilters: LessonSearchFilters = {
  query: '',
  departmentId: '',
  keyword: '',
}

function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadRequest, setReloadRequest] = useState(0)
  const [searchFilters, setSearchFilters] =
    useState<LessonSearchFilters>(emptySearchFilters)
  const [isGroupedByDepartment, setIsGroupedByDepartment] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadHomepageData() {
      setIsLoading(true)
      setLoadError('')

      try {
        const [lessonData, departmentData] = await Promise.all([
          getAllLessons(),
          getDepartments(),
        ])

        if (!isActive) return

        setLessons(lessonData)
        setDepartments(departmentData)
      } catch {
        if (isActive) {
          setLoadError('Could not load lessons. Please try again.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadHomepageData()

    return () => {
      isActive = false
    }
  }, [reloadRequest])

  const departmentNames = useMemo(
    () => new Map(departments.map((department) => [department.id, department.name])),
    [departments],
  )

  const keywordOptions = useMemo(() => {
    const keywordsByName = new Map<string, string>()

    lessons.forEach((lesson) => {
      lesson.keywords.forEach((keyword) => {
        const trimmedKeyword = keyword.trim()
        const normalizedKeyword = trimmedKeyword.toLowerCase()

        if (trimmedKeyword && !keywordsByName.has(normalizedKeyword)) {
          keywordsByName.set(normalizedKeyword, trimmedKeyword)
        }
      })
    })

    return Array.from(keywordsByName.values()).sort((first, second) =>
      first.localeCompare(second),
    )
  }, [lessons])

  const filteredLessons = useMemo(() => {
    const normalizedQuery = searchFilters.query.toLowerCase()
    const normalizedKeyword = searchFilters.keyword.toLowerCase()

    return lessons.filter((lesson) => {
      if (
        searchFilters.departmentId !== '' &&
        lesson.departmentId !== searchFilters.departmentId
      ) {
        return false
      }

      if (
        normalizedKeyword &&
        !lesson.keywords.some((keyword) => keyword.trim().toLowerCase() === normalizedKeyword)
      ) {
        return false
      }

      if (!normalizedQuery) return true

      const searchableValues = [
        lesson.title,
        lesson.projectName,
        lesson.personToContact?.name ?? '',
        departmentNames.get(lesson.departmentId) ?? '',
        ...lesson.keywords,
      ]

      return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
    })
  }, [departmentNames, lessons, searchFilters])

  const groupedLessons = useMemo(() => {
    const lessonsByDepartment = new Map<number, Lesson[]>()

    filteredLessons.forEach((lesson) => {
      const departmentLessons = lessonsByDepartment.get(lesson.departmentId) ?? []
      departmentLessons.push(lesson)
      lessonsByDepartment.set(lesson.departmentId, departmentLessons)
    })

    return Array.from(lessonsByDepartment, ([departmentId, departmentLessons]) => ({
      departmentId,
      departmentName: departmentNames.get(departmentId) ?? 'Department unavailable',
      lessons: departmentLessons,
    })).sort((first, second) => first.departmentName.localeCompare(second.departmentName))
  }, [departmentNames, filteredLessons])

  const hasActiveSearch =
    Boolean(searchFilters.query) ||
    searchFilters.departmentId !== '' ||
    Boolean(searchFilters.keyword)

  return (
    <div className="lessons-page">
      <Navbar />

      <main className="lessons-main">
        <section className="lessons-header">
          <div className="lessons-title-box">
            <h1 className="lessons-title">Lesson Learned</h1>
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
          <SearchBar
            departments={departments}
            keywords={keywordOptions}
            onApply={setSearchFilters}
          />
          <button
            className="group-button"
            type="button"
            aria-pressed={isGroupedByDepartment}
            onClick={() => setIsGroupedByDepartment((isGrouped) => !isGrouped)}
          >
            {isGroupedByDepartment ? (
              <Rows3 size={17} aria-hidden="true" />
            ) : (
              <Layers3 size={17} aria-hidden="true" />
            )}
            <span>
              {isGroupedByDepartment ? 'Ungroup Departments' : 'Group by Department'}
            </span>
          </button>

          <div className="lesson-results" aria-busy={isLoading} aria-live="polite">
            {isLoading ? (
              <p className="lessons-status">Loading lessons...</p>
            ) : loadError ? (
              <div className="lessons-status lessons-error" role="alert">
                <p>{loadError}</p>
                <button
                  className="lessons-retry-button"
                  type="button"
                  onClick={() => setReloadRequest((request) => request + 1)}
                >
                  <RefreshCw size={17} aria-hidden="true" />
                  <span>Retry</span>
                </button>
              </div>
            ) : filteredLessons.length > 0 ? (
              isGroupedByDepartment ? (
                <div className="lesson-groups">
                  {groupedLessons.map((group) => (
                    <section className="lesson-group" key={group.departmentId}>
                      <header className="lesson-group-header">
                        <h2 className="lesson-group-title">{group.departmentName}</h2>
                        <span className="lesson-group-count">
                          {group.lessons.length} {group.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </header>
                      <div className="lesson-list">
                        {group.lessons.map((lesson) => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            departmentName={group.departmentName}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="lesson-list">
                  {filteredLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      departmentName={
                        departmentNames.get(lesson.departmentId) ?? 'Department unavailable'
                      }
                    />
                  ))}
                </div>
              )
            ) : (
              <p className="lessons-status">
                {hasActiveSearch
                  ? 'No lessons match the selected filters.'
                  : 'No lessons have been created yet.'}
              </p>
            )}
          </div>
        </section>
      </main>

      <AIButton />
      <Footer />
    </div>
  )
}

export default LessonsPage
