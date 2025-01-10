export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id?: string
  question: string
  type: string
  options: QuizOption[]
}

export interface QuizOption {
  id?: string
  option: string
  isCorrect: boolean
}
