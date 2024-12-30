/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CButton,
  CCardText,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { Loading } from '@/components'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import CourseModuleContent from '@/components/CourseModuleContent'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, quizId } = params as { courseId: string; quizId: string }
  const { fetchingQuiz, courseQuiz, nextQuizId, previousQuizId } = useGetQuiz({
    courseId,
    quizId,
  })
  const [deletingQuiz, setDeletingQuiz] = useState(false)
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false)

  function deleteQuiz(quizId: string) {
    setDeletingQuiz(true)
    fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Quiz deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting quiz')
      })
      .finally(() => setDeletingQuiz(false))
  }

  if (fetchingQuiz) {
    return <Loading />
  }

  if (!courseQuiz) {
    // TODO: Handle error
    return <p>Error loading quiz</p>
  }

  console.log(courseQuiz)

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
              </CCol>
              <CCol xs="auto">
                <CButton
                  color="light"
                  className="me-2"
                  href={`/managed-courses/${courseId}/quizzes/${quizId}/edit`}
                >
                  <CIcon icon={cilPencil} size="sm" /> Edit
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => setShowDeleteQuizModal((prevState) => !prevState)}
                  className="text-light"
                >
                  <CIcon icon={cilTrash} className="text-white" /> Delete
                </CButton>
              </CCol>
            </CRow>
            <ConfirmDeleteModal
              visible={showDeleteQuizModal}
              onClose={() => setShowDeleteQuizModal(false)}
              onConfirm={() => [deleteQuiz(quizId), setShowDeleteQuizModal(false)]}
              disabled={deletingQuiz}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
