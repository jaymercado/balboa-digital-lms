'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CRow,
  CCol,
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilPlus,
  cilPenAlt,
  cilPeople,
  cilFile,
  cilNotes,
  cilVideo,
  cilImage,
} from '@coreui/icons'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

export default function Course() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, setCourses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [deletingModule, setDeletingModule] = useState(false)
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false)
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false)

  function deleteCourse(courseId: string) {
    setDeletingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Course deleted successfully')
        router.push('/managed-courses')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(false))
  }

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setCourses((state) =>
          state.map((course) => ({
            ...course,
            modules: course.modules.filter((module) => module.id !== moduleId),
          })),
        )
        toast('success', 'Module deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingModule(false))
  }

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
              <CCol xs="auto">
                <CButton color="light" className="me-2" href={`/managed-courses/${course.id}/edit`}>
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
        <CRow className="mb-3">
          <CCol>
            <div className="fs-4 fw-bold">Modules</div>
            <Link
              href={`/managed-courses/${course.id}/modules`}
              className="me-2 text-decoration-none"
            >
              <small className="text-secondary d-none d-sm-inline">View All Modules</small>
              <small className="text-secondary d-inline d-sm-none">View All</small>
              <i className="bi bi-chevron-right text-secondary"></i>
            </Link>
          </CCol>

          <CCol xs="auto">
            <CButton as="a" color="dark" href={`/managed-courses/${course.id}/modules/create`}>
              <CIcon icon={cilPlus} size="sm" className="me-2" />
              <small className="d-none d-sm-inline">Create Module</small>
              <small className="d-inline d-sm-none">Create</small>
            </CButton>
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
              <CTableHeaderCell>
                <small>Actions</small>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {courses[0]?.modules.length > 0 ? (
              courses[0]?.modules.map((module) => (
                <CTableRow key={module.id} align="middle">
                  <CTableDataCell>
                    <Link href={`/managed-courses/${courses[0]?.id}/modules/${module.id}`}>
                      {module.id}
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link
                      href={`/managed-courses/${courses[0]?.id}/modules/${module.id}`}
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
                  <CTableDataCell>
                    <CDropdown>
                      <CDropdownToggle className="rounded" caret={false}>
                        <i className="bi bi-three-dots-vertical"></i>
                      </CDropdownToggle>
                      <CDropdownMenu className="secondary">
                        <CDropdownItem
                          href={`/managed-courses/${courses[0]?.id}/modules/${module.id}/edit`}
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          <small>Edit</small>
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() => setShowDeleteModuleModal((prevState) => !prevState)}
                          disabled={deletingModule}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          <small>Delete</small>
                        </CDropdownItem>
                        <ConfirmDeleteModal
                          visible={showDeleteModuleModal}
                          onClose={() => setShowDeleteModuleModal(false)}
                          onConfirm={() => [
                            deleteModule(module.id),
                            setShowDeleteModuleModal(false),
                          ]}
                          disabled={deletingModule}
                        />
                      </CDropdownMenu>
                    </CDropdown>
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
      </CCol>
    </CRow>
  )
}
