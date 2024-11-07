'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react'

export default function Course() {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]

  if (fetchingCourses || !course) {
    return <Loading />
  }

  return (
    <CCard>
      <CCardHeader>
        <h5>{course.title}</h5>
      </CCardHeader>
      <CCardBody>
        <p><strong>Description:</strong> {course.description}</p>
        <p>
          <strong>Instructors:</strong>
          {course.instructors.map((instructor, index) => (
            <span key={instructor.id}>
              {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>

        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Type</CTableHeaderCell>
              <CTableHeaderCell>Content</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {course.modules.map((module) => (
              <CTableRow key={module.id}>
                <CTableDataCell>
                  <Link href={`/enrolled-courses/${course.id}/modules/${module.id}`}>{module.id}</Link>
                </CTableDataCell>
                <CTableDataCell>{module.title}</CTableDataCell>
                <CTableDataCell>{module.type}</CTableDataCell>
                <CTableDataCell dangerouslySetInnerHTML={{ __html: module.content }} />
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}