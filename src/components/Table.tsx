import { Badge, Box, Card, CircularProgress, Grid } from '@mui/material';
import { DataGrid, GridOverlay, GridColDef } from '@mui/x-data-grid'
import { TProblemsTypes, TResponse } from '../types/type';
import CustomChip from '../@core/components/mui/chip'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';


const Table = ({ data, params, setParams, loading }: {
    data: TResponse<TProblemsTypes>,
    params: {
        page: number;
        pageSize: number;
    },
    setParams: React.Dispatch<React.SetStateAction<{
        page: number;
        pageSize: number;
    }>>,
    loading: boolean
}) => {

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 350,
            filterable: false,
            editable: false,
            disableColumnMenu: true,
            sortable: true,
        },
        {
            field: 'tags',
            headerName: 'Tags',
            width: 400,
            renderCell: params => {
                if (params.value[0]) {
                    return params.value.map((e: { id: number, name: string }, index: number) => {
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
            field: 'difficultyTitle',
            headerName: 'Difficulty',
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
            sortable: true,
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
            sortable: true,
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
            sortable: true,
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
            sortable: true,
        },

    ]

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card sx={{ alignItems: "center", mt: "25px" }}>
                    <div style={{ height: '80vh', width: '100%' }}>
                        <DataGrid
                            loading={loading}
                            rows={data ? data.data : []}
                            slots={{
                                loadingOverlay: () => (
                                    <GridOverlay>
                                        <Box>
                                            <CircularProgress />

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
