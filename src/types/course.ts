import { User } from './user'
import { Module } from './module'

export interface Course {
  id: string
  title: string
  description: string
  enrollees: string[] | User[]
  instructors: string[] | User[]
  modules: Module[]
}

export interface CourseWithEnrolleesAndInstructors {
  id: string
  title: string
  description: string
  enrollees: User[]
  instructors: User[]
  modules: Module[]
}
