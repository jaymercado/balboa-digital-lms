import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { CFormInput } from '@coreui/react-pro'

export default function FileInput({ setFile, setFileExtension }: FileInputProps) {
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setFile(e.target.files?.[0])
    const fileName = e.target.files?.[0].name
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)
    setFileExtension(fileExtension)
  }
  return <CFormInput type="file" onChange={uploadFile} />
}

interface FileInputProps {
  setFile: Dispatch<SetStateAction<File | null>>
  setFileExtension: Dispatch<SetStateAction<string>>
}
