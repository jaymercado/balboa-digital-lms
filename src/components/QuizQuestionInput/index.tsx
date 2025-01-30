'use client'

import React, { useEffect, Dispatch, SetStateAction } from 'react'
import { CCard, CCol, CFormTextarea, CFormSelect, CCardTitle, CButton } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { QuizQuestion } from '@/types/quiz'
import Option from './Option'

interface QuizQuestionInputProps {
  index: number
  question: QuizQuestion
  setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>
}

export default function QuizQuestionInput({
  index,
  question,
  setQuestions,
}: QuizQuestionInputProps) {
  const { type, options } = question

  // Handle updates when the type of the question changes
  useEffect(() => {
    if (type === 'multipleChoice' && options.length !== 4) {
      // Ensure there are 4 options for multiple choice questions
      setQuestions((state) => {
        return state.map((q, i) => {
          if (i === index) {
            return {
              ...q,
              options: [
                { option: '', isCorrect: false },
                { option: '', isCorrect: false },
                { option: '', isCorrect: false },
                { option: '', isCorrect: false },
              ],
            }
          }
          return q
        })
      })
    } else if (type === 'trueOrFalse' && options.length !== 2) {
      // Ensure there are 2 options for true/false questions
      setQuestions((state) => {
        return state.map((q, i) => {
          if (i === index) {
            return {
              ...q,
              options: [
                { option: 'true', isCorrect: false },
                { option: 'false', isCorrect: false },
              ],
            }
          }
          return q
        })
      })
    }
  }, [type, setQuestions, index, options.length])

  return (
    <CCard className="p-3 mb-3">
      <CCol>
        <div className="d-flex justify-content-between align-items-end mb-2">
          <CCardTitle>Question {index + 1}</CCardTitle>
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

        <Option type={type} options={options} setQuestions={setQuestions} index={index} />
        <div className="text-end">
          <CButton
            color="danger"
            className="text-white"
            onClick={() => {
              setQuestions((currentQuestions) => {
                const updatedQuestions = currentQuestions.filter((_, i) => i !== index)
                console.log(updatedQuestions)
                return updatedQuestions
              })
            }}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      </CCol>
    </CCard>
  )
}
