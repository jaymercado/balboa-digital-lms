'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ReactPaginate from 'react-paginate'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCard,
  CCardBody,
} from '@coreui/react-pro'

import useGetUsers from '@/hooks/useGetUsers'
import { Loading } from '@/components'

export default function Users() {
  const router = useRouter()
  const { data: session } = useSession()
  const { users, fetchingUsers } = useGetUsers()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const paginatedData = users.slice(offset, offset + itemsPerPage)

  const handlePageClick = useCallback((selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }, [])

  if (session?.user?.role && session?.user?.role !== 'admin') {
    router.push('/')
  }

  if (fetchingUsers) {
    return <Loading />
  }

  return (
    <CCard>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell>No users found</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        <div className="d-flex align-items-center justify-content-center">
          <small className="text-secondary me-2 page-number">
            Page {currentPage + 1} of {Math.ceil(users.length / itemsPerPage)}
          </small>

          <ReactPaginate
            pageCount={Math.ceil(users.length / itemsPerPage)}
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
