import React, { useState, useEffect } from 'react'
import { Quiz } from '@/types/quiz'

export function useGetQuizzes({ courseId }: { courseId: string }) {
  const [fetchingQuizzes, setFetchingQuizzes] = useState<boolean>(false)
  const [courseQuizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      setFetchingQuizzes(true)

      let url = `/api/courses/${courseId}/quizzes`

      const res = await fetch(url)
      const fetchedCourseQuizzes = ((await res.json()) as Quiz[]) || []

      setQuizzes(fetchedCourseQuizzes)
    }

    fetchQuizzes().finally(() => setFetchingQuizzes(false))
  }, [courseId])

  return { fetchingQuizzes, courseQuizzes, setQuizzes }
}

export function useGetQuiz({ courseId, quizId }: { courseId: string; quizId: string }) {
  const [fetchingQuiz, setFetchingQuiz] = useState<boolean>(false)
  const [courseQuiz, setCourseQuiz] = useState<Quiz | null>(null)
  const [previousQuizId, setPreviousQuizId] = useState<string | null>(null)
  const [nextQuizId, setNextQuizId] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      setFetchingQuiz(true)

      let url = `/api/courses/${courseId}/quizzes/${quizId}`

      const res = await fetch(url)
      const fetchedCourseQuiz =
        ((await res.json()) as {
          formattedCourseQuiz: Quiz
          nextQuizId?: string
          previousQuizId?: string
        }) || {}

      setCourseQuiz(fetchedCourseQuiz.formattedCourseQuiz)
      if (fetchedCourseQuiz.nextQuizId) {
        setNextQuizId(fetchedCourseQuiz.nextQuizId)
      }
      if (fetchedCourseQuiz.previousQuizId) {
        setPreviousQuizId(fetchedCourseQuiz.previousQuizId)
      }
    }

    fetchQuiz().finally(() => setFetchingQuiz(false))
  }, [courseId, quizId])

  return { fetchingQuiz, courseQuiz, setCourseQuiz, nextQuizId, previousQuizId }
}
