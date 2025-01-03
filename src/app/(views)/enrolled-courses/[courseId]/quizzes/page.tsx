'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CCard, CCardBody } from '@coreui/react-pro'
import { CourseQuizzesTable } from '@/components'

export default function Quizzes() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  return (
    <CCard>
      <CCardBody>
        <CourseQuizzesTable courseId={courseId} userIsStudent={true} />
      </CCardBody>
    </CCard>
  )
}
