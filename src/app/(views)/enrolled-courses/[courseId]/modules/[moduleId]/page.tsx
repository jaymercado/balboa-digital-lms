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
    </CRow>
  )
}
  //   <div>
  //     <section>
  //       <p>ID: {courseModule.id}</p>
  //       <p>Title: {courseModule.title}</p>
  //       <p>Description: {courseModule.description}</p>
  //       <p>Type: {courseModule.type}</p>
  //       <p>
  //         <strong>Content:</strong>
  //       </p>
  //       <p dangerouslySetInnerHTML={{ __html: courseModule.content }} />
  //     </section>
  //   </div>
  // )