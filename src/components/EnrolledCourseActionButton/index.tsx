'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CButton } from '@coreui/react-pro'
import { useGetUserCourseItemLogs } from '@/hooks/useGetUserCourseItemLogs'
import { useGetCourseItems } from '@/hooks/useGetCourseItems'
export default function EnrolledCourseActionButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const { userCourseItemLogs, fetchingUserCourseItemLogs } = useGetUserCourseItemLogs({
    courseId,
  })
  const { courseItems, fetchingCourseItems } = useGetCourseItems({ courseId })

  let actionText = ''
  if (fetchingUserCourseItemLogs || fetchingCourseItems) {
    actionText = 'Loading...'
  } else if (userCourseItemLogs.length > 0) {
    actionText = 'Resume'
  } else {
    actionText = 'Start'
  }

  const handleClick = () => {
    if (fetchingUserCourseItemLogs) return
    if (userCourseItemLogs.length > 0) {
      router.push(
        `/enrolled-courses/${courseId}/items/${
          userCourseItemLogs[userCourseItemLogs.length - 1].courseItemId
        }`,
      )
    } else {
      router.push(`/enrolled-courses/${courseId}/items/${courseItems[0].id}`)
    }
  }

  if (!fetchingCourseItems && courseItems.length === 0) {
    return null
  }

  return (
    <CButton
      color="primary"
      shape="rounded-pill"
      disabled={fetchingUserCourseItemLogs}
      onClick={handleClick}
    >
      {actionText}
    </CButton>
  )
}
