'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CRow, CCol, CButton, CFormCheck } from '@coreui/react-pro'
import toast from '@/utils/toast'
import { Loading } from '@/components'

export default function Quiz({
  fetchingQuiz,
  courseQuiz,
  quizId,
}: {
  fetchingQuiz: boolean
  courseQuiz: any
  quizId: string
}) {
  const [answers, setAnswers] = useState<any[]>([])

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
        window.location.reload()
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error submitting quiz')
      })
  }

  useEffect(() => {
    if (courseQuiz?.questions) {
      setAnswers(
        courseQuiz?.questions?.map((question: any, index: number) => ({
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

  return (
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
                {index === answers.length - 1 && <CButton onClick={submitQuiz}>Submit</CButton>}
                <div className="fw-semibold fs-5 text-primary">{`Question ${index + 1}`}</div>
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
                            newState[index].answers = currentAnswers.filter((a) => a !== option.id)
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
  )
}
