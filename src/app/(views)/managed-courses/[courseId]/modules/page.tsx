'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CButton,
  CContainer,
  CRow,
  CCol,
  CCardText,
  CTableHead,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilVideo, cilImage, cilFile, cilNotes } from '@coreui/icons'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  const { courses, fetchingCourses } = useGetCourses({ courseId })

  if (fetchingCourses) {
    return <Loading />
  }

  return (
    <>
      {/* <table>
      <thead>
        <tr>
          <th colSpan={3}>
            <Link href={`/managed-courses/${courses[0]?.id}/modules/create`}>Create Module</Link>
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses[0]?.modules.map((module) => (
          <tr key={module.id}>
            <td>
              <Link href={`/managed-courses/${courses[0]?.id}/modules/${module.id}`}>
                {module.id}
              </Link>
            </td>
            <td>{module.title}</td>
            <td>{module.type}</td>
            <td>
              <Link href={`/managed-courses/${courses[0]?.id}/modules/${module.id}/edit`}>
                Edit
              </Link>
              <button type="button" onClick={() => {}}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table> */}
      <CContainer className="mt-4">
        <CCol>
          <div className="d-flex justify-content-end align-items-center mb-4">
            <CButton
              color="dark"
              className="text-white"
              as="a"
              href={`/managed-courses/${courses[0]?.id}/modules/create`}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Create Module
            </CButton>
          </div>

          <>
            <CTable striped>
              <CTableHead>
                <CTableRow className="text-secondary">
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
                  <CTableRow key={module.id}>
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
          </>
        </CCol>
      </CContainer>
    </>
  )
}
