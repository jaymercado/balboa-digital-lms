export interface CourseItem {
  id: string
  courseId: string
  quizId?: string
  moduleId?: string
  modules: { title: string }
  quizzes: { title: string }
  position: number
  type: 'module' | 'quiz'
  title?: string
}
