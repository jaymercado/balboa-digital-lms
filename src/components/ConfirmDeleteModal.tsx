import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CSpinner,
} from '@coreui/react-pro'

interface ConfirmDeleteModalProps {
  visible: boolean
  disabled?: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  body?: string
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  disabled,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  body = 'Are you sure you want to delete this item? This action cannot be undone.',
}) => {
  return (
    <CModal alignment="center" visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{body}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>

        <CButton color="danger" onClick={onConfirm} disabled={disabled}>
          {disabled ? (
            <CSpinner color="light" size="sm" />
          ) : (
            <span className="text-light">Delete</span>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmDeleteModal
