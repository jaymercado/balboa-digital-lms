/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CButton,
  CCardText,
  CFormCheck,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { Loading } from '@/components'

export default function Quiz() {
  const router = useRouter()
  const params = useParams()
  const { courseId, quizId } = params as { courseId: string; quizId: string }
  const { fetchingQuiz, courseQuiz, nextQuizId, previousQuizId } = useGetQuiz({
    courseId,
    quizId,
  })
  const [answers, setAnswers] = useState<any[]>([])
  const [latestSubmission, setLatestSubmission] = useState<any>(null)

  function submitQuiz() {
    axios
      .post(`/api/quizSubmissions`, {
        quizId,
        answers: answers.map(({ questionId, answers }) => ({
          questionId,
          answers,
        })),
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Error submitting quiz')
        }
        toast('success', 'Quiz submitted successfully')
        router.push(`/enrolled-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error submitting quiz')
      })
  }

  useEffect(() => {
    function getLatestSubmission() {
      axios
        .get(`/api/quizSubmissions?quizId=${quizId}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('Error getting latest submission')
          }
          setLatestSubmission(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    getLatestSubmission()
  }, [quizId])

  useEffect(() => {
    if (courseQuiz?.questions) {
      setAnswers(
        courseQuiz?.questions?.map((question, index) => ({
          questionId: question.id,
          answers: [],
          question: question.question,
          options: question.options,
          onDisplay: index === 0,
        })) || [],
      )
    }
  }, [courseQuiz?.questions])

  if (fetchingQuiz) {
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
                      router.push(`/managed-courses/${courseId}/quizzes/${previousQuizId}`)
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
                    onClick={() =>
                      router.push(`/managed-courses/${courseId}/quizzes/${nextQuizId}`)
                    }
                    className="mb-2"
                  >
                    Next
                  </CButton>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol>
                <CCardTitle className="fw-semibold fs-4">{courseQuiz.title}</CCardTitle>
                <CCardText className="text-secondary">{courseQuiz.description}</CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <div className="mt-4">
                  {answers?.length === 0 ? <p>No questions found.</p> : ''}
                  {answers?.map(({ question, onDisplay, options }, index) =>
                    onDisplay ? (
                      <div key={index} className="mb-4">
                        {index > 0 && (
                          <CButton
                            onClick={() =>
                              setAnswers(
                                answers.map((answer, idx) => ({
                                  ...answer,
                                  onDisplay: idx === index - 1,
                                })),
                              )
                            }
                          >
                            Previous
                          </CButton>
                        )}
                        {index < answers.length - 1 && (
                          <CButton
                            onClick={() =>
                              setAnswers(
                                answers.map((answer, idx) => ({
                                  ...answer,
                                  onDisplay: idx === index + 1,
                                })),
                              )
                            }
                          >
                            Next
                          </CButton>
                        )}
                        {index === answers.length - 1 && (
                          <CButton onClick={submitQuiz}>Submit</CButton>
                        )}
                        <div className="fw-semibold fs-5 text-primary">{`Question ${
                          index + 1
                        }`}</div>
                        <div className="fs-6 mb-2">{question}</div>
                        <strong className="mt-2">Choices:</strong>
                        {options.map((option: any, idx: any) => (
                          <div key={idx}>
                            <CFormCheck
                              checked={answers[index].answers.includes(option.id)}
                              onChange={(e) => {
                                const answerIsChecked = e.target.checked
                                setAnswers((state) => {
                                  const newState = [...state]
                                  const currentAnswers = [...newState[index].answers]
                                  const answerExists = currentAnswers.includes(option.id)
                                  if (answerIsChecked && !answerExists) {
                                    newState[index].answers = [...currentAnswers, option.id]
                                  }
                                  if (!answerIsChecked && answerExists) {
                                    newState[index].answers = currentAnswers.filter(
                                      (a) => a !== option.id,
                                    )
                                  }
                                  return newState
                                })
                              }}
                            />
                            {option.option}
                          </div>
                        ))}
                      </div>
                    ) : null,
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
