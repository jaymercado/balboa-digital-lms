'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPenAlt, cilPeople, cilFile, cilNotes, cilVideo, cilImage } from '@coreui/icons'

export default function Course() {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]

  if (fetchingCourses || !course) {
    return <Loading />
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol>
                <CBadge color="primary" shape="rounded-pill" className="text-normal mb-2">
                  Course ID: {courseId}
                </CBadge>
                <CCardTitle className="fw-semibold fs-4">{course.title}</CCardTitle>
              </CCol>
            </CRow>
            <CCardText className="text-secondary">{course.description}</CCardText>
            <CCardText>
              <CIcon icon={cilPeople} size="sm" className="me-2" />
              <strong>Enrollees:</strong>{' '}
              {course.enrollees.map((enrollee, index) => (
                <span key={enrollee.id}>
                  {enrollee?.name} {index < course.enrollees.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
            <CCardText>
              <CIcon icon={cilPenAlt} size="sm" className="me-2" />
              <strong>Instructors:</strong>{' '}
              {course.instructors.map((instructor, index) => (
                <span key={instructor.id}>
                  {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
          </CCardBody>
        </CCard>
        <CCard className="p-1">
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <div className="fs-4 fw-bold">Modules</div>
                <Link
                  href={`/enrolled-courses/${course.id}/modules`}
                  className="me-2 text-decoration-none"
                >
                  <small className="text-secondary d-none d-sm-inline">View All Modules</small>
                  <small className="text-secondary d-inline d-sm-none">View All</small>
                  <i className="bi bi-chevron-right text-secondary"></i>
                </Link>
              </CCol>
            </CRow>
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
                        {module.type === 'video' && (
                          <CIcon icon={cilVideo} size="sm" color="dark" />
                        )}
                        {module.type === 'text' && <CIcon icon={cilNotes} size="sm" color="dark" />}
                        {module.type === 'pdf' && <CIcon icon={cilFile} size="sm" color="dark" />}
                        {module.type === 'image' && (
                          <CIcon icon={cilImage} size="sm" color="dark" />
                        )}
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
      </CCol>
    </CRow>
  )
}
