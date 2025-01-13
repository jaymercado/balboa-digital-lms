export interface UserCourseItemLog {
  id: string
  courseId: string
  studentId: string
  courseItemId: string
  completed: boolean
  courseItem: {
    type: string
    id: string
    title: string
    score?: number
  }
}
