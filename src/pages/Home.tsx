import { useEffect, useState } from "react";
import Table from "../components";
import { TProblemsTypes, TResponse } from "../types/type";
import { getProblems } from "../libs/data";

const Home = () => {
    const [params, setParams] = useState<{
        page: number;
        pageSize: number;
    }>({
        page: 1,
        pageSize: 20,
    });

    const [data, setData] = useState<TResponse<TProblemsTypes>>();

    const fetchData = async () => {
        try {
            const result = await getProblems(params);
            result && setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <div>
            {data && <Table data={data} params={params} setParams={setParams} />}
        </div>
    );
};

export default Home;
