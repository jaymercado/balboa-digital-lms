import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { 
  CContainer, 
  CForm, 
  CFormInput, 
  CHeader, 
  CHeaderNav, 
  CHeaderToggler, 
  CInputGroup, 
  CInputGroupText, 
  useColorModes, 
  CButton 
} from '@coreui/react-pro'
import { cilMenu, cilMoon, cilSearch, cilSun } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useTypedSelector } from './../store'
import AppHeaderDropdown from './AppHeaderDropdown'

const AppHeader = (): JSX.Element => {
  const headerRef = useRef<HTMLDivElement>(null)
  const { colorMode, setColorMode } = useColorModes(
    'coreui-pro-next-js-admin-template-theme-modern',
  )
  const dispatch = useDispatch()
  const sidebarShow = useTypedSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    })
  }, [])

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          className={classNames('d-lg-none', { 'prevent-hide': !sidebarShow })}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CForm className="d-none d-sm-flex">
          <CInputGroup>
            <CInputGroupText id="search-addon" className="bg-body-secondary border-0 px-1">
              <CIcon icon={cilSearch} size="lg" className="my-1 mx-2 text-body-secondary" />
            </CInputGroupText>
            <CFormInput
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
              className="bg-body-secondary border-0"
            />
          </CInputGroup>
        </CForm>
        
        <CHeaderNav className="ms-auto ms-md-0">
          <CButton 
            color="transparent" 
            onClick={toggleColorMode} 
            className="p-0"
          >
            <CIcon icon={colorMode === 'light' ? cilSun : cilMoon} size="lg" />
          </CButton>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader