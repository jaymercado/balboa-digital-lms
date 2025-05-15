'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CButton, CCardText } from '@coreui/react-pro'
import toast from '@/utils/toast'
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { Loading, ConfirmDeleteModal } from '@/components'

export default function Quiz() {
  const router = useRouter()
  const params = useParams()
  const { courseId, quizId } = params as { courseId: string; quizId: string }
  const { fetchingQuiz, courseQuiz, nextQuizId, previousQuizId, quizNotFound } = useGetQuiz({
    courseId,
    quizId,
  })
  const [deletingQuiz, setDeletingQuiz] = useState(false)
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false)

  useEffect(() => {
    if (!fetchingQuiz && quizNotFound) {
      router.replace('/404')
    }
  }, [fetchingQuiz, quizNotFound, router])

  function deleteQuiz(quizId: string) {
    setDeletingQuiz(true)
    fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Quiz deleted successfully')
        router.push(`/all-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting quiz')
      })
      .finally(() => setDeletingQuiz(false))
  }

  if (fetchingQuiz) {
    return <Loading />
  }

  if (quizNotFound) {
    return <p>Error loading quiz</p>
  }

  return (
    <CRow>
      <CCol>
        <div className="text-end mb-2">
          <CButton
            color="secondary"
            className="me-2"
            href={`/managed-courses/${courseId}/quizzes/${quizId}/edit`}
          >
            <CIcon icon={cilPencil} size="sm" /> Edit
          </CButton>
          <CButton
            color="danger"
            onClick={() => setShowDeleteQuizModal((prevState) => !prevState)}
            className="text-light"
          >
            <CIcon icon={cilTrash} className="text-white" /> Delete
          </CButton>
          <ConfirmDeleteModal
            visible={showDeleteQuizModal}
            onClose={() => setShowDeleteQuizModal(false)}
            onConfirm={() => [deleteQuiz(quizId), setShowDeleteQuizModal(false)]}
            disabled={deletingQuiz}
          />
        </div>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <div className="d-flex justify-content-between align-items-center py-2">
                <CButton
                  color="light"
                  onClick={() => router.push(`/all-courses/${courseId}/quizzes/${previousQuizId}`)}
                  className="mb-2"
                  disabled={!previousQuizId}
                >
                  Previous
                </CButton>
                <div className="fw-semibold fs-4 align-items-center">{courseQuiz?.title}</div>
                <CButton
                  color="light"
                  onClick={() => router.push(`/all-courses/${courseId}/quizzes/${nextQuizId}`)}
                  className="mb-2"
                  disabled={!nextQuizId}
                >
                  Next
                </CButton>
              </div>
            </CRow>
            <CRow>
              <CCol>
                <CCardTitle className="fw-semibold fs-4">{courseQuiz?.title}</CCardTitle>
                <CCardText className="text-secondary">{courseQuiz?.description}</CCardText>
                <CCardText className="text-secondary">
                  {courseQuiz?.numQuestions} question(s) will be used.
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <div className="mt-4">
                  {courseQuiz?.questions.length === 0 ? (
                    <p>No questions added</p>
                  ) : (
                    courseQuiz?.questions.map((question, index) => (
                      <div key={index} className="mb-4">
                        <div className="fw-semibold fs-5 text-primary">{`Question ${
                          index + 1
                        }`}</div>
                        <div className="fs-6 mb-2">{question.question}</div>

                        <strong className="mt-2">Choices:</strong>
                        {question.options.map((option, idx) => (
                          <div className="text-capitalize mb-2" key={idx}>
                            {option.option}
                          </div>
                        ))}

                        <div className="mt-2">
                          <span className="fw-semibold">Correct Answer: </span>
                          {question.options
                            .filter((option) => option.isCorrect)
                            .map((option, idx) => (
                              <span key={idx} className="text-capitalize mb-2">
                                {option.option}
                                {idx === question.options.length - 1 ? '' : ', '}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
