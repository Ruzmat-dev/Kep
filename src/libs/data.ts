import { publicAxios } from "../services/publicAxios";
import { TProblemsTypes, TGetParams, TResponse } from "../types/type";

export const getProblems = async ({
  page,
  pageSize,
  title,
  difficulty,
}: TGetParams) => {
  try {
    const res = await publicAxios.get<TResponse<TProblemsTypes>>(
      "/api/problems/",
      {
        params: {
          title,
          difficulty,
          page,
          pageSize,
        },
      }
    );
    console.log(res.data);

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
