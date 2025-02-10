'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CBadge,
} from '@coreui/react-pro'
import { useGetCourses } from '@/hooks/useGetCourses'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import { Loading } from '@/components'
import ReactPaginate from 'react-paginate'
import SearchBox from '@/components/SearchBox'

export default function EnrolledCourses() {
  const { courses, fetchingCourses } = useGetCourses({ type: 'enrolled' })
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const itemsPerPage = 8

  const mergedCourses = courses.map((course) => {
    const courseStatus = coursesWithCompletionStatus.find((status) => status.id === course.id)
    return { ...course, status: courseStatus?.status || 'notStarted' }
  })

  const filteredCourses = mergedCourses.filter(
    (course: any) =>
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

  return (
    <CCard className="h-100">
      <CCardBody>
        <CCardTitle className="d-flex justify-content-between align-items-center fw-bold mb-3">
          <span className="d-none d-sm-inline">Your Enrolled Courses ({courses.length})</span>
          <span className="d-inline d-sm-none">Courses ({courses.length})</span>
          <SearchBox
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search courses..."
          />
        </CCardTitle>
        {fetchingCourses ? (
          <Loading />
        ) : (
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-3 mb-3">
            {paginatedData.length > 0 ? (
              paginatedData.map((course) => (
                <div key={course.id}>
                  <CCol>
                    <CCard className="h-100 position-relative">
                      <Link
                        href={`/enrolled-courses/${course.id}`}
                        className="text-decoration-none"
                      >
                        <CCardImage orientation="top" src="/images/react.jpg" alt={course.title} />
                      </Link>
                      {/* Badge */}
                      {course.status === 'completed' ? (
                        <CBadge
                          color="success"
                          shape="rounded-pill"
                          className="text-success-emphasis bg-success-subtle position-absolute top-0 end-0 m-2"
                        >
                          Completed
                        </CBadge>
                      ) : course.status === 'inProgress' ? (
                        <CBadge
                          shape="rounded-pill"
                          className="text-warning-emphasis bg-warning-subtle position-absolute top-0 end-0 m-2"
                        >
                          In Progress
                        </CBadge>
                      ) : (
                        <CBadge
                          shape="rounded-pill"
                          className="text-danger-emphasis bg-danger-subtle position-absolute top-0 end-0 m-2"
                        >
                          Not Started
                        </CBadge>
                      )}
                      <CCardBody className="d-flex flex-column">
                        <Link
                          href={`/enrolled-courses/${course.id}`}
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
                            href={`/enrolled-courses/${course.id}`}
                            className="me-2 d-flex align-items-center gap-1 text-decoration-none"
                          >
                            <small className="text-secondary d-none d-sm-inline">View Course</small>
                            <i className="bi bi-chevron-right text-secondary"></i>
                          </Link>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
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
