export type TGetParams = {
  page?: number;
  pageSize?: number;
  title?: string;
  difficulty?: string;
  has_checker?: boolean;
};

export type TResponse<T> = {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
};

export type TProblemsTypes = {
  length: number;
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle: string;
  solved: number;
  userInfo: UserInfo;
  authorUsername: AuthorUsername;
  notSolved: number;
  attemptsCount: number;
  hasChecker: boolean;
  tags: Tag[];
  hasSolution: boolean;
  solutionKepcoinValue: number;
  likesCount: number;
  dislikesCount: number;
  hidden: boolean;
};

export enum AuthorUsername {
  Admin = "admin",
}

export interface Tag {
  id: number;
  name: string;
}

export interface UserInfo {
  hasSolved: boolean;
  hasAttempted: boolean;
}
