import axiosInstance from './axiosInstance'

class SOService {
    async getPublicSO({ currentPage, itemsPerPage }: { currentPage?: number; itemsPerPage?: number }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/so?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
    }
    async getSOByUser() {
        const response = await axiosInstance.get<any>('/so/user')
        return response.data
    }
}

export default new SOService()
