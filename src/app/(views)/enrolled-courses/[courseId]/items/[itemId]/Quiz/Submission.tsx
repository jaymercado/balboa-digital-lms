'use client'

import React from 'react'
import { CRow } from '@coreui/react-pro'
import { Loading } from '@/components'
import { calculateQuestionPoints, calculateQuizScore } from '@/utils/calculateQuizScore'

export default function Submission({
  fetchingSubmissions,
  latestSubmission,
  courseQuiz,
}: {
  fetchingSubmissions: boolean
  latestSubmission: any
  courseQuiz: any
}) {
  const score = calculateQuizScore(courseQuiz?.questions, latestSubmission?.submissionAnswers)

  if (fetchingSubmissions) return <Loading />

  return (
    <CRow>
      <p>Last Submission: {latestSubmission?.createdAt}</p>
      <p>Total Score: {score}/100</p>

      {courseQuiz?.questions?.map((question: any, index: any) => {
        const correctOptions = question.options.filter((option: any) => option.isCorrect)
        const studentAnswers = latestSubmission?.submissionAnswers.filter(
          (answer: any) => answer.quizQuestionId === question.id,
        )
        const points = calculateQuestionPoints(question, studentAnswers)

        return (
          <div key={question.id}>
            <p className="text-primary">
              <strong>Question {index + 1}</strong>
            </p>
            <p>Question: {question.question}</p>
            <p>
              Answer:{' '}
              {studentAnswers.map(
                (answer: any, index: any) =>
                  `${answer.questionOptions.option}${
                    index === studentAnswers.length - 1 ? '' : ', '
                  }`,
              )}
            </p>
            <p>
              Correct Answer:{' '}
              {correctOptions.map(
                (option: any, index: any) =>
                  `${option.option}${index === correctOptions.length - 1 ? '' : ', '}`,
              )}
            </p>
            <p>Points: {points}/100</p>
            <br />
            <br />
          </div>
        )
      })}
    </CRow>
  )
}
