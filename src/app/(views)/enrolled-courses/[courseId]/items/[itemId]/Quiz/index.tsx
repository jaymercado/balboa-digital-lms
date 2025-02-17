'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CButton } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { useGetLatestQuizSubmission } from '@/hooks/useGetQuizSubmissions'
import { Loading } from '@/components'
import QuizComponent from './Quiz'
import Submission from './Submission'

export default function Quiz({ quizId, itemId }: { quizId: string; itemId: string }) {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { fetchingQuiz, courseQuiz, nextQuizId, previousQuizId, quizNotFound } = useGetQuiz({
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

  useEffect(() => {
    if (!fetchingQuiz && quizNotFound) {
      router.replace('/404')
    }
  }, [fetchingQuiz, quizNotFound, router])

  if (fetchingQuiz || fetchingSubmissions) {
    return <Loading />
  }

  if (quizNotFound) {
    return null
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol>
                {latestSubmission && !retakeQuiz && (
                  <CCardTitle className="fw-semibold fs-4">
                    <span className="me-2">{courseQuiz?.title}</span>
                    <CButton
                      color="primary"
                      className="mb-2 text-white"
                      onClick={() => setRetakeQuiz(true)}
                    >
                      Retake
                      <CIcon className="ms-2" icon={cilReload} />
                    </CButton>
                  </CCardTitle>
                )}
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
