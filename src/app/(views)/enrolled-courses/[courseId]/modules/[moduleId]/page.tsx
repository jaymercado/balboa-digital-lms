/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetModule } from '@/hooks/useGetModules'
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
import CourseModuleContent from '@/components/CourseModuleContent'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { fetchingModule, courseModule, nextCourseId, previousCourseId } = useGetModule({
    courseId,
    moduleId,
  })

  if (fetchingModule || !courseModule) {
    return <Loading />
  }

  if (!courseModule) {
    // TODO: Handle this error
    return <p>Module not found</p>
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center py-2">
              <CButton
                color="light"
                onClick={() =>
                  router.push(`/enrolled-courses/${courseId}/modules/${previousCourseId}}`)
                }
                disabled={!previousCourseId}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </CButton>
              <div className="fw-semibold fs-4 align-items-center">{courseModule.title}</div>
              <CButton
                color="light"
                onClick={() => router.push(`/enrolled-courses/${courseId}/modules/${nextCourseId}`)}
                disabled={!nextCourseId}
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
