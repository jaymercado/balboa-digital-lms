export default function getCourseItemStatus(userCourseItemLog: any) {
  if (!userCourseItemLog) {
    return 'Not Completed'
  }
  if (userCourseItemLog.courseItem.type === 'module') {
    return 'Completed'
  } else {
    return userCourseItemLog.courseItem.score
      ? `${userCourseItemLog.courseItem.score}/100`
      : 'Not Completed'
  }
}
