import api from '../axios'

export interface Industry {
  id: number
  name: string
  createdDate: string
  modifiedDate: string
}

export async function createIndustry(name: string) {
  const response = await api.post<number>('/Industry', null, { params: { name } })

  return response.data
}

export async function getIndustries() {
  const response = await api.get<Industry[]>('/Industry')

  return response.data
}

export async function updateIndustry(id: number, name: string) {
  const response = await api.put<number>(`/Industry/${id}`, null, {
    params: { name },
  })

  return response.data
}

export async function deleteIndustry(id: number) {
  const response = await api.delete<number>(`/Industry/${id}`)

  return response.data
}
