import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { CFormInput } from '@coreui/react-pro'

export default function FileInput({ type, setFile, setFileExtension }: FileInputProps) {
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
  return <CFormInput type="file" onChange={uploadFile} accept={accept} />
}

interface FileInputProps {
  type: 'image' | 'video' | 'pdf'
  setFile: Dispatch<SetStateAction<File | null>>
  setFileExtension: Dispatch<SetStateAction<string>>
}
