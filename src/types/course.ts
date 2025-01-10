import { User } from './user'
import { CourseItem } from './courseItem'

export interface Course {
  id: string
  title: string
  description: string
  enrollees: User[]
  instructors: User[]
  courseItems: CourseItem[]
}
