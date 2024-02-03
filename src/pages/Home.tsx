import { useEffect, useState } from "react";
import Table from "../components";
import { getProblems } from "../libs/data";
import { TProblemsTypes, TResponse } from "../types/type";
import { Autocomplete, Box, TextField } from "@mui/material";

const Home = () => {
    const [params, setParams] = useState<{
        page: number;
        pageSize: number;
        title?: string;
        difficulty?: string
    }>({
        page: 1,
        pageSize: 20,
    });

    const [data, setData] = useState<TResponse<TProblemsTypes>>();
    const [term, setTerm] = useState<string | undefined>()
    const [difficulty, setDifficulty] = useState<string | undefined>()
    const fetchData = async () => {
        try {
            const result = await getProblems(params);
            result && setData(result);
            console.log(result);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = async (term: string) => {
        setTerm(term)
        try {
            setParams({
                page: 1,
                pageSize: params.pageSize,
                title: term,
                difficulty: difficulty
            });

            await fetchData();
        } catch (error) {
            console.error("Error searching data:", error);
        }
    };

    const handleChangeOption = async (value: { id: string; title: string } | null) => {
        setDifficulty(value ? value.id : undefined)
        try {
            setParams({
                page: 1,
                pageSize: params.pageSize,
                title: term,
                difficulty: value ? value.id : undefined,
            });

            await fetchData();
        } catch (error) {
            console.error("Error searching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [params]);

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => handleSearch(e.target.value)} />

                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option.title}
                    onChange={(_, value) => handleChangeOption(value)}
                    renderInput={(params) => <TextField {...params} label='search by difficulty' />}
                />
            </Box>

            {data && <Table data={data} params={params} setParams={setParams} />}
        </div>
    );
};

export default Home;

const options: { id: string, title: string }[] = [
    {
        id: '1',
        title: 'Beginner'
    },
    {
        id: '2',
        title: 'Basic'
    },
    {
        id: '3',
        title: 'Normal'
    },
    {
        id: '4',
        title: 'Medium'
    },
    {
        id: '5',
        title: 'Advanced'
    },
    {
        id: '6',
        title: 'Hard'
    },
];
