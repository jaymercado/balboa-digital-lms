import { UserCourseItemLog } from '@/types/userCourseItemLog'

export const areAllCourseItemsCompleted = (userCourseItemLogs: UserCourseItemLog[]): boolean => {
  if (!userCourseItemLogs || userCourseItemLogs.length === 0) {
    return false
  }

  return userCourseItemLogs.every((log) => {
    if (log.courseItem.type === 'module') {
      return log.completed
    } else if (log.courseItem.type === 'quiz') {
      return log.completed && log.courseItem.score === 100
    }
    return false
  })
}
