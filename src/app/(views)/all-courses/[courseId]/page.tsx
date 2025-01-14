'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilPenAlt, cilPeople } from '@coreui/icons'
import toast from '@/utils/toast'
import { useGetCourse } from '@/hooks/useGetCourses'
import { Loading, CourseModulesTable, CourseQuizzesTable, ConfirmDeleteModal } from '@/components'

export default function Course() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { course, fetchingCourse } = useGetCourse({ courseId })
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false)

  function deleteCourse(courseId: string) {
    setDeletingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Course deleted successfully')
        router.push('/all-courses')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(false))
  }

  if (fetchingCourse) {
    return <Loading />
  }

  // TODO: Add a 404 page
  if (!course) {
    return <div>Course not found</div>
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
              <CCol xs="auto">
                <CButton color="light" className="me-2" href={`/all-courses/${course.id}/edit`}>
                  <CIcon icon={cilPencil} size="sm" /> Edit
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => setShowDeleteCourseModal((prevState) => !prevState)}
                  className="text-light"
                >
                  <CIcon icon={cilTrash} className="text-white" /> Delete
                </CButton>
              </CCol>
            </CRow>
            <ConfirmDeleteModal
              visible={showDeleteCourseModal}
              onClose={() => setShowDeleteCourseModal(false)}
              onConfirm={() => [deleteCourse(course.id), setShowDeleteCourseModal(false)]}
              disabled={deletingCourse}
            />
            <CCardText className="text-secondary">{course.description}</CCardText>
            <CCardText>
              <CIcon icon={cilPeople} size="sm" className="me-2" />
              <strong>Enrollees:</strong>{' '}
              {course.enrollees.map((enrollee, index) => (
                <span key={enrollee?.id}>
                  {enrollee?.name} {index < course.enrollees.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
            <CCardText>
              <CIcon icon={cilPenAlt} size="sm" className="me-2" />
              <strong>Instructors:</strong>{' '}
              {course.instructors.map((instructor, index) => (
                <span key={instructor?.id}>
                  {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
            <CCardText>
              <strong>Items:</strong>
              <ul>
                {course.courseItems.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </CCardText>
          </CCardBody>
        </CCard>

        <CRow className="mb-3">
          <CCol>
            <CRow className="mb-3">
              <CCol>
                <div className="fs-4 fw-bold">Modules</div>
                <Link
                  href={`/all-courses/${course.id}/modules`}
                  className="me-2 text-decoration-none"
                >
                  <small className="text-secondary d-none d-sm-inline">View All Modules</small>
                  <small className="text-secondary d-inline d-sm-none">View All</small>
                  <i className="bi bi-chevron-right text-secondary"></i>
                </Link>
              </CCol>

              <CCol xs="auto">
                <CButton
                  as="a"
                  color="primary"
                  href={`/all-courses/${course.id}/modules/create`}
                  className="fw-semibold"
                >
                  <CIcon icon={cilPlus} size="sm" className="me-2" />
                  <small className="d-none d-sm-inline">Create Module</small>
                  <small className="d-inline d-sm-none">Create</small>
                </CButton>
              </CCol>
            </CRow>
            <CourseModulesTable courseId={course.id} />
          </CCol>
          <CCol>
            <CRow className="mb-3">
              <CCol>
                <div className="fs-4 fw-bold">Quizzes</div>
                <Link
                  href={`/all-courses/${course.id}/quizzes`}
                  className="me-2 text-decoration-none"
                >
                  <small className="text-secondary d-none d-sm-inline">View All Quizzes</small>
                  <small className="text-secondary d-inline d-sm-none">View All</small>
                  <i className="bi bi-chevron-right text-secondary"></i>
                </Link>
              </CCol>

              <CCol xs="auto">
                <CButton
                  as="a"
                  color="primary"
                  href={`/all-courses/${course.id}/quizzes/create`}
                  className="fw-semibold"
                >
                  <CIcon icon={cilPlus} size="sm" className="me-2" />
                  <small className="d-none d-sm-inline">Create Quiz</small>
                  <small className="d-inline d-sm-none">Create</small>
                </CButton>
              </CCol>
            </CRow>
            <CourseQuizzesTable courseId={course.id} />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}
