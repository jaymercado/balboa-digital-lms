'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import toast from '@/utils/toast'
import { useGetQuizzes } from '@/hooks/useGetQuizzes'
import { Loading } from '@/components'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

export default function CourseQuizzesTable({
  courseId,
  userIsStudent = false,
}: CourseQuizzesTableProps) {
  const { courseQuizzes, fetchingQuizzes, setQuizzes } = useGetQuizzes({ courseId })
  const [deletingQuiz, setDeletingQuiz] = useState(false)
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false)

  function deleteQuiz(quizId: string) {
    setDeletingQuiz(true)
    fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setQuizzes((quizzes) => quizzes.filter((quiz) => quiz.id !== quizId))
        toast('success', 'Quiz deleted successfully')
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

  // TODO: Add a 404 page
  if (!courseQuizzes) {
    return <div>Quizzes not found</div>
  }

  return (
    <CTable striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>
            <small>ID</small>
          </CTableHeaderCell>
          <CTableHeaderCell>
            <small>Title</small>
          </CTableHeaderCell>
          {!userIsStudent && (
            <CTableHeaderCell>
              <small>Actions</small>
            </CTableHeaderCell>
          )}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {courseQuizzes.length > 0 ? (
          courseQuizzes.map((quiz) => (
            <CTableRow key={quiz.id} align="middle">
              <CTableDataCell>
                <Link
                  href={`/${userIsStudent ? 'enrolled' : 'managed'}-courses/${courseId}/quizzes/${
                    quiz.id
                  }`}
                  className="text-decoration-none"
                >
                  <span className="fw-semibold">{quiz.id}</span>
                </Link>
              </CTableDataCell>
              <CTableDataCell>
                <span className="fw-semibold">{quiz.title}</span>
              </CTableDataCell>
              {!userIsStudent && (
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle className="rounded" caret={false}>
                      <i className="bi bi-three-dots-vertical"></i>
                    </CDropdownToggle>
                    <CDropdownMenu className="secondary">
                      <CDropdownItem href={`/managed-courses/${courseId}/quizzes/${quiz.id}/edit`}>
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
                        onConfirm={() => [deleteQuiz(quiz.id), setShowDeleteQuizModal(false)]}
                        disabled={deletingQuiz}
                      />
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              )}
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={4} className="text-center">
              No modules available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}

interface CourseQuizzesTableProps {
  courseId: string
  userIsStudent?: boolean
}
