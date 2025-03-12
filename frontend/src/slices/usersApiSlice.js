import {USERS_URL} from '../constants';
import {apiSlice} from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method :'POST',
                body : data,
            }),
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method :'POST',
                body : data,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method :'POST',
            }),
        }),

        getUserProfile: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`,
            }),
            keepUnusedDataFor: 5,
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method :'PUT',
                body : data,
            }),
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`,
            }),
            keepUnusedDataFor: 5,
        }),

        getAllUsersForQa: builder.query({
            query: () => ({
                url: `${USERS_URL}/qa`,
            }),
            keepUnusedDataFor: 5,
        }),

        getAllUsersForQac: builder.query({
            query: () => ({
                url: `${USERS_URL}/qac`,
            }),
            keepUnusedDataFor: 5,
        }) ,

        getUserById: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        })
    })
});

export const {useLoginMutation , 
              useLogoutMutation , 
              useRegisterMutation ,
              useGetUserProfileQuery,
              useUpdateUserMutation, 
              useGetAllUsersQuery , 
              useGetUserByIdQuery , 
              useGetAllUsersForQaQuery , 
              useGetAllUsersForQacQuery
            } = usersApiSlice;