'use client'

import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react-pro'
import { useSession } from 'next-auth/react'
import useGetUsers from '@/hooks/useGetUsers'
import { useGetGroups, useGetUserGroups } from '@/hooks/useGetGroups'
import { Loading } from '@/components'

export default function GroupMembers() {
  const { data: session } = useSession()
  const { users, fetchingUsers } = useGetUsers()
  const { groups, fetchingGroups } = useGetGroups()
  const { userGroups, fetchingUserGroups } = useGetUserGroups()
  const [activeTab, setActiveTab] = useState<string | null>(null)

  if (fetchingUsers || fetchingGroups || fetchingUserGroups) {
    return <Loading />
  }

  // Find the current user's ID using their email
  const currentUser = users.find((user) => user.email === session?.user?.email)
  if (!currentUser) {
    return <p className="text-center">User not found.</p>
  }

  // Get only the groups where the current user belongs
  const userGroupIds = userGroups
    .filter((ug) => ug.user_id === currentUser.id)
    .map((ug) => ug.group_id)

  const userGroupsList = groups.filter((group) => userGroupIds.includes(group.id))

  // Set default active tab to first group (if available)
  if (!activeTab && userGroupsList.length > 0) {
    setActiveTab(userGroupsList[0].id)
  }

  return (
    <CCard>
      <CCardBody>
        <h5 className="fw-bold mb-3">Groups</h5>

        {userGroupsList.length > 0 ? (
          <>
            {/* Tab Navigation */}
            <CNav variant="tabs">
              {userGroupsList.map((group) => (
                <CNavItem key={group.id}>
                  <CNavLink
                    active={activeTab === group.id}
                    onClick={() => setActiveTab(group.id)}
                    role="button"
                  >
                    {group.name}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNav>

            {/* Tab Content */}
            <CTabContent className="mt-3">
              {userGroupsList.map((group) => {
                // Get members of the group
                const members = users.filter((user) =>
                  userGroups.some(
                    (userGroup) => userGroup.group_id === group.id && userGroup.user_id === user.id,
                  ),
                )

                return (
                  <CTabPane key={group.id} visible={activeTab === group.id}>
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Email</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {members.length > 0 ? (
                          members.map((member) => (
                            <CTableRow key={member.id}>
                              <CTableDataCell>{member.name}</CTableDataCell>
                              <CTableDataCell>{member.email}</CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={2} className="text-center">
                              No members in this group
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPane>
                )
              })}
            </CTabContent>
          </>
        ) : (
          <p className="text-center">You are not part of any groups.</p>
        )}
      </CCardBody>
    </CCard>
  )
}
