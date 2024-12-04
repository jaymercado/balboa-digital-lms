'use client'

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { CCard, CCol, CFormTextarea, CFormSelect } from '@coreui/react-pro'
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
    <CCard className="p-3 mt-3 bg-light">
      <CCol>
        <h2>Question {index + 1}</h2>
        <CFormTextarea
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
        <CFormSelect
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
        <Answer type={type} answers={answers} setQuestions={setQuestions} index={index} />
      </CCol>
    </CCard>
  )
}
