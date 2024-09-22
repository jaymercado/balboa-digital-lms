import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react-pro'
import { useTypedSelector } from './../store'
import AppSidebarNav from './AppSidebarNav'
import balboaDigitalLogo from '@/public/images/bd_logo.png'
import balboaDigitalLogoSM from '@/public/images/bd_logo_sm.png'
import generateNav from '../_nav'

const AppSidebar = (): JSX.Element => {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  const unfoldable = useTypedSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useTypedSelector((state) => state.sidebarShow)

  if (status === 'loading') {
    return <></>
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand as={Link} href="/">
          <Image
            src={balboaDigitalLogo.src}
            alt="Logo"
            className="sidebar-brand-full"
            width={137}
            height={32}
          />
          <Image
            src={balboaDigitalLogoSM.src}
            alt="Logo"
            className="sidebar-brand-narrow"
            width={32}
            height={32}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={generateNav(session?.user?.role || '')} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
