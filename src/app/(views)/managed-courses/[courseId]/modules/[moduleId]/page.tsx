'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CCardText,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import { useGetCourseModule } from '@/hooks/useGetCourseModules'
import { Loading, CourseModuleContent, ConfirmDeleteModal } from '@/components'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const {
    fetchingModule,
    courseModule,
    nextCourseModuleId,
    previousCourseModuleId,
    courseModuleNotFound,
  } = useGetCourseModule({
    courseId,
    moduleId,
  })
  const [deletingModule, setDeletingModule] = useState(false)
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false)

  useEffect(() => {
    if (!fetchingModule && courseModuleNotFound) {
      router.replace('/404')
    }
  }, [fetchingModule, courseModule, router])

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
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

  if (fetchingModule) {
    return <Loading />
  }

  if (courseModuleNotFound) {
    return null
  }
  return (
    <CRow>
      <CCol>
        <div className="text-end mb-2">
          <CButton
            color="secondary"
            className="me-2"
            href={`/managed-courses/${courseId}/modules/${moduleId}/edit`}
          >
            <CIcon icon={cilPencil} size="sm" /> Edit
          </CButton>
          <CButton
            color="danger"
            onClick={() => setShowDeleteModuleModal((prevState) => !prevState)}
            className="text-light"
          >
            <CIcon icon={cilTrash} className="text-white" /> Delete
          </CButton>
          <ConfirmDeleteModal
            visible={showDeleteModuleModal}
            onClose={() => setShowDeleteModuleModal(false)}
            onConfirm={() => [
              deleteModule(courseModule?.id || ''),
              setShowDeleteModuleModal(false),
            ]}
            disabled={deletingModule}
          />
        </div>
        <CCard className="mb-4">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center py-2">
              <CButton
                color="light"
                onClick={() =>
                  router.push(`/managed-courses/${courseId}/modules/${previousCourseModuleId}`)
                }
                disabled={!previousCourseModuleId}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </CButton>
              <div className="fw-semibold fs-4 align-items-center">{courseModule?.title}</div>
              <CButton
                color="light"
                onClick={() =>
                  router.push(`/managed-courses/${courseId}/modules/${nextCourseModuleId}`)
                }
                disabled={!nextCourseModuleId}
              >
                Next
                <i className="bi bi-chevron-right ms-1"></i>
              </CButton>
            </div>
            <CTabs activeItemKey={1}>
              <CTabList variant="underline-border">
                <CTab aria-controls="content-tab-pane" itemKey={1}>
                  <small>Module Content</small>
                </CTab>
                <CTab aria-controls="description-tab-pane" itemKey={2}>
                  <small>Description</small>
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="py-3" aria-labelledby="content-tab-pane" itemKey={1}>
                  <CourseModuleContent
                    type={courseModule?.type || 'text'}
                    content={courseModule?.content || ''}
                  />
                </CTabPanel>
                <CTabPanel className="py-3" aria-labelledby="description-tab-pane" itemKey={2}>
                  <CCardText>{courseModule?.description}</CCardText>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
