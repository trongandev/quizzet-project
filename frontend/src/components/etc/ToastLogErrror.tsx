import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function ToastLogErrror(error: AxiosError | any) {
    if (error.response.data.errors === undefined) {
        return toast.error(error?.response?.data?.message)
    } else {
        return toast.error(error?.response?.data?.message, {
            description: (
                <div>
                    {error.response.data.errors.map((item: string) => (
                        <p>+ {item}</p>
                    ))}
                </div>
            ),
            duration: 5000,
        })
    }
}
