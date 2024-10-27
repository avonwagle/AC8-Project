// types.ts
export interface Answer {
  id: number;
  user: string;
  text: string;
}

export interface Thread {
  id: number;
  user: string;
  text: string;
  answers: Answer[];
}
