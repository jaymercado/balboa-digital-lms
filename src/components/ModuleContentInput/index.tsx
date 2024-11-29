'use client'

import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import RichTextInput from './RichTextInput'
import FileInput from './FileInput'

export default function ModuleContentInput({
  type,
  value,
  setValue,
  setFile,
  setFileExtension,
  currentFile, // New prop for current file
}: ModuleContentInputProps) {
  // Set the current file into the state when editing
  useEffect(() => {
    if (currentFile) {
      setFile(currentFile)
    }
  }, [currentFile, setFile, setFileExtension])

  if (type === 'text') {
    return <RichTextInput value={value} setValue={setValue} />
  }

  if (['video', 'image', 'pdf'].includes(type)) {
    return (
      <FileInput
        type={type as 'video' | 'image' | 'pdf'}
        setFile={setFile}
        setFileExtension={setFileExtension}
        currentFile={currentFile} // Pass the current file
      />
    )
  }

  return null
}

interface ModuleContentInputProps {
  type: string
  value: string
  setValue: UseFormSetValue<Inputs>
  setFile: Dispatch<SetStateAction<File | null>>
  setFileExtension: Dispatch<SetStateAction<string>>
  currentFile: File | null // Prop to pass the current file
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
