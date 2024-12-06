'use client'

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { CCard, CCol, CFormTextarea, CFormSelect, CCardTitle } from '@coreui/react-pro'
import { QuizQuestion, QuizAnswer } from '@/types/quiz'
import Answer from './Answer'

interface CreateQuizProps {
  index: number
  question: QuizQuestion
  setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>
}

export default function CreateQuiz({ index, question, setQuestions }: CreateQuizProps) {
  const { type, answers } = question

  useEffect(() => {
    if (type === 'multipleChoice') {
      setQuestions((state) => {
        return state.map((q, i) => {
          if (i === index) {
            return {
              ...q,
              answers: [
                { answer: '', isCorrect: false },
                { answer: '', isCorrect: false },
                { answer: '', isCorrect: false },
                { answer: '', isCorrect: false },
              ],
            }
          }
          return q
        })
      })
    } else {
      setQuestions((state) => {
        return state.map((q, i) => {
          if (i === index) {
            return {
              ...q,
              answers: [
                { answer: 'true', isCorrect: false },
                { answer: 'false', isCorrect: false },
              ],
            }
          }
          return q
        })
      })
    }
  }, [type, setQuestions, index])

  return (
    <CCard className="p-3 mb-3">
      <CCol>
        <div className="d-flex justify-content-between align-items-end mb-2">
          <CCardTitle>
            <i className="bi bi-question-square-fill"></i> Question {index + 1}
          </CCardTitle>
          <CFormSelect
            className="w-25 bg-body-tertiary"
            value={type}
            onChange={(e) =>
              setQuestions((state) => {
                return state.map((q, i) => {
                  if (i === index) {
                    return { ...q, type: e.target.value }
                  }
                  return q
                })
              })
            }
          >
            <option value="multipleChoice">Multiple Choice</option>
            <option value="trueOrFalse">True or False</option>
          </CFormSelect>
        </div>
        <CFormTextarea
          className="bg-body-tertiary mb-2"
          rows={3}
          value={question.question}
          onChange={(e) =>
            setQuestions((state) => {
              return state.map((q, i) => {
                if (i === index) {
                  return { ...q, question: e.target.value }
                }
                return q
              })
            })
          }
          placeholder="Enter question"
        />

        <Answer type={type} answers={answers} setQuestions={setQuestions} index={index} />
      </CCol>
    </CCard>
  )
}
