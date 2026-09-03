import api from '../axios'
import type { Department } from './departmentAPI'

export interface BusinessFunction {
  id: number
  name: string
  createdDate: string
  lastModifiedDate: string
}

interface FunctionDepartmentRelation {
  functionId: number
  departmentId: number
}

export async function getFunctions(departmentId?: number) {
  const response = await api.get<BusinessFunction[]>('/Function', {
    params: departmentId === undefined ? undefined : { departmentId },
  })

  return response.data
}

export async function getFunctionById(id: number) {
  const response = await api.get<BusinessFunction>(`/Function/${id}`)

  return response.data
}

export async function createFunction(name: string, departmentId: number) {
  const response = await api.post<number>('/Function', null, {
    params: { name, departmentId },
  })

  return response.data
}

export async function updateFunction(id: number, name: string) {
  const response = await api.put<number>(`/Function/${id}`, null, {
    params: { name },
  })

  return response.data
}

export async function deleteFunction(id: number) {
  const response = await api.delete<number>(`/Function/${id}`)

  return response.data
}

export async function getFunctionDepartments(functionId: number) {
  const response = await api.get<Department[]>(`/Function/${functionId}/departments`)

  return response.data
}

export async function addFunctionToDepartment(
  functionId: number,
  departmentId: number,
) {
  const response = await api.post<FunctionDepartmentRelation>(
    `/Function/${functionId}/departments/${departmentId}`,
  )

  return response.data
}

export async function removeFunctionFromDepartment(
  functionId: number,
  departmentId: number,
) {
  await api.delete(`/Function/${functionId}/departments/${departmentId}`)
}
