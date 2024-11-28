'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import {
  CTableHead,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardBody,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilVideo, cilImage, cilFile, cilNotes } from '@coreui/icons'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })

  if (fetchingCourses) {
    return <Loading />
  }

  return (
    <CCard>
      <CCardBody>
        <CTable striped>
          <CTableHead>
            <CTableRow className="text-secondary">
              <CTableHeaderCell>
                <small>ID</small>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <small>Title</small>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <small>Type</small>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {courses[0]?.modules.length > 0 ? (
              courses[0]?.modules.map((module) => (
                <CTableRow key={module.id} align="middle">
                  <CTableDataCell>
                    <Link href={`/enrolled-courses/${courses[0]?.id}/modules/${module.id}`}>
                      {module.id}
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link
                      href={`/enrolled-courses/${courses[0]?.id}/modules/${module.id}`}
                      className="text-decoration-none"
                    >
                      <span className="fw-semibold">{module.title}</span>
                      <small className="d-block text-truncate text-secondary description">
                        {module.description}
                      </small>
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    {module.type === 'video' && <CIcon icon={cilVideo} size="sm" color="dark" />}
                    {module.type === 'text' && <CIcon icon={cilNotes} size="sm" color="dark" />}
                    {module.type === 'pdf' && <CIcon icon={cilFile} size="sm" color="dark" />}
                    {module.type === 'image' && <CIcon icon={cilImage} size="sm" color="dark" />}
                    <small className="text-secondary ms-1">
                      <span className="text-capitalize">{module.type}</span>
                    </small>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={4} className="text-center">
                  No modules available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}
