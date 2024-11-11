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
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CCardImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
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
  cilChevronRight,
  cilFile,
  cilNotes,
  cilVideo,
  cilImage,
} from '@coreui/icons'

export default function Course() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, setCourses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [deletingModule, setDeletingModule] = useState(false)
  const [visible, setVisible] = useState(false)

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
    // <div>
    //   <Link href={`/managed-courses/${course.id}/edit`}>Edit</Link> /
    //   <button type="button" onClick={() => deleteCourse(course.id)} disabled={deletingCourse}>
    //     Delete
    //   </button>
    //   <p>Course ID: {courseId}</p>
    //   <p>Title: {course.title}</p>
    //   <p>Description: {course.description}</p>
    //   <p>
    //     Enrollees:
    //     {course.enrollees.map((enrollee, index) => (
    //       <span key={enrollee.id}>
    //         {enrollee?.name} {index < course.enrollees.length - 1 ? ', ' : ''}
    //       </span>
    //     ))}
    //   </p>
    //   <p>
    //     Instructors:
    // {course.instructors.map((instructor, index) => (
    //   <span key={instructor.id}>
    //     {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
    //   </span>
    // ))}
    //   </p>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th colSpan={3}>
    //           <Link href={`/managed-courses/${course.id}/modules/create`}>Create Module</Link>
    //         </th>
    //       </tr>
    //       <tr>
    //         <th>ID</th>
    //         <th>Title</th>
    //         <th>Type</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    // {course.modules.map((module) => (
    //   <tr key={module.id}>
    //     <td>
    //       <Link href={`/managed-courses/${course.id}/modules/${module.id}`}>{module.id}</Link>
    //     </td>
    //     <td>{module.title}</td>
    //     <td>{module.type}</td>
    //     <td>
    //       <Link href={`/managed-courses/${course.id}/modules/${module.id}/edit`}>Edit</Link>
    //       <button
    //         type="button"
    //         onClick={() => deleteModule(module.id)}
    //         disabled={deletingModule}
    //       >
    //         {deletingModule ? 'Deleting...' : 'Delete'}
    //       </button>
    //     </td>
    //   </tr>
    // ))}
    //     </tbody>
    //   </table>
    // </div>
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol>
                <CBadge color="primary" shape="rounded-pill" className="text-normal mb-1">
                  Course ID: {courseId}
                </CBadge>
                <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  {course.title}
                </CCardTitle>
                {/* <CCardText>Course ID: {courseId}</CCardText> */}
              </CCol>
              <CCol xs="auto">
                <CButton color="light" className="me-2" href={`/managed-courses/${course.id}/edit`}>
                  <CIcon icon={cilPencil} size="sm" className="" /> Edit
                </CButton>
                <CButton color="danger" onClick={() => setVisible(!visible)} className="text-light">
                  <CIcon icon={cilTrash} className="text-white" /> Delete
                </CButton>
              </CCol>
            </CRow>
            <CModal
              alignment="center"
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="VerticallyCenteredExample"
            >
              <CModalHeader>
                <CModalTitle id="VerticallyCenteredExample">Confirm Deletion</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Are you sure you want to delete this course? This action is permanent and will
                remove all associated modules and content. Once deleted, this course cannot be
                restored.
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => deleteCourse(course.id)}
                  disabled={deletingCourse}
                >
                  {deletingCourse ? (
                    <CSpinner color="light" size="sm" className="" />
                  ) : (
                    <span className="text-light">Delete</span>
                  )}
                </CButton>
              </CModalFooter>
            </CModal>
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
              className="me-2"
              style={{ textDecoration: 'none' }}
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
            {courses[0]?.modules.map((module) => (
              <CTableRow key={module.id} align="middle">
                <CTableDataCell>
                  <Link href={`/managed-courses/${courses[0]?.id}/modules/${module.id}`}>
                    {module.id}
                  </Link>
                </CTableDataCell>
                <CTableDataCell>{module.title}</CTableDataCell>
                <CTableDataCell>
                  {module.type === 'video' && <CIcon icon={cilVideo} size="sm" color="dark" />}
                  {module.type === 'text' && <CIcon icon={cilNotes} size="sm" color="dark" />}
                  {module.type === 'pdf' && <CIcon icon={cilFile} size="sm" color="dark" />}
                  {module.type === 'image' && <CIcon icon={cilImage} size="sm" color="dark" />}
                  <small className="text-secondary ms-1">
                    <span>{module.type}</span>
                  </small>
                </CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle className="rounded" caret={false}>
                      <i className="bi bi-three-dots"></i>
                    </CDropdownToggle>
                    <CDropdownMenu className="secondary">
                      <CDropdownItem
                        href={`/managed-courses/${courses[0]?.id}/modules/${module.id}/edit`}
                      >
                        <CIcon icon={cilPencil} className="me-1" />
                        <small>Edit</small>
                      </CDropdownItem>
                      <CDropdownItem href="#">
                        <CIcon icon={cilTrash} className="me-1" />
                        <small>Delete</small>
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  )
}
