'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CButton, CCardText } from '@coreui/react-pro'
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { useGetLatestQuizSubmission } from '@/hooks/useGetQuizSubmissions'
import { Loading } from '@/components'
import QuizComponent from './Quiz'
import Submission from './Submission'

export default function Quiz({ quizId, itemId }: { quizId: string; itemId: string }) {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { fetchingQuiz, courseQuiz, nextQuizId, previousQuizId } = useGetQuiz({
    courseId,
    quizId,
  })
  const { fetchingSubmissions, latestSubmission } = useGetLatestQuizSubmission({
    quizId,
  })
  const [retakeQuiz, setRetakeQuiz] = useState(false)

  useEffect(() => {
    if (courseQuiz) {
      axios.post(`/api/courses/${courseId}/userCourseItemLogs`, {
        courseItemId: itemId,
        courseId,
      })
    }
  }, [courseQuiz, courseId, itemId])

  if (fetchingQuiz || fetchingSubmissions) {
    return <Loading />
  }

  if (!courseQuiz) {
    // TODO: Handle error
    return <p>Error loading quiz</p>
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              {previousQuizId && (
                <CCol xs="auto">
                  <CButton
                    color="light"
                    onClick={() =>
                      router.push(`/enrolled-courses/${courseId}/quizzes/${previousQuizId}`)
                    }
                    className="mb-2"
                  >
                    Previous
                  </CButton>
                </CCol>
              )}
              {nextQuizId && (
                <CCol xs="auto">
                  <CButton
                    color="light"
                    className="mb-2"
                    onClick={() =>
                      router.push(`/enrolled-courses/${courseId}/quizzes/${nextQuizId}`)
                    }
                  >
                    Next
                  </CButton>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol>
                {latestSubmission && !retakeQuiz && (
                  <CCardTitle className="fw-semibold fs-4">
                    {courseQuiz.title}{' '}
                    <CButton color="light" className="mb-2" onClick={() => setRetakeQuiz(true)}>
                      Retake
                    </CButton>
                  </CCardTitle>
                )}

                <CCardText className="text-secondary">{courseQuiz.description}</CCardText>
              </CCol>
            </CRow>
            {latestSubmission && !retakeQuiz ? (
              <Submission
                fetchingSubmissions={fetchingSubmissions}
                courseQuiz={courseQuiz}
                latestSubmission={latestSubmission}
              />
            ) : (
              <QuizComponent fetchingQuiz={fetchingQuiz} courseQuiz={courseQuiz} quizId={quizId} />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
