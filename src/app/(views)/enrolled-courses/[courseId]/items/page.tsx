'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CCard, CCardBody } from '@coreui/react-pro'
import { CourseItemsTable } from '@/components'

export default function Items() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  return (
    <CCard>
      <CCardBody>
        <CourseItemsTable courseId={courseId} />
      </CCardBody>
    </CCard>
  )
}
