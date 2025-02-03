'use client'
import React from 'react'
import Link from 'next/link'
import CIcon from '@coreui/icons-react'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CTable, CBadge } from '@coreui/react-pro'
import { cilEducation, cilBadge, cilBook, cilPencil, cilPeople } from '@coreui/icons'
import { useGetCourses } from '@/hooks/useGetCourses'
import useGetUsers from '@/hooks/useGetUsers'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import Loading from './Loading'

export default function AdminDashboard() {
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()
  const { users, fetchingUsers } = useGetUsers()
  const completedCourses = coursesWithCompletionStatus.filter((course) => course.completed)
  const inProgressCourses = coursesWithCompletionStatus.filter(
    (course) => course.completed === false,
  )

  return (
    <div>
      <CRow>
        <CCol className="mb-3">
          <CCard className="p-3 bg-info-subtle text-info-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-info py-1 px-3">
              <div className="text-secondary text-truncate small">Users</div>
              <div className="fs-4 fw-semibold">{users?.length}</div>
            </div>
            <div className="bg-info bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilPeople} color="info" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-danger-subtle text-danger-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-danger py-1 px-3">
              <div className="text-secondary text-truncate small">Managed Courses</div>
              <div className="fs-4 fw-semibold">{courses?.length}</div>
            </div>
            <div className="bg-danger bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilPencil} color="danger" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-primary-subtle text-primary-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-primary py-1 px-3">
              <div className="text-secondary text-truncate small">Enrolled Courses</div>
              <div className="fs-4 fw-semibold">{coursesWithCompletionStatus?.length}</div>
            </div>
            <div className="bg-primary bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilEducation} color="primary" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-success-subtle text-success-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-success py-1 px-3">
              <div className="text-secondary text-truncate small">Completed Courses</div>
              <div className="fs-4 fw-semibold">{completedCourses?.length}</div>
            </div>
            <div className="bg-success bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBadge} color="success" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-warning-subtle text-warning-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-warning py-1 px-3">
              <div className="text-secondary text-truncate small">Courses In Progress</div>
              <div className="fs-4 fw-semibold">{inProgressCourses?.length}</div>
            </div>
            <div className="bg-warning bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBook} color="warning" size="xl" />
            </div>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CCol>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Users</span>
                <Link href={`/users`} className="text-decoration-none">
                  <span className="fs-6 text-secondary">View All</span>
                </Link>
              </CCardTitle>
              {fetchingUsers ? (
                <tr className="mx-auto">
                  <Loading />
                </tr>
              ) : (
                <CTable hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td>
                            <Link
                              href={`/enrolled-courses/${user.id}`}
                              className="text-decoration-none"
                            >
                              {user.id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`/enrolled-courses/${user.id}`}
                              className="text-decoration-none"
                            >
                              {user.name}
                            </Link>
                          </td>
                          <td>{user.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center fw-bold">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CCol>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Managed Courses</span>{' '}
                <Link href={`/managed-courses`} className="text-decoration-none">
                  <span className="fs-6 text-secondary">View All</span>
                </Link>
              </CCardTitle>
              {fetchingCourses ? (
                <tr>
                  <Loading />
                </tr>
              ) : (
                <CTable hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.slice(0, 5).map((course) => (
                        <tr key={course.id}>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.title}
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center fw-bold">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Enrolled Courses</span>{' '}
                <Link href={`/enrolled-courses`} className="text-decoration-none">
                  <span className="fs-6 text-secondary">View All</span>
                </Link>
              </CCardTitle>
              {fetchingUserCourseItemLogs ? (
                <tr>
                  <Loading />
                </tr>
              ) : (
                <CTable hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Title</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesWithCompletionStatus.length > 0 ? (
                      coursesWithCompletionStatus.slice(0, 5).map((course) => (
                        <tr key={course.id}>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.title}
                            </Link>
                          </td>
                          <td>
                            {course.completed ? (
                              <CBadge
                                color="success"
                                shape="rounded-pill"
                                className="text-success-emphasis bg-success-subtle"
                              >
                                Completed
                              </CBadge>
                            ) : (
                              <CBadge
                                shape="rounded-pill"
                                className="text-warning-emphasis bg-warning-subtle"
                              >
                                In Progress
                              </CBadge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center fw-bold">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow></CRow>
    </div>
  )
}
