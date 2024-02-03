import { publicAxios } from "../services/publicAxios";
import { TProblemsTypes, TGetParams, TResponse } from "../types/type";

export const getProblems = async ({ page, pageSize }: TGetParams) => {
  try {
    const res = await publicAxios.get<TResponse<TProblemsTypes>>(
      "/api/problems/",
      {
        params: {
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
