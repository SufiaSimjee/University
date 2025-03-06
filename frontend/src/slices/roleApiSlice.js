import { ROLES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => ({
        url: ROLES_URL,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAllRolesQuery, 
} = rolesApiSlice;
