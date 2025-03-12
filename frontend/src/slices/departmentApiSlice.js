import { DEPARTMENTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const departmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDepartments: builder.query({
      query: () => ({
        url: DEPARTMENTS_URL,
        method: 'GET',
      }),
      providesTags: ['Department'],
    }),

    getDepartmentById: builder.query({
      query: (departmentId) => ({
        url: `${DEPARTMENTS_URL}/${departmentId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    createDepartment: builder.mutation({
      query: (data) => ({
        url: `${DEPARTMENTS_URL}/create`,
        body: data,
        method: 'POST',
      }),
      invalidatesTags: ['Department'],
    }),

   updateDepartment: builder.mutation({
    query: ({ id, data }) => ({
    url: `${DEPARTMENTS_URL}/${id}`, 
    method: 'PUT',
    body: data, 
  }),
    invalidatesTags: ['Department'],
   }),
   
    deleteDepartment: builder.mutation({
      query: (departmentId) => ({
        url: `${DEPARTMENTS_URL}/${departmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
  }),
});

export const {
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApiSlice;
