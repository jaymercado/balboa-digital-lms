'use client'

import React from 'react'
import Link from 'next/link'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import { useGetCourseItems } from '@/hooks/useGetCourseItems'
import { Loading } from '@/components'

export default function CourseItemsTable({ courseId, userIsStudent }: CourseItemsTableProps) {
  const { courseItems, fetchingCourseItems } = useGetCourseItems({ courseId })

  if (fetchingCourseItems) {
    return <Loading />
  }

  // TODO: Add a 404 page
  if (!courseItems) {
    return <div>Modules not found</div>
  }

  return (
    <CTable striped>
      <CTableHead>
        <CTableRow>
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
        {courseItems.length > 0 ? (
          courseItems.map((item) => (
            <CTableRow key={item.id} align="middle">
              <CTableDataCell>
                <Link
                  href={`/${userIsStudent ? 'enrolled' : 'managed'}-courses/${courseId}/items/${
                    item.id
                  }`}
                  className="text-decoration-none"
                >
                  <span className="fw-semibold">{item.id}</span>
                </Link>
              </CTableDataCell>
              <CTableDataCell>
                <span className="fw-semibold">{item.title}</span>
              </CTableDataCell>
              <CTableDataCell>
                <span className="text-capitalize">{item.type}</span>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={4} className="text-center">
              No items available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}

interface CourseItemsTableProps {
  courseId: string
  userIsStudent?: boolean
}
