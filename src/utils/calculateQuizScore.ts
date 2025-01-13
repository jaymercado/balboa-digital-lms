export function calculateQuestionPoints(question: any, studentAnswers: any[]) {
  const correctOptions = question.options.filter((option: any) => option.isCorrect)
  const totalCorrectOptions = correctOptions.length
  const correctAnswersCount = [...studentAnswers]?.filter(
    (answer: any) => answer?.questionOptions?.isCorrect,
  ).length
  const incorrectAnswersCount = [...studentAnswers]?.filter(
    (answer: any) => !answer?.questionOptions?.isCorrect,
  ).length
  const pointsPerOption = 100 / totalCorrectOptions
  const points = pointsPerOption * correctAnswersCount - pointsPerOption * incorrectAnswersCount
  return Math.max(0, points)
}

export function calculateQuizScore(courseQuestions: any[], submissionAnswers: any[]) {
  const quizPoints = courseQuestions?.length * 100
  const totalPoints = courseQuestions?.reduce((total: number, question: any) => {
    const studentAnswers = submissionAnswers.filter(
      (answer: any) => answer.quizQuestionId === question.id,
    )
    return total + calculateQuestionPoints(question, studentAnswers)
  }, 0)
  return ((totalPoints * 100) / quizPoints)?.toFixed(0)
}
