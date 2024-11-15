const isModuleContentMultimedia = (type: string) => {
  return ['video', 'image', 'pdf'].includes(type)
}

export { isModuleContentMultimedia }
