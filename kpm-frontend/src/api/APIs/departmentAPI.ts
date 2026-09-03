import api from '../../api/axios';

export interface Department {
    id: number;
    name: string;
    createdDate: Date;
    modifiedDate: Date;
}

export async function createDepartment(name : string){
    const response = await api.post<Department>("/Department" , null , {params: {name}});

    return response.data;
}

export async function getDepartments(){
    const response = await api.get<Department[]>(`/Department`)

    return response.data;
}

export async function updateDepartment(id : number , name : string){
    const response = await api.put<Department>(`/Department/${id}` , null , {
        params:{name}
    });

    return response.data
}

export async function deleteDepartment(id : number){
    const response = await api.delete<Department>(`/Department/${id}`);

    return response.data
}
