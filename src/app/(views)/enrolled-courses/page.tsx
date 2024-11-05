'use client'

import React from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react-pro'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'

export default function ManagedCourses() {
  const { courses, fetchingCourses } = useGetCourses({ type: 'enrolled' })

  return (
    <CCard className="mb-4">
      <CCardHeader>Courses</CCardHeader>
      <CCardBody>
        {fetchingCourses ? (
          <Loading />
        ) : (
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {courses.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={4}>No courses found</CTableDataCell>
                </CTableRow>
              )}
              {courses.map((course) => (
                <CTableRow key={course.id}>
                  <CTableDataCell>
                    <Link href={`/enrolled-courses/${course.id}`}>{course.id}</Link>
                  </CTableDataCell>
                  <CTableDataCell>{course.title}</CTableDataCell>
                  <CTableDataCell>{course.description}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}
