'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CRow, CCol, CCard, CCardBody, CButton } from '@coreui/react-pro'
import { useGetCourseItem } from '@/hooks/useGetCourseItems'
import { Loading } from '@/components'
import Module from './Module'
import Quiz from './Quiz'

export default function Item() {
  const router = useRouter()
  const params = useParams()
  const { courseId, itemId } = params as { courseId: string; itemId: string }
  const { fetchingCourseItem, courseItem, nextCourseItemId, previousCourseItemId } =
    useGetCourseItem({
      courseId,
      itemId,
    })

  if (fetchingCourseItem) {
    return <Loading />
  }

  if (!courseItem) {
    // TODO: Handle this error
    return <p>Item not found</p>
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
                  router.push(`/enrolled-courses/${courseId}/items/${previousCourseItemId}`)
                }
                disabled={!previousCourseItemId}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </CButton>
              {courseItem.moduleId && (
                <div className="fw-semibold fs-4 align-items-center">
                  {courseItem.modules.title}
                </div>
              )}
              {courseItem.quizId && (
                <div className="fw-semibold fs-4 align-items-center">
                  {courseItem.quizzes.title}
                </div>
              )}
              <CButton
                color="light"
                onClick={() =>
                  router.push(`/enrolled-courses/${courseId}/items/${nextCourseItemId}`)
                }
                disabled={!nextCourseItemId}
              >
                Next
                <i className="bi bi-chevron-right ms-1"></i>
              </CButton>
            </div>
            {courseItem.moduleId && <Module moduleId={courseItem.moduleId} itemId={itemId} />}
            {courseItem.quizId && <Quiz quizId={courseItem.quizId} itemId={itemId} />}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
