export interface Module {
  id: string
  title: string
  description: string
  type: 'text' | 'video' | 'image' | 'pdf'
  content: string
}
