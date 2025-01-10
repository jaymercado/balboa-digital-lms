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
import { QuizQuestion, QuizOption } from '@/types/quiz'

interface AnswerProps {
  type: string
  options: QuizOption[]
  setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>
  index: number
}

export default function Option({ type, options, setQuestions, index }: AnswerProps) {
  const handleAnswerChange = (answerIndex: number, field: 'option' | 'isCorrect', value: any) => {
    setQuestions((state) => {
      const updatedQuestions = state.map((q, i) => {
        if (i === index) {
          return {
            ...q,
            options: q.options.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
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
            <CTableHeaderCell className="fw-semibold">Correct Option</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {options.map((option, answerIndex) => (
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
                  checked={option.isCorrect}
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
            <CTableHeaderCell className="fw-semibold">Correct Option</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {options.map((option, answerIndex) => (
            <CTableRow key={answerIndex}>
              <CTableDataCell>
                <CFormInput
                  value={option.option}
                  placeholder="Type option here"
                  className="bg-body-tertiary"
                  onChange={(e) => handleAnswerChange(answerIndex, 'option', e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormCheck
                  checked={option.isCorrect}
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
