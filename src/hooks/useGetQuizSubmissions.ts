import React, { useState, useEffect } from 'react'
import axios from 'axios'

export function useGetLatestQuizSubmission({ quizId }: { quizId: string }) {
  const [fetchingSubmissions, setFetchingSubmissions] = useState<boolean>(false)
  const [latestSubmission, setLatestSubmission] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const getLatestSubmission = async () => {
      setFetchingSubmissions(true)
      const res = await axios.get(`/api/quizSubmissions?quizId=${quizId}`)
      if (res.status !== 200) throw new Error('Error getting latest submission')
      const fetchedSubmissions = res.data
      setLatestSubmission(fetchedSubmissions)
    }

    getLatestSubmission().finally(() => setFetchingSubmissions(false))
  }, [quizId])

  return { fetchingSubmissions, latestSubmission, setLatestSubmission }
}
