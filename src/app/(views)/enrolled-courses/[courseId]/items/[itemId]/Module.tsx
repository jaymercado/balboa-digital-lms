'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CCardText, CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react-pro'
import { useGetCourseModule } from '@/hooks/useGetCourseModules'
import { Loading, CourseModuleContent } from '@/components'

export default function Module({ moduleId, itemId }: { moduleId: string; itemId: string }) {
  const params = useParams()
  const router = useRouter()
  const { courseId } = params as { courseId: string }
  const { fetchingModule, courseModule, courseModuleNotFound } = useGetCourseModule({
    courseId,
    moduleId,
  })

  useEffect(() => {
    if (courseModule) {
      axios.post(`/api/courses/${courseId}/userCourseItemLogs`, {
        courseItemId: itemId,
        courseId,
      })
    }
  }, [courseModule, courseId, itemId])


  useEffect(() => {
    if (!fetchingModule && courseModuleNotFound) {
      router.replace('/404')
    }
  }, [fetchingModule, courseModule, router])

  if (fetchingModule) {
    return <Loading />
  }

  if (courseModuleNotFound) {
    return null
  }

  return (
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
          <CourseModuleContent type={courseModule?.type || 'text'} content={courseModule?.content || ''} />
        </CTabPanel>
        <CTabPanel className="py-3" aria-labelledby="description-tab-pane" itemKey={2}>
          <CCardText>{courseModule?.description}</CCardText>
        </CTabPanel>
      </CTabContent>
    </CTabs>
  )
}
