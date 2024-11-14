import React from 'react'
import { CButton } from '@coreui/react-pro'
import { useRouter } from 'next/navigation'

const CancelButton: React.FC = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <CButton color="light" onClick={handleCancel}>
      Cancel
    </CButton>
  )
}

export default CancelButton
