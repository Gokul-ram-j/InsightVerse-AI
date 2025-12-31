export type QuizConfig = {
  difficulty: string;
  types: string[];
};

export type SelectedServices = {
  summary: string[];
  quiz: QuizConfig ;
};
