import React from 'react'
import Link from 'next/link'
import {
  CTable,
  CBadge,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CCard,
  CCardBody,
  CCardTitle,
} from '@coreui/react-pro'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import Loading from './Loading'

export default function EnrolledCoursesTableDashboard() {
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()

  return (
    <div>
      {' '}
      <CCard className="h-100">
        <CCardBody>
          <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Enrolled Courses</span>{' '}
            <Link href={`/enrolled-courses`} className="text-decoration-none">
              <span className="fs-6 text-secondary">View All</span>
            </Link>
          </CCardTitle>
          {fetchingUserCourseItemLogs ? (
            <Loading />
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Course Title</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {coursesWithCompletionStatus.length > 0 ? (
                  coursesWithCompletionStatus.slice(0, 6).map((course) => (
                    <CTableRow key={course.id}>
                      <CTableDataCell>
                        <Link
                          href={`/enrolled-courses/${course.id}`}
                          className="text-decoration-none"
                        >
                          {course.id}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          href={`/enrolled-courses/${course.id}`}
                          className="text-decoration-none"
                        >
                          {course.title}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        {course.status === 'completed' ? (
                          <CBadge
                            color="success"
                            shape="rounded-pill"
                            className="text-success-emphasis bg-success-subtle"
                          >
                            Completed
                          </CBadge>
                        ) : course.status === 'inProgress' ? (
                          <CBadge
                            shape="rounded-pill"
                            className="text-warning-emphasis bg-warning-subtle"
                          >
                            In Progress
                          </CBadge>
                        ) : (
                          <CBadge
                            shape="rounded-pill"
                            className="text-danger-emphasis bg-danger-subtle"
                          >
                            Not Started
                          </CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center fw-bold">
                      No courses found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}
