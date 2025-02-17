'use client'

import { Poppins } from 'next/font/google'
import { CButton, CCol, CContainer, CRow } from '@coreui/react-pro'
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const Page404 = () => {
  return (
    <div className="bg min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer className={`${poppins.className}`}>
        <CRow className="justify-content-center">
          <CCol md={6} className="text-center">
            <h1 className="display-1 fw-bold text-primary error-text">404</h1>
            <h4 className="fw-semibold text-light">Oops! Page Not Found</h4>
            <p className="text-secondary">
              The page you are looking for might have been removed or is temporarily unavailable.
            </p>

            <Link href="/" passHref>
              <CButton color="primary" className="mt-4 px-4 py-2 rounded-pill shadow-sm">
                Go Back to Home
              </CButton>
            </Link>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
