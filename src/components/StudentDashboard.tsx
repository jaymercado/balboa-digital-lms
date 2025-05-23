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
import EnrolledCoursesTableDashboard from './EnrolledCoursesTableDashboard'

export default function StudentDashboard() {
  const { enrolledCourses, coursesWithCompletionStatus, fetchingUserCourseItemLogs } =
    useGetAllUserCourseItemLogs()

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

  const data: ChartData<'bar'> = {
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
          enrolledCourses?.length,
          completedCourses?.length,
          inProgressCourses?.length,
          notStartedCourses?.length,
        ],
        label: 'Course Status',
        barThickness: 35,
        borderRadius: 5,
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
              <div className="fs-4 fw-semibold">{enrolledCourses?.length}</div>
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
              <div className="fs-4 fw-semibold">{notStartedCourses?.length}</div>
            </div>
            <div className="bg-danger bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBook} color="danger" size="xl" />
            </div>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <EnrolledCoursesTableDashboard />
        </CCol>
        <CCol xs={5}>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="fw-semibold">Course Status</CCardTitle>
              <CChart
                type="bar"
                data={data}
                options={{
                  aspectRatio: 1.5,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: getStyle('--cui-border-color'),
                      },
                    },
                    y: {
                      grid: {
                        color: getStyle('--cui-border-color'),
                      },
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
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
