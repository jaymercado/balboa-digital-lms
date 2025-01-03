'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CCard, CCardBody } from '@coreui/react-pro'
import { CourseModulesTable } from '@/components'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  return (
    <CCard>
      <CCardBody>
        <CourseModulesTable courseId={courseId} userIsStudent={true} />
      </CCardBody>
    </CCard>
  )
}
