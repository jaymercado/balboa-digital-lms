'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCard,
  CCardBody,
  CFormSelect,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import useGetUsers from '@/hooks/useGetUsers'
import { Loading } from '@/components'
import { User } from '@/types/user'
import { roles } from '@/shared/constants'

export default function Users() {
  const router = useRouter()
  const { data: session } = useSession()
  const { users, setUsers, fetchingUsers } = useGetUsers()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const paginatedData = users.slice(offset, offset + itemsPerPage)

  const handlePageClick = useCallback((selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }, [])

  const handleRoleChange = (userId: string, role: User['role']) => {
    axios
      .put(`/api/users/${userId}`, { role })
      .then((res) => {
        if (res.status !== 200) throw new Error('Failed to update role')
        toast('success', 'Role updated successfully')
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, role } : user)),
        )
      })
      .catch((err) => {
        toast('error', 'Error updating role')
        console.error(err)
      })
  }

  if (session?.user?.role && session?.user?.role !== 'admin') {
    router.push('/')
  }

  if (fetchingUsers) {
    return <Loading />
  }

  return (
    <CCard>
      <CCardBody>
        <CTable className="table table-striped">
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
                  <CTableDataCell>
                    <CFormSelect
                      aria-label="Select Role"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      options={roles.map((role) => ({
                        label: role.label,
                        value: role.value,
                      }))}
                    />
                  </CTableDataCell>
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
