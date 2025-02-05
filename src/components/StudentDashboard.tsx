'use client'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CTable,
  CBadge,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilEducation, cilBadge, cilBook, cilPencil } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import type { ChartData } from 'chart.js'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import Loading from './Loading'

export default function StudentDashboard() {
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()

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
    labels: ['Enrolled', 'Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        backgroundColor: [
          getStyle('--cui-primary'),
          getStyle('--cui-success'),
          getStyle('--cui-warning'),
          getStyle('--cui-danger'),
        ],
        data: [
          coursesWithCompletionStatus?.length,
          inProgressCourses?.length,
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
        <CCol className="mb-3">
          <CCard className="p-3 bg-danger-subtle text-danger-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-danger py-1 px-3">
              <div className="text-secondary text-truncate small">Not Started</div>
              <div className="fs-4 fw-semibold">{inProgressCourses?.length}</div>
            </div>
            <div className="bg-danger bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBook} color="danger" size="xl" />
            </div>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Courses</span>{' '}
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
                  aspectRatio: 1,
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
    </div>
  )
}
