import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { CFormInput, CFormLabel } from '@coreui/react-pro'

export default function FileInput({
  type,
  setFile,
  setFileExtension,
  currentFile, // New prop to handle the current file
}: FileInputProps) {
  let accept = ''
  if (type === 'image') accept = '.jpg,.jpeg,.png'
  else if (type === 'video') accept = '.mp4'
  else if (type === 'pdf') accept = '.pdf'

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setFile(e.target.files?.[0])
    const fileName = e.target.files?.[0].name
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)
    setFileExtension(fileExtension)
  }

  return (
    <div>
      {/* If a current file exists, show the file name */}
      <CFormLabel htmlFor="fileInput">
        {currentFile ? `Current File: ${currentFile.name}` : 'Upload File'}
      </CFormLabel>
      <CFormInput
        id="fileInput"
        type="file"
        onChange={uploadFile}
        accept={accept}
        placeholder={currentFile ? currentFile.name : 'Choose a file'}
      />
    </div>
  )
}

interface FileInputProps {
  type: 'image' | 'video' | 'pdf'
  setFile: Dispatch<SetStateAction<File | null>>
  setFileExtension: Dispatch<SetStateAction<string>>
  currentFile: File | null // Prop to pass the current file
}
