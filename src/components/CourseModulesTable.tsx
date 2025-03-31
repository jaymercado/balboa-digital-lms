'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
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
import { cilPencil, cilTrash, cilFile, cilNotes, cilVideo, cilImage } from '@coreui/icons'
import toast from '@/utils/toast'
import { useGetCourseModules } from '@/hooks/useGetCourseModules'
import { Loading, ConfirmDeleteModal } from '@/components'

interface CourseModulesTableProps {
  courseId: string
  userIsAdmin?: boolean
  userIsInstructor?: boolean
}

export default function CourseModulesTable({
  courseId,
  userIsAdmin = false,
  userIsInstructor = false,
}: CourseModulesTableProps) {
  const router = useRouter()
  const { courseModules, fetchingModules, setCourseModules, courseModulesNotFound } =
    useGetCourseModules({ courseId })
  const [deletingModule, setDeletingModule] = useState(false)
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false)

  const canManageModules = userIsAdmin || userIsInstructor

  useEffect(() => {
    if (!fetchingModules && courseModulesNotFound) {
      router.replace('/404')
    }
  }, [fetchingModules, courseModulesNotFound])

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setCourseModules((modules) => modules.filter((module) => module.id !== moduleId))
        toast('success', 'Module deleted successfully')
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

  if (courseModulesNotFound) {
    return null
  }

  return (
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
          {canManageModules && (
            <CTableHeaderCell>
              <small>Actions</small>
            </CTableHeaderCell>
          )}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {courseModules.length > 0 ? (
          courseModules.map((module) => (
            <CTableRow key={module.id} align="middle">
              <CTableDataCell>
                <Link
                  href={`${
                    userIsAdmin
                      ? '/all-courses'
                      : userIsInstructor
                      ? '/managed-courses'
                      : '/enrolled-courses'
                  }/${courseId}/modules/${module.id}`}
                  className="text-decoration-none"
                >
                  <span className="fw-semibold">{module.id}</span>
                </Link>
              </CTableDataCell>
              <CTableDataCell>
                <span className="fw-semibold">{module.title}</span>
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
              {canManageModules && (
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle className="rounded" caret={false}>
                      <i className="bi bi-three-dots-vertical"></i>
                    </CDropdownToggle>
                    <CDropdownMenu className="secondary">
                      <CDropdownItem
                        href={`${
                          userIsAdmin
                            ? '/all-courses'
                            : userIsInstructor
                            ? '/managed-courses'
                            : '/enrolled-courses'
                        }/${courseId}/modules/${module.id}/edit`}
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
                        onConfirm={() => [deleteModule(module.id), setShowDeleteModuleModal(false)]}
                        disabled={deletingModule}
                      />
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              )}
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
  )
}
