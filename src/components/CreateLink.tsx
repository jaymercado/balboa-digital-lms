import React from 'react'
import { CLink } from '@coreui/react-pro'

const DocsLink = (props: { href: string; name?: string; text?: string }) => {
  const { href, name, text, ...rest } = props

  return (
    <div className="float-end">
      <CLink {...rest} href={href} rel="noreferrer noopener" className="card-header-action">
        <small className="text-medium-emphasis">{text || 'docs'}</small>
      </CLink>
    </div>
  )
}

export default React.memo(DocsLink)
