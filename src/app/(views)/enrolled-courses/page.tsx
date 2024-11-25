'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCol, CRow } from '@coreui/react-pro'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import ReactPaginate from 'react-paginate'

export default function EnrolledCourses() {
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'enrolled' })
  const itemsPerPage = 8
  const [currentPage, setCurrentPage] = useState(0)
  const offset = currentPage * itemsPerPage
  const paginatedData = courses.slice(offset, offset + itemsPerPage)

  const handlePageClick = useCallback((selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }, [])

  return (
    <CCard className="h-100">
      <CCardBody>
        <CCardTitle className="d-flex justify-content-between align-items-center fw-bold mb-3">
          <span className="d-none d-sm-inline">Your Enrolled Courses ({courses.length})</span>
          <span className="d-inline d-sm-none">Courses ({courses.length})</span>
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
                      <Link href={`/enrolled-courses/${course.id}`} className="text-decoration-none">
                        <CCardImage orientation="top" src="/images/react.jpg" alt={course.title} />
                      </Link>
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
              <div className="text-center">No courses found</div>
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
