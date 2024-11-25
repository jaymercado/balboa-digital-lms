'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Nav, LandingPage, AppSidebar, AppHeader, AppBreadcrumb, AppFooter } from '@/components'
import { CContainer } from '@coreui/react-pro'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession()

  useEffect(() => {
    AOS.init({ duration: 500 })
  }, [])

  if (status === 'loading') return null

  if (!data) {
    return (
      <>
        <Nav />
        <LandingPage />
      </>
    )
  }

  if (data) {
    return (
      <>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <CContainer lg className="px-4">
              <AppBreadcrumb />
              {children}
            </CContainer>
          </div>
        </div>
      </>
    )
  }
}
