'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CButton, CCard, CCardBody } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CourseQuizzesTable } from '@/components'

export default function Quizzes() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  return (
    <CCard className="mt-4">
      <CCardBody>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <CButton
            color="primary"
            as="a"
            href={`/managed-courses/${courseId}/quizzes/create`}
            className="fw-semibold"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Create Quiz
          </CButton>
        </div>

        <CourseQuizzesTable courseId={courseId} userIsInstructor={true} />
      </CCardBody>
    </CCard>
  )
}
