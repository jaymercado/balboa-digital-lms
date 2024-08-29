import React from 'react'
import { signOut } from 'next-auth/react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import {
  cilAccountLogout,
  cilBell,
  cilCreditCard,
  cilEnvelopeOpen,
  cilFile,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
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
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          Account
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold my-2">
          Settings
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
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
