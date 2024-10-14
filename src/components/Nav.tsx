'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { ClientSafeProvider } from 'next-auth/react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

import balboaDigitalLogo from '@/public/images/bd_logo.png'
import googleLogo from '@/public/images/search.png'

const Nav = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProviders()
  }, [])

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-light px-3 py-3 ${poppins.className} border-bottom`}
    >
      <div className=""></div>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src={balboaDigitalLogo}
            alt="Balboa Digital logo"
            width={130}
            height={30}
            className="d-inline-block align-top"
          />
        </Link>

        <div className="collapse navbar-collapse">
          {session?.user ? (
            <div className="navbar-nav ms-auto">
              <button type="button" onClick={() => signOut()} className="btn btn-outline-secondary">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="navbar-nav ms-auto">
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="btn btn-dark ms-2 border border-dark d-flex align-items-center rounded-pill fw-semibold"
                  >
                    <Image
                      src={googleLogo}
                      alt="Google logo"
                      width={20}
                      height={20}
                      className="my-2 me-2"
                    />
                    Sign In with {provider.name}
                  </button>
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
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="btn btn-dark ms-2 border border-dark d-flex align-items-center rounded-pill fw-semibold"
                  >
                    <Image
                      src={googleLogo}
                      alt="Google logo"
                      width={15}
                      height={15}
                      className="my-2 me-2"
                    />
                    Sign In
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
