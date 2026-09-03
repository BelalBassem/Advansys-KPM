import api from '../axios'

export interface LessonDocument {
  id?: number
  fileName: string
  fileUrl: string
  contentType: string
}

export interface LessonContact {
  id: string
  name: string
  email: string
  role: string
}

export interface Lesson {
  id: string
  title: string
  projectName: string
  departmentId: number
  functionId: number
  industryId: number
  personToContactId: string
  personToContact?: LessonContact
  summary: string
  description: string
  imageUrl: string
  links: string[]
  keywords: string[]
  documents: LessonDocument[]
  createdDate: string
  modifiedDate: string
}

export interface CreateLessonRequest {
  title: string
  projectName: string
  departmentId: number
  functionId: number
  industryId: number
  personToContactId: string
  summary: string
  description: string
  imageUrl: string
  links: string[]
  keywords: string[]
  documents: Omit<LessonDocument, 'id'>[]
}

export async function createLesson(lesson: CreateLessonRequest): Promise<string> {
  const response = await api.post<string>('/Lesson', lesson)
  return response.data
}

export async function getAllLessons() {
  const response = await api.get<Lesson[]>('/Lesson')
  return response.data
}

export async function getLessonByID(id: string) {
  const response = await api.get<Lesson>(`/Lesson/${id}`)
  return response.data
}

export async function deleteLesson(id: string) {
  const response = await api.delete<string>(`/Lesson/${id}`)
  return response.data
}
