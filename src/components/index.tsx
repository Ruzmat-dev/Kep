import { Badge, Box, Card, CircularProgress, Grid } from '@mui/material';
import { DataGrid, GridOverlay, GridColDef } from '@mui/x-data-grid'
import { TProblemsTypes, TResponse } from '../types/type';
import CustomChip from '../../src/@core/components/mui/chip'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useEffect, useState } from 'react';
import { getProblems } from '../libs/data';

const Table = () => {
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
    }, [params]);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'title',
            headerName: 'title',
            width: 400,
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'difficultyTitle',
            headerName: 'difficulty',
            width: 150,
            filterable: false,
            renderCell: (params) => {
                const color = params.value === 'Basic' ? 'primary' : params.value === 'Medium' ? 'info' : params.value === 'Hard' ? 'warning' : params.value === 'Advanced' ? 'success' : 'error'
                return <CustomChip label={params.value} color={color} />
            },

            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'tags',
            headerName: 'tags',
            width: 400,
            renderCell: params => {
                if (params.value[0]) {
                    return params.value.map((e: { id: number, name: string }, index: number) => {
                        // Add your condition to change color dynamically
                        const color = e.name == 'Google' ? 'error' : e.name == 'IQ' ? 'success' : e.name == 'Math' ? 'info' : 'primary';
                        return <CustomChip label={e.name} color={color} key={index} sx={{ ml: 0.3 }} />;
                    });
                } else {
                    return <CustomChip label='not tags' skin='light' color='error' sx={{ ml: 0.3 }} />;
                }
            },


            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'likesCount',
            headerName: 'Likes',
            width: 55,
            renderCell: (params) => (
                <Badge badgeContent={params.value} color='success' sx={{ width: 0, p: 0 }}>
                    <ThumbUpIcon sx={{ height: 20, width: 20, }} />
                </Badge>
            ),
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'dislikesCount',
            headerName: 'Dislikes',
            width: 150,
            renderCell: (params) => (
                <Badge badgeContent={params.value} color='error' sx={{ width: 0, p: 0 }}>
                    <ThumbDownAltIcon sx={{ height: 23, width: 25, }} />
                </Badge>
            ),
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'solved',
            headerName: 'Solved',
            width: 100,
            renderCell: (params) => (

                <CustomChip rounded label={params.value} skin='light' color='success' />
            ),
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },
        {
            field: 'notSolved',
            headerName: 'notSolved',
            width: 100,
            renderCell: (params) => (

                <CustomChip rounded label={params.value} skin='light' color='error' />
            ),
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        },

    ]

    const isLoading: boolean = false

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card sx={{ alignItems: "center", mt: "25px" }}>
                    <div style={{ height: '90vh', width: '100%' }}>
                        <DataGrid
                            loading={isLoading}
                            rows={data ? data.data : []}
                            slots={{
                                loadingOverlay: () => (
                                    <GridOverlay>
                                        <Box>
                                            <CircularProgress />
                                            {''}
                                        </Box>
                                    </GridOverlay>
                                ),
                                noRowsOverlay: () => <GridOverlay> No Data</GridOverlay>,
                                noResultsOverlay: () => (
                                    <GridOverlay>
                                        <Box>No data</Box>
                                    </GridOverlay>
                                )
                            }}
                            density='compact'
                            columns={columns}
                            rowCount={data ? data.total : 0}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: params.page - 1, pageSize: params.pageSize }
                                }
                            }}

                            pageSizeOptions={[20]}
                            paginationMode='server'
                            paginationModel={{ page: params.page - 1, pageSize: params.pageSize }}
                            onPaginationModelChange={(e) => {
                                console.log('Pagination Model Change:', e);
                                setParams({ ...params, page: e.page + 1, pageSize: e.pageSize });
                            }}
                        />
                    </div>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Table;
