'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CButton, CContainer, CCol } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CourseModulesTable } from '@/components'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  return (
    <CContainer className="mt-4">
      <CCol>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <CButton
            color="primary"
            as="a"
            href={`/all-courses/${courseId}/modules/create`}
            className="fw-semibold"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Create Module
          </CButton>
        </div>

        <CourseModulesTable courseId={courseId} />
      </CCol>
    </CContainer>
  )
}
