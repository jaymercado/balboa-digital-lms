'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { CCardText, CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react-pro'
import { useGetCourseModule } from '@/hooks/useGetCourseModules'
import { Loading, CourseModuleContent } from '@/components'

export default function Module({ moduleId }: { moduleId: string }) {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { fetchingModule, courseModule } = useGetCourseModule({
    courseId,
    moduleId,
  })

  if (fetchingModule) {
    return <Loading />
  }

  if (!courseModule) {
    // TODO: Handle this error
    return <p>Module not found</p>
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
          <CourseModuleContent type={courseModule.type} content={courseModule.content} />
        </CTabPanel>
        <CTabPanel className="py-3" aria-labelledby="description-tab-pane" itemKey={2}>
          <CCardText>{courseModule.description}</CCardText>
        </CTabPanel>
      </CTabContent>
    </CTabs>
  )
}
