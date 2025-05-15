'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CRow, CCol, CButton, CFormCheck } from '@coreui/react-pro'
import toast from '@/utils/toast'
import { Loading } from '@/components'

const shuffle = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

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
        shuffle(courseQuiz?.questions)?.map((question: any, index: number) => ({
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

  const handleOptionToggle = (index: number, optionId: any, setAnswers: any, answers: any) => {
    const isChecked = answers[index].answers.includes(optionId)
    setAnswers((state: any) => {
      const newState = [...state]
      const currentAnswers = [...newState[index].answers]

      if (!isChecked) {
        newState[index].answers = Array.from(new Set([...currentAnswers, optionId]))
      } else {
        newState[index].answers = currentAnswers.filter((a: any) => a !== optionId)
      }

      return newState
    })
  }

  return (
    <CRow>
      <CCol>
        {answers?.length === 0 ? <p>No questions found.</p> : ''}
        {answers?.map(({ question, onDisplay, options }: any, index: any) =>
          onDisplay ? (
            <div key={index} className="mb-4">
              <div className="fw-semibold fs-5 text-primary">{`Question ${index + 1}`}</div>
              <div className="fs-6 mb-3">{question}</div>
              {options.map((option: any, idx: any) => (
                <div
                  key={idx}
                  className={`mb-3 option ${
                    answers[index].answers.includes(option.id) ? 'option-selected' : ''
                  }`}
                >
                  <div
                    className="d-flex align-items-center p-3 border border-1 rounded"
                    onClick={() => handleOptionToggle(index, option.id, setAnswers, answers)}
                  >
                    <div className="d-flex align-items-center">
                      <CFormCheck
                        checked={answers[index].answers.includes(option.id)}
                        onChange={() => {}}
                      />
                      <span className="ms-2">{option.option}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <div className="d-flex flex-row-reverse justify-content-between">
                  {index < answers.length - 1 && (
                    <div className="text-end">
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() =>
                          setAnswers((prevAnswers) =>
                            prevAnswers.map((answer, idx) => ({
                              ...answer,
                              onDisplay: idx === index + 1,
                            })),
                          )
                        }
                      >
                        Next
                      </CButton>
                    </div>
                  )}

                  {index === answers.length - 1 && (
                    <div className="text-end">
                      <CButton color="success" onClick={submitQuiz} className="fw-bold text-white">
                        Submit
                      </CButton>
                    </div>
                  )}

                  {index > 0 && (
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() =>
                        setAnswers((prevAnswers) =>
                          prevAnswers.map((answer, idx) => ({
                            ...answer,
                            onDisplay: idx === index - 1,
                          })),
                        )
                      }
                    >
                      Previous
                    </CButton>
                  )}
                </div>
              </div>
            </div>
          ) : null,
        )}
      </CCol>
    </CRow>
  )
}
