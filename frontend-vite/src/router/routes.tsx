import HomePage from '@/features/app/home/HomePage'
import LoginPage from '@/features/auth/LoginPage'
import NotFound from '@/features/not-found/NotFound'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import RootLayout from '@/layouts/RootLayout'
import type { RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                ],
                errorElement: <div>Something went wrong!</div>,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                    // {
                    //     path: 'register',
                    //     element: <RegisterPage />,
                    // },
                    // {
                    //     path: 'forgot-password',
                    //     element: <ForgotPasswordPage />,
                    // },
                ],
            },

            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
