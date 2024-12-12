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
          <CTableRow>
            <CTableDataCell>
              <CFormInput className="bg-body-tertiary" type="text" value="True" readOnly />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck checked={answers[0].isCorrect} />
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <CFormInput className="bg-body-tertiary" type="text" value="False" readOnly />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck checked={answers[1].isCorrect} />
            </CTableDataCell>
          </CTableRow>
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
          {answers.map((_, answerIndex) => (
            <CTableRow key={answerIndex}>
              <CTableDataCell>
                <CFormInput
                  placeholder="Type answer here"
                  className="bg-body-tertiary"
                  onChange={(e) =>
                    setQuestions((state) => {
                      return state.map((q, i) => {
                        if (i === index) {
                          return {
                            ...q,
                            answers: q.answers.map((a, j) =>
                              j === answerIndex
                                ? { answer: e.target.value, isCorrect: a.isCorrect }
                                : a,
                            ),
                          }
                        }
                        return q
                      })
                    })
                  }
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormCheck
                  checked={answers[answerIndex].isCorrect}
                  onChange={(e) =>
                    setQuestions((state) => {
                      return state.map((q, i) => {
                        if (i === index) {
                          return {
                            ...q,
                            answers: q.answers.map((a, j) =>
                              j === answerIndex
                                ? { answer: a.answer, isCorrect: e.target.checked }
                                : a,
                            ),
                          }
                        }
                        return q
                      })
                    })
                  }
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