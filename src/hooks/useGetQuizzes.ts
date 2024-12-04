import React, { useState, useEffect } from 'react'
import { Quiz } from '@/types/quiz'

export default function useGetQuizzes({ courseId }: { courseId: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [nextCourseId, setNextCourseId] = useState<string | undefined>(undefined)
  const [fetchingQuizzes, setFetchingQuizzes] = useState<boolean>(false)

  useEffect(() => {
    const fetchQuizzes = async () => {
      setFetchingQuizzes(true)

      const url = `/api/courses/${courseId}/quizzes`

      const res = await fetch(url)
      const fetchedData = ((await res.json()) as { quizzes: Quiz[]; nextCourseId?: string }) || []

      setQuizzes(fetchedData.quizzes)
      if (fetchedData.nextCourseId) {
        setNextCourseId(fetchedData.nextCourseId)
      }
    }

    fetchQuizzes().finally(() => setFetchingQuizzes(false))
  }, [courseId])

  return { quizzes, setQuizzes, nextCourseId, fetchingQuizzes }
}
