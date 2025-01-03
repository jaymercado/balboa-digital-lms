export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  question: string
  type: string
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  answer: string
  isCorrect: boolean
}
