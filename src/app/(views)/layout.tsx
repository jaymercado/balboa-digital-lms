'use client'

import { useSession, signIn } from 'next-auth/react'
import { AppSidebar, AppFooter, AppHeader, AppBreadcrumb } from '@/components'
import { CContainer } from '@coreui/react-pro'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession()

  if (status === 'loading') return null

  if (!data) signIn()

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
          <AppFooter />
        </div>
      </>
    )
  }
}
