import React, { ElementType } from 'react'
import { cilBook, cilPencil, cilSpeedometer, cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react-pro'

export type Badge = {
  color: string
  text: string
}

export type NavItem = {
  component: string | ElementType
  name: string | JSX.Element
  icon?: string | JSX.Element
  badge?: Badge
  href?: string
  items?: NavItem[]
}

export const generateNav = (role: string) => {
  const nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info-gradient',
        text: 'NEW',
      },
      href: '/',
    },
    {
      component: CNavTitle,
      name: 'Courses',
    },
    {
      component: CNavItem,
      name: 'Enrolled Courses',
      href: '/enrolled-courses',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    },
  ]

  if (role === 'instructor') {
    nav.push(
      {
        component: CNavItem,
        name: 'Managed Courses',
        href: '/managed-courses',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Users',
      },
      {
        component: CNavItem,
        name: 'Managed Users',
        href: '/managed-users',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
    )
  }

  return nav
}

export default generateNav
