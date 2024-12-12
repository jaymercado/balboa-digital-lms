/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetModule } from '@/hooks/useGetModules'
import toast from '@/utils/toast'
import { Loading } from '@/components'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CButton,
  CCardText,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react-pro'
import CourseModuleContent from '@/components/CourseModuleContent'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { fetchingModule, courseModule, nextCourseId, previousCourseId } = useGetModule({
    courseId,
    moduleId,
  })
  const [deletingModule, setDeletingModule] = useState(false)
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false)

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

  if (!courseModule) {
    // TODO: Handle error
    return <p>Error loading module</p>
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              {previousCourseId && (
                <CCol xs="auto">
                  <CButton
                    color="light"
                    onClick={() =>
                      router.push(`/managed-courses/${courseId}/modules/${previousCourseId}`)
                    }
                    className="mb-2"
                  >
                    Previous
                  </CButton>
                </CCol>
              )}
              {nextCourseId && (
                <CCol xs="auto">
                  <CButton
                    color="light"
                    onClick={() =>
                      router.push(`/managed-courses/${courseId}/modules/${nextCourseId}`)
                    }
                    className="mb-2"
                  >
                    Next
                  </CButton>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol>
                <CCardTitle className="fw-semibold fs-4">{courseModule.title}</CCardTitle>
              </CCol>
              <CCol xs="auto">
                <CButton
                  color="light"
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
              </CCol>
            </CRow>
            <ConfirmDeleteModal
              visible={showDeleteModuleModal}
              onClose={() => setShowDeleteModuleModal(false)}
              onConfirm={() => [deleteModule(courseModule.id), setShowDeleteModuleModal(false)]}
              disabled={deletingModule}
            />
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
                  <CourseModuleContent type={courseModule.type} content={courseModule.content} />
                </CTabPanel>
                <CTabPanel className="py-3" aria-labelledby="description-tab-pane" itemKey={2}>
                  <CCardText>{courseModule.description}</CCardText>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}