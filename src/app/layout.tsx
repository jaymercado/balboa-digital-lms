'use client'

import Script from 'next/script'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import store from './../store'
import { SessionProvider } from 'next-auth/react'
import 'react-quill/dist/quill.snow.css';
import './../styles/style.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/bd_logo_sm.png" />
        <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css" />
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
          <ToastContainer />
          <Provider store={store}>{children}</Provider>
        </SessionProvider>
        <Script
          src="https://unpkg.com/react@16/umd/react.development.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
          strategy="afterInteractive"
        />
        <Script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/babel-standalone@6/babel.min.js" strategy="afterInteractive" />
        <Script type="text/babel" src="/my-scripts.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
