'use client'

import React, { Dispatch, SetStateAction } from 'react'
import {
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
} from '@coreui/react-pro'
import { QuizQuestion, QuizAnswer } from '@/types/quiz'

interface AnswerProps {
  type: string
  answers: QuizAnswer[]
  setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>
  index: number
}

export default function Answer({ type, answers, setQuestions, index }: AnswerProps) {
  const handleAnswerChange = (answerIndex: number, field: 'answer' | 'isCorrect', value: any) => {
    setQuestions((state) => {
      const updatedQuestions = state.map((q, i) => {
        if (i === index) {
          return {
            ...q,
            answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
          }
        }
        return q
      })
      return updatedQuestions
    })
  }

  if (type === 'trueOrFalse') {
    return (
      <CTable align="middle">
        <CTableHead>
          <CTableRow className="text-secondary fs-6">
            <CTableHeaderCell className="fw-semibold">Choices</CTableHeaderCell>
            <CTableHeaderCell className="fw-semibold">Correct Answer</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {answers.map((answer, answerIndex) => (
            <CTableRow key={answerIndex}>
              <CTableDataCell>
                <CFormInput
                  className="bg-body-tertiary"
                  type="text"
                  value={answerIndex === 0 ? 'True' : 'False'}
                  readOnly
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormCheck
                  checked={answer.isCorrect}
                  onChange={(e) => handleAnswerChange(answerIndex, 'isCorrect', e.target.checked)}
                />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    )
  }

  if (type === 'multipleChoice') {
    return (
      <CTable align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell className="fw-semibold">Choices</CTableHeaderCell>
            <CTableHeaderCell className="fw-semibold">Correct Answer</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {answers.map((answer, answerIndex) => (
            <CTableRow key={answerIndex}>
              <CTableDataCell>
                <CFormInput
                  value={answer.answer}
                  placeholder="Type answer here"
                  className="bg-body-tertiary"
                  onChange={(e) => handleAnswerChange(answerIndex, 'answer', e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormCheck
                  checked={answer.isCorrect}
                  onChange={(e) => handleAnswerChange(answerIndex, 'isCorrect', e.target.checked)}
                />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    )
  }

  return null
}

type Inputs = {
  text: string
  type: string
}
