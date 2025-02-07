'use client'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { getStyle } from '@coreui/utils'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilBadge, cilBook, cilEducation, cilPencil, cilPeople } from '@coreui/icons'
import type { ChartData } from 'chart.js'
import { CChart } from '@coreui/react-chartjs'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import { useGetCourses } from '@/hooks/useGetCourses'
import useGetUsers from '@/hooks/useGetUsers'
import Loading from './Loading'
import EnrolledCoursesTableDashboard from './EnrolledCoursesTableDashboard'

export default function AdminDashboard() {
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()
  const { users, fetchingUsers } = useGetUsers()

  const notStartedCourses = coursesWithCompletionStatus.filter(
    (course) => course.status === 'notStarted',
  )
  const completedCourses = coursesWithCompletionStatus.filter(
    (course) => course.status === 'completed',
  )

  const inProgressCourses = coursesWithCompletionStatus.filter(
    (course) => course.status === 'inProgress',
  )

  const chartRef = useRef<any>(null)

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance) {
        const { options } = chartInstance

        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle('--cui-body-color')
        }

        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  const data: ChartData<'doughnut'> = {
    labels: ['Managed', 'Enrolled', 'Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        backgroundColor: [
          getStyle('--cui-info'),
          getStyle('--cui-primary'),
          getStyle('--cui-success'),
          getStyle('--cui-warning'),
          getStyle('--cui-danger'),
        ],
        data: [
          courses?.length,
          coursesWithCompletionStatus?.length,
          completedCourses?.length,
          inProgressCourses?.length,
          notStartedCourses?.length,
        ],
      },
    ],
  }

  return (
    <div className="mb-3">
      <CRow>
        <CCol className="mb-3">
          <CCard className="p-3 bg-secondary-subtle text-dark d-flex justify-content-between flex-row">
            <div className="border-start border-4 border-secondary py-1 px-3">
              <div className="text-truncate small text-secondary">Users</div>
              <div className="fs-4 fw-semibold">{users?.length}</div>
            </div>
            <div className="rounded p-3 d-flex align-items-center bg-light text-dark">
              <CIcon icon={cilPeople} size="xl" />
            </div>
          </CCard>
        </CCol>

        <CCol className="mb-3">
          <CCard className="p-3 bg-info-subtle text-info-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-info py-1 px-3">
              <div className="text-secondary text-truncate small">Managed Courses</div>
              <div className="fs-4 fw-semibold">{courses?.length}</div>
            </div>
            <div className="bg-info bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilPencil} color="info" size="xl" />
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
        <div className="w-100"></div>
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
        <CCol className="mb-3">
          <CCard className="p-3 bg-danger-subtle text-danger-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-danger py-1 px-3">
              <div className="text-secondary text-truncate small">Not Started</div>
              <div className="fs-4 fw-semibold">{notStartedCourses?.length}</div>
            </div>
            <div className="bg-danger bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBook} color="danger" size="xl" />
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
                <div className="d-flex justify-content-center align-items-center">
                  <Loading />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.slice(0, 5).map((user) => (
                        <CTableRow key={user.id}>
                          <CTableDataCell>
                            <Link href={`/users/${user.id}`} className="text-decoration-none">
                              {user.id}
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link href={`/users/${user.id}`} className="text-decoration-none">
                              {user.name}
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell>{user.role}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={3} className="text-center fw-bold">
                          No users found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={4}>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="fw-semibold">Course Status</CCardTitle>
              <CChart
                type="doughnut"
                data={data}
                options={{
                  responsive: true,
                  aspectRatio: 1.2,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                }}
                ref={chartRef}
              />
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
                <div className="d-flex justify-content-center align-items-center">
                  <Loading />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Course Title</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {courses.length > 0 ? (
                      courses.slice(0, 5).map((course) => (
                        <CTableRow key={course.id}>
                          <CTableDataCell>
                            <Link
                              href={`/managed-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.id}
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link
                              href={`/managed-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.title}
                            </Link>
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
        </CCol>
        <CCol>
          <EnrolledCoursesTableDashboard />
        </CCol>
      </CRow>
      <CRow></CRow>
    </div>
  )
}
