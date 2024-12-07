'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useGetModules } from '@/hooks/useGetModules'
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
  const { courseId } = params as { courseId: string }
  const { courseModules, fetchingModules } = useGetModules({ courseId })
  const [deletingModule, setDeletingModule] = useState(false)
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false)

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

  if (fetchingModules) {
    return <Loading />
  }

  return (
    <CContainer className="mt-4">
      <CCol>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <CButton
            color="primary"
            as="a"
            href={`/managed-courses/${courseId}/modules/create`}
            className="fw-semibold"
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
            {courseModules.length > 0 ? (
              courseModules.map((module) => (
                <CTableRow key={module.id} align="middle">
                  <CTableDataCell>
                    <Link href={`/managed-courses/${courseId}/modules/${module.id}`}>
                      {module.id}
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link
                      href={`/managed-courses/${courseId}/modules/${module.id}`}
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
                          href={`/managed-courses/${courseId}/modules/${module.id}/edit`}
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
    </CContainer>
  )
}
