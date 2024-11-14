'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useGetModules from '@/hooks/useGetModules'
import { Loading } from '@/components'
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
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { courseModules, fetchingModules } = useGetModules({ courseId, moduleId })
  const courseModule = courseModules[0]

  if (fetchingModules || !courseModule) {
    return <Loading />
  }

  const currentModuleIndex = courseModules.findIndex(module => module.id === moduleId)

  const previousModule = courseModules[currentModuleIndex - 1]
  const nextModule = courseModules[currentModuleIndex + 1]

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CCol>
              <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {courseModule.title}
              </CCardTitle>
            </CCol>
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
                  {courseModule.content === '<p><br></p>' ? (
                    <CCardText>This module has no content</CCardText>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: courseModule.content }}></div>
                  )}
                </CTabPanel>
                <CTabPanel className="py-3" aria-labelledby="description-tab-pane" itemKey={2}>
                  <CCardText>{courseModule.description}</CCardText>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>

      <CRow className="mt-1">
        <CCol className="d-flex justify-content-start">
          {previousModule && (
            <CButton
              color="primary"
              shape="rounded-pill"
              onClick={() => router.push(`/enrolled-courses/${courseId}/modules/${previousModule.id}`)}
              className="px-4 py-2 mb-3"
            >
              Back
            </CButton>
          )}
        </CCol>

        <CCol className="d-flex justify-content-end">
          {nextModule && (
            <CButton
              color="primary"
              shape="rounded-pill"
              onClick={() => router.push(`/enrolled-courses/${courseId}/modules/${nextModule.id}`)}
              className="px-4 py-2 mb-3"
            >
              Next Module
            </CButton>
          )}
        </CCol>
      </CRow>
    </CRow>
  )
}
