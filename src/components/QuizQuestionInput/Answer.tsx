'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
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

interface AnswerProps {
  type: string
}

export default function Answer({ type }: AnswerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  if (type === 'trueOrFalse') {
    return (
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell />
            <CTableHeaderCell>Correct</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableDataCell>True</CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>False</CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    )
  }

  if (type === 'identification') {
    return <CFormInput />
  }

  if (type === 'multipleChoice') {
    return (
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell />
            <CTableHeaderCell>Correct</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableDataCell>
              <CFormInput />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <CFormInput />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <CFormInput />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <CFormInput />
            </CTableDataCell>
            <CTableDataCell>
              <CFormCheck />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    )
  }

  return null
}

type Inputs = {
  text: string
  type: string
  points: number
}
