import AICenterPage from '@/features/app/ai-center/AICenterPage'
import CommunityPage from '@/features/app/community/QuizPage'
import FlashcardDetailPage from '@/features/app/flashcard/pages/FlashcardDetailPage'
import FlashcardPage from '@/features/app/flashcard/pages/FlashcardPage'
import FlashcardPracticeDetailPage from '@/features/app/flashcard/pages/FlashcardPracticeDetailPage'
import FlashcardPracticePage from '@/features/app/flashcard/pages/FlashcardPracticePage'
import HomePage from '@/features/app/home/HomePage'
import ProfileByIdPage from '@/features/app/profile/pages/ProfileByIdPage'
import ProfilePage from '@/features/app/profile/pages/ProfilePage'
import QuizPage from '@/features/app/quiz/QuizPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import UpdatePasswordPage from '@/features/auth/UpdatePasswordPage'
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
                    {
                        path: 'flashcard',
                        element: <FlashcardPage />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'profile/:userId',
                        element: <ProfileByIdPage />,
                    },
                    {
                        path: 'ai-center',
                        element: <AICenterPage />,
                    },
                    {
                        path: 'quiz',
                        element: <QuizPage />,
                    },
                    {
                        path: 'community',
                        element: <CommunityPage />,
                    },
                ],
            },
            {
                path: 'flashcard/:id_flashcard',
                element: <FlashcardDetailPage />,
            },
            {
                path: 'flashcard/practice',
                element: <FlashcardPracticePage />,
            },
            {
                path: 'flashcard/practice/:id_flashcard',
                element: <FlashcardPracticeDetailPage />,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                    {
                        path: 'register',
                        element: <RegisterPage />,
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPasswordPage />,
                    },
                    {
                        path: 'update-password',
                        element: <UpdatePasswordPage />,
                    },
                ],
            },

            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
