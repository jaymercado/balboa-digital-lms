'use client'

import React from 'react'
import { UseFormSetValue } from 'react-hook-form'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import ImageResize from 'quill-image-resize-module-react'

Quill.register('modules/imageResize', ImageResize)

interface Inputs {
  title: string
  description: string
  type: string
  content: string
}

interface RichTextInputProps {
  value: string
  setValue: UseFormSetValue<Inputs>
}

const modules = {
  imageResize: {
    modules: ['Resize', 'DisplaySize'],
  },
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'indent',
  'script',
  'direction',
  'align',
  'color',
  'background',
  'link',
  'image',
  'video',
]

export default function RichTextInput({ value, setValue }: RichTextInputProps) {
  return (
    <div className="mb-4">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(val) => setValue('content', val)}
        modules={modules}
        formats={formats}
        style={{ height: '300px' }}
      />
    </div>
  )
}
