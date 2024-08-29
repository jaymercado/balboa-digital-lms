import React from 'react'

import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="mx-auto">
        Copyright © 2010-2024{' '}
        <a href="https://www.balboadigital.com/" target="_blank" rel="noopener noreferrer">
          Balboa Digital Inc.
        </a>{' '}
        All Rights Reserved.
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
