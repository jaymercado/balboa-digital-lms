'use client'
import React, { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { AppSidebar, AppFooter, AppHeader, AppBreadcrumb } from '@/components'
import { CContainer } from '@coreui/react-pro'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Image from 'next/image'
import Link from 'next/link'

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

import balboaDigitalLogo from '@/public/images/bd_logo.png'
import googleLogo from '@/public/images/search.png'
import LandingPage from '@/components/LandingPage'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession()

  useEffect(() => {
    AOS.init({ duration: 500 })
  }, [])

  if (status === 'loading') return null

  if (!data) {
    return (
      <>
        <nav
          className={`navbar navbar-expand-lg navbar-light bg-light px-3 py-3 ${poppins.className} border-bottom`}
        >
          <div className=""></div>
          <div className="container-fluid">
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <Image
                src={balboaDigitalLogo}
                alt="Balboa Digital logo"
                width={130}
                height={30}
                className="d-inline-block align-top"
              />
            </Link>

            <div className="collapse navbar-collapse">
              <div className="navbar-nav ms-auto">
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn btn-dark ms-2 border border-dark d-flex align-items-center rounded-pill fw-semibold"
                >
                  <Image
                    src={googleLogo}
                    alt="Google logo"
                    width={20}
                    height={20}
                    className="my-2 me-2"
                  />
                  Sign In with Google
                </button>
              </div>
            </div>

            <div className="d-lg-none d-flex">
              <div className="d-flex flex-column w-100">
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn btn-dark ms-2 border border-dark d-flex align-items-center rounded-pill fw-semibold"
                >
                  <Image
                    src={googleLogo}
                    alt="Google logo"
                    width={20}
                    height={20}
                    className="my-2 me-2"
                  />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>
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
          <AppFooter />
        </div>
      </>
    )
  }
}
