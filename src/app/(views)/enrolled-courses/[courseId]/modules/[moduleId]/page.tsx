/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
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
import CourseModuleContent from '@/components/CourseModuleContent'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { courseModules, prevCourseId, nextCourseId, fetchingModules } = useGetModules({
    courseId,
    moduleId,
  })
  const courseModule = courseModules?.[0]

  if (fetchingModules || !courseModule) {
    return <Loading />
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center py-2">
              <CButton
                color="light"
                onClick={() => router.push(`/enrolled-courses/${courseId}/modules/${prevCourseId}`)}
                disabled={!prevCourseId}
              >
                <span className="d-block d-sm-none">Prev</span>
                <span className="d-none d-sm-block">Prev Module</span>
              </CButton>
              <div className="fw-semibold fs-4 align-items-center">{courseModule.title}</div>
              <CButton
                color="light"
                onClick={() => router.push(`/enrolled-courses/${courseId}/modules/${nextCourseId}`)}
                disabled={!nextCourseId}
              >
                <span className="d-block d-sm-none">Next</span>
                <span className="d-none d-sm-block">Next Module</span>
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
