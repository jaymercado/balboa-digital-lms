'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import {
  CForm,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CFormText,
} from '@coreui/react-pro'
import Select, { MultiValue } from 'react-select'
import toast from '@/utils/toast'

const typeOptions = [
  { value: 'video', label: 'Video' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'text', label: 'Text' },
  { value: 'file', label: 'File' },
]

export default function CreateModule() {
  const { id } = useParams()
  const [creatingModule, setCreatingModule] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCreatingModule(true)
    fetch(`/api/courses/${id}/modules`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        toast('success', 'Module created successfully')
      })
      .catch((err) => {
        toast('error', 'Error creating module')
        console.error(err)
      })
      .finally(() => setCreatingModule(false))
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CInputGroup>
        <CFormLabel htmlFor="title">Title</CFormLabel>
        <CFormInput id="title" {...register('title', { required: true })} />
        {errors.title && <CFormText className="text-danger">This field is required</CFormText>}
      </CInputGroup>
      <CInputGroup>
        <CFormLabel htmlFor="description">Description</CFormLabel>
        <CFormInput id="description" {...register('description', { required: true })} />
        {errors.description && (
          <CFormText className="text-danger">This field is required</CFormText>
        )}
      </CInputGroup>

      <CInputGroup>
        <CFormLabel htmlFor="type">Type</CFormLabel>
        <Controller
          name="type"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              id="enrollees"
              isMulti
              options={typeOptions}
              onChange={(selectedOptions: MultiValue<TypeOption>) => {
                field.onChange(selectedOptions.map((option) => option.value))
              }}
              onBlur={field.onBlur}
              value={typeOptions.filter((option) => field?.value?.includes(option?.value))}
            />
          )}
        />
        {errors.type && <CFormText className="text-danger">This field is required</CFormText>}
      </CInputGroup>

      <CButton type="submit" color="primary" disabled={creatingModule}>
        {creatingModule ? <CSpinner size="sm" /> : 'Create'}
      </CButton>
    </CForm>
  )
}

type TypeOption = {
  value: string
  label: string
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
