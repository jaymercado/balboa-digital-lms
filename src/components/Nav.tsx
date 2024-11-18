'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { ClientSafeProvider } from 'next-auth/react'
import { Poppins } from 'next/font/google'
import balboaDigitalLogo from '@/public/images/bd_logo.png'
import googleLogo from '@/public/images/search.png'
import { cilMoon, cilSun } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CHeaderNav,
  CHeader,
  useColorModes,
  CButton,
} from '@coreui/react-pro'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const Nav = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)
  const { colorMode, setColorMode } = useColorModes(
    'coreui-pro-next-js-admin-template-theme-modern',
  )

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProviders()
  }, [])

  return (
    <nav className={`navbar navbar-expand-lg px-2 py-2 ${poppins.className} border-bottom`}>
      <div></div>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src={balboaDigitalLogo}
            alt="Balboa Digital logo"
            width={110}
            height={25}
            className="d-inline-block align-top"
          />
        </Link>

        <div className="d-flex align-items-center">
          <CHeaderNav>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>

          <div className="collapse navbar-collapse ms-3">
            {session?.user ? (
              <div className="navbar-nav ms-auto">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="btn btn-outline-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="navbar-nav ms-auto">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <CButton
                      type="button"
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="border ms-2 d-flex align-items-center rounded-pill fw-semibold"
                    >
                      <Image
                        src={googleLogo}
                        alt="Google logo"
                        width={20}
                        height={20}
                        className="my-2 me-2"
                      />
                      Sign In with {provider.name}
                    </CButton>
                  ))}
              </div>
            )}
          </div>

          <div className="d-lg-none d-flex">
            {session?.user ? (
              <button type="button" onClick={() => signOut()} className="btn btn-dark w-100 mt-3">
                Sign Out
              </button>
            ) : (
              <div className="d-flex flex-column w-100">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <CButton
                      color="light"
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="ms-2 border border-dark d-flex align-items-center rounded-pill fw-semibold"
                    >
                      <Image
                        src={googleLogo}
                        alt="Google logo"
                        width={15}
                        height={15}
                        className="my-1 me-1"
                      />
                      Sign In
                    </CButton>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
