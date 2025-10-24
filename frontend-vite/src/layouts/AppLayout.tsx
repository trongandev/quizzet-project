import CFooter from '@/features/app/CFooter'
import CHeader from '@/features/app/CHeader'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
    return (
        <div className="">
            <CHeader />
            <main className="">
                <Outlet />
            </main>
            <CFooter />
        </div>
    )
}
