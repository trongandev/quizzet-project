import axiosInstance from './axiosInstance'

class QuizService {
    async getPublicQuizzes({ currentPage, itemsPerPage }: { currentPage?: number; itemsPerPage?: number }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/quiz?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
    }
    async getQuizByUser() {
        const response = await axiosInstance.get<any>('/quiz/getquizbyuser')
        return response.data
    }
}

export default new QuizService()
