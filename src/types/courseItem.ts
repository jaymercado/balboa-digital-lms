export interface CourseItem {
  id: string
  courseId: string
  quizId?: string
  moduleId?: string
  position: number
  type: 'module' | 'quiz'
  title?: string
}
