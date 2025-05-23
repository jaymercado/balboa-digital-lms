'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardBody,
  CButton,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ReactPaginate from 'react-paginate'
import { Course } from '@/types/course'
import { useGetCourses } from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading, ConfirmDeleteModal } from '@/components'
import SearchBox from '@/components/SearchBox'

export default function ManagedCourses() {
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const itemsPerPage = 8
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const offset = currentPage * itemsPerPage
  const paginatedData = filteredCourses.slice(offset, offset + itemsPerPage)

  const handlePageClick = useCallback((selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(0)
  }

  function deleteCourse(courseId: string) {
    setDeletingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedCourse: Course) => {
        setCourses(courses.filter((course) => course?.id !== deletedCourse?.id))
        toast('success', 'Course deleted successfully')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(false))
  }

  return (
    <CCard className="h-100">
      <CCardBody>
        <CCardTitle className="d-flex justify-content-between align-items-center fw-bold mb-3">
          <span className="d-none d-sm-inline">Your Managed Courses ({courses.length})</span>
          <span className="d-inline d-sm-none">Courses ({courses.length})</span>
          <div className="d-flex justify-content center align-items-center gap-2">
            <SearchBox
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses..."
            />
            <CButton
              color="primary"
              href="/managed-courses/create"
              className="bg-primary-emphasis fw-semibold d-flex align-items-center"
            >
              <CIcon icon={cilPlus} className="me-2" />
              <span className="d-none d-sm-inline">Create Course</span>
              <span className="d-inline d-sm-none">Create</span>
            </CButton>
          </div>
        </CCardTitle>
        {fetchingCourses ? (
          <Loading />
        ) : (
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-3 mb-3">
            {paginatedData.length > 0 ? (
              paginatedData.map((course) => (
                <div key={course.id}>
                  <CCol>
                    <CCard className="h-100">
                      <Link href={`/managed-courses/${course.id}`} className="text-decoration-none">
                        <CCardImage orientation="top" src="/images/react.jpg" alt={course.title} />
                      </Link>
                      <CCardBody className="d-flex flex-column">
                        <Link
                          href={`/managed-courses/${course.id}`}
                          className="text-decoration-none text-body"
                        >
                          <CCardTitle className="text-dark-emphasis text-truncate fs-6 fw-semibold">
                            {course.title}
                          </CCardTitle>
                          <CCardText className="text-secondary text-truncate mb-2 fs-6">
                            {course.description}
                          </CCardText>
                        </Link>
                        <div className="d-flex justify-content-end mt-auto">
                          <Link
                            href={`/managed-courses/${course.id}`}
                            className="me-2 d-flex align-items-center gap-1 text-decoration-none"
                          >
                            <small className="text-secondary d-none d-sm-inline">View Course</small>
                            <i className="bi bi-chevron-right text-secondary"></i>
                          </Link>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <ConfirmDeleteModal
                    visible={isDeleteModalVisible}
                    onClose={() => setIsDeleteModalVisible(false)}
                    onConfirm={() => [deleteCourse(course.id), setIsDeleteModalVisible(false)]}
                    disabled={deletingCourse}
                  />
                </div>
              ))
            ) : (
              <div className="text-center fw-bold mx-auto py-5">No courses found</div>
            )}
          </CRow>
        )}

        <div className="d-flex align-items-center justify-content-center">
          <small className="text-secondary me-2 page-number">
            Page {currentPage + 1} of {Math.ceil(courses.length / itemsPerPage)}
          </small>

          <ReactPaginate
            pageCount={Math.ceil(courses.length / itemsPerPage)}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousLabel={'‹'}
            nextLabel={'›'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-move'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-move'}
            nextLinkClassName={'page-link'}
            breakLabel={'...'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </div>
      </CCardBody>
    </CCard>
  )
}
