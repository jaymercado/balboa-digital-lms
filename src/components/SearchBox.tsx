import React from 'react'
import { CInputGroup, CForm, CFormInput, CInputGroupText } from '@coreui/react-pro'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <CForm className="d-none d-sm-flex">
      <CInputGroup>
        <CFormInput
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          className="bg-body-secondary border-0 px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CInputGroup>
    </CForm>
  )
}
