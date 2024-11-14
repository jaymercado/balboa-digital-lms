'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetModules from '@/hooks/useGetModules'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'
import {
  CButton,
  CContainer,
  CCol,
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
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

export default function Modules() {
  const params = useParams()
  const router = useRouter()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const { courseModules, fetchingModules } = useGetModules({ courseId, moduleId })
  const [deletingModule, setDeletingModule] = useState(false)
  const [visible, setVisible] = useState(false)

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then(() => {
        toast('success', 'Module deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingModule(false))
  }

  if (fetchingCourses) {
    return <Loading />
  }

  return (
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
                          onClick={() => setVisible(!visible)}
                          disabled={deletingModule}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          <small>Delete</small>
                        </CDropdownItem>
                        <ConfirmDeleteModal
                          visible={visible}
                          onClose={() => setVisible(false)}
                          onConfirm={() => [deleteModule(module.id), setVisible(false)]}
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
    </CContainer>
  )
}
