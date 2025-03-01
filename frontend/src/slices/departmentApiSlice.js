import { DEPARTMENTS_URL } from '../constants';
import { apiSlice } from './apiSlice';  

export const departmentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartments: builder.query({
            query: () => ({
                url: DEPARTMENTS_URL,
                method: 'GET',
            }),
        }), 
    }),
});

export const {
    useGetDepartmentsQuery,
} = departmentsApiSlice;
