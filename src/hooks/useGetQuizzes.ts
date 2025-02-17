import React, { useState, useEffect } from 'react'
import { Quiz } from '@/types/quiz'

export function useGetQuizzes({ courseId }: { courseId: string }) {
  const [fetchingQuizzes, setFetchingQuizzes] = useState<boolean>(false)
  const [courseQuizzes, setQuizzes] = useState<Quiz[]>([])
  const [courseQuizzesNotFound, setCourseQuizzesNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchQuizzes = async () => {
      setFetchingQuizzes(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/quizzes`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseQuizzesNotFound(true)
          }
          throw new Error('Quizzes not found or invalid request')
        }

        const fetchedData = (await res.json()) as Quiz[]
        setQuizzes(fetchedData || [])
      } catch (error) {
        console.error('Error fetching quizzes:', error)
        setCourseQuizzesNotFound(true)
      } finally {
        setFetchingQuizzes(false)
      }
    }

    fetchQuizzes()
  }, [courseId])

  return { fetchingQuizzes, courseQuizzes, setQuizzes, courseQuizzesNotFound }
}

export function useGetQuiz({ courseId, quizId }: { courseId: string; quizId: string }) {
  const [fetchingQuiz, setFetchingQuiz] = useState<boolean>(false)
  const [courseQuiz, setCourseQuiz] = useState<Quiz | null>(null)
  const [quizNotFound, setQuizNotFound] = useState<boolean>(false)
  const [previousQuizId, setPreviousQuizId] = useState<string | null>(null)
  const [nextQuizId, setNextQuizId] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      setFetchingQuiz(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/quizzes/${quizId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setQuizNotFound(true)
          }
          throw new Error('Quiz not found or invalid request')
        }

        const fetchedData = (await res.json()) as {
          courseQuiz: Quiz
          nextQuizId?: string
          previousQuizId?: string
        }

        if (!fetchedData.courseQuiz) {
          setQuizNotFound(true)
          return
        }

        setCourseQuiz(fetchedData.courseQuiz || null)
        setNextQuizId(fetchedData.nextQuizId || null)
        setPreviousQuizId(fetchedData.previousQuizId || null)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        setQuizNotFound(true)
      } finally {
        setFetchingQuiz(false)
      }
    }

    fetchQuiz()
  }, [courseId, quizId])

  return { fetchingQuiz, courseQuiz, setCourseQuiz, nextQuizId, previousQuizId, quizNotFound }
}
