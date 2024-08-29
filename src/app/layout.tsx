'use client'

import Script from 'next/script'

import { Provider } from 'react-redux'
import store from './../store'
import { SessionProvider } from 'next-auth/react'
import './../styles/style.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/bd_logo_sm.png" />
        <title>Balboa Digtal - LMS</title>
        <Script
          id="get-color-scheme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        const userMode = localStorage.getItem('coreui-pro-next-js-admin-template-theme-modern');
        const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (userMode === 'dark' || (userMode !== 'light' && systemDarkMode)) {
          document.documentElement.dataset.coreuiTheme = 'dark';
        }`,
          }}
        />
      </head>
      <body>
        <SessionProvider>
          <Provider store={store}>{children}</Provider>
        </SessionProvider>
      </body>
    </html>
  )
}
