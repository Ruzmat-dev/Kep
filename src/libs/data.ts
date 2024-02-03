import { publicAxios } from "../services/publicAxios";
import { TProblemsTypes, TGetParams, TResponse } from "../types/type";

export const getProblems = async ({
  page,
  pageSize,
  title,
  difficulty,
  has_checker,
}: TGetParams) => {
  try {
    const res = await publicAxios.get<TResponse<TProblemsTypes>>(
      "/api/problems/",
      {
        params: {
          title,
          difficulty,
          has_checker,
          page,
          pageSize,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
