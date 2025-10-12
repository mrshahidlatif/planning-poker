export type User = {
  userId: string;
  userName: string;
  vote: number | "?" | null;
};

export type Vote = number | "?" | null;
