'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import toast from '@/utils/toast'
import { Loading } from '@/components'
import {
  CButton,
  CContainer,
  CCol,
  CTableHead,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import useGetQuizzes from '@/hooks/useGetQuizzes'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

export default function Quizzes() {
  const params = useParams()
  const router = useRouter()
  const { courseId } = params as { courseId: string }
  const { quizzes, fetchingQuizzes } = useGetQuizzes({ courseId })
  const [deletingQuiz, setDeletingQuiz] = useState(false)
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false)

  function deleteQuiz(quizId: string) {
    setDeletingQuiz(true)
    fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
      method: 'DELETE',
    })
      .then(() => {
        toast('success', 'Module deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingQuiz(false))
  }

  if (fetchingQuizzes) {
    return <Loading />
  }

  return (
    <CContainer className="mt-4">
      <CCol>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <CButton
            color="primary"
            as="a"
            href={`/managed-courses/${courseId}/quizzes/create`}
            className="fw-semibold"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Create Quiz
          </CButton>
        </div>

        <CTable striped>
          <CTableHead>
            <CTableRow className="text-secondary">
              <CTableHeaderCell>
                <small>ID</small>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <small>Title</small>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <small>Actions</small>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <CTableRow key={quiz.id} align="middle">
                  <CTableDataCell>
                    <Link href={`/managed-courses/${courseId}/quizzes/${quiz.id}`}>{quiz.id}</Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link
                      href={`/managed-courses/${courseId}/quizzes/${quiz.id}`}
                      className="text-decoration-none"
                    >
                      <span className="fw-semibold">{quiz.title}</span>
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CDropdown>
                      <CDropdownToggle className="rounded" caret={false}>
                        <i className="bi bi-three-dots-vertical"></i>
                      </CDropdownToggle>
                      <CDropdownMenu className="secondary">
                        <CDropdownItem
                          href={`/managed-courses/${courseId}/quizzes/${module.id}/edit`}
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          <small>Edit</small>
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() => setShowDeleteQuizModal((prevState) => !prevState)}
                          disabled={deletingQuiz}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          <small>Delete</small>
                        </CDropdownItem>
                        <ConfirmDeleteModal
                          visible={showDeleteQuizModal}
                          onClose={() => setShowDeleteQuizModal(false)}
                          onConfirm={() => [deleteQuiz(module.id), setShowDeleteQuizModal(false)]}
                          disabled={deletingQuiz}
                        />
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={3} className="text-center">
                  No quizzes available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCol>
    </CContainer>
  )
}
