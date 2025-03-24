import React from 'react'
import { signOut } from 'next-auth/react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSession } from 'next-auth/react'
import profilePicturePlaceholder from '@/public/images/profile-picture-placeholder.png'

const AppHeaderDropdown = () => {
  const { data: session } = useSession()

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar
          src={session?.user?.image ? session?.user?.image : profilePicturePlaceholder?.src}
          size="md"
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-tertiary rounded-top p-3">
          <span className="fw-semibold text-body fs-6">{session?.user?.name}</span>
          <div className="text-body-secondary fw-normal">{session?.user?.email}</div>
        </CDropdownHeader>

        <CDropdownDivider />
        <CDropdownItem href="#" onClick={() => signOut()}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
