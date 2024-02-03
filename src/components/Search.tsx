import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TProblemsTypes } from '../types/type';

export default function SearchTable({ data }: { data: TProblemsTypes[] }) {


    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: 300 }}
            getOptionLabel={(problem) => problem.title}
            renderInput={(params) => <TextField {...params} label='sa' />}
        />


    );
}

