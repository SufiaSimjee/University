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

        registerForManager: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/add`,
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
        
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method :'PUT',
                body : data,
            }),
            invalidatesTags: ['User'],
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`,
            }),
            keepUnusedDataFor: 5,
            providesTags: [{ type: 'User', id: 'ALL' }],
        }),

        getAllUsersForQa: builder.query({
            query: () => ({
                url: `${USERS_URL}/qa`,
            }),
            keepUnusedDataFor: 5,
            providesTags: [{ type: 'User', id: 'qa' }],
        }),

        getAllUsersForQac: builder.query({
            query: () => ({
                url: `${USERS_URL}/qac`,
            }),
            keepUnusedDataFor: 5,
            providesTags: [{ type: 'User', id: 'qac' }],
        }) ,

        getUserById: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['User'],
        }) ,

        deleteUser: builder.mutation({
            query: (id) => ({
              url: `${USERS_URL}/${id}`,
              method: 'DELETE',
            }),
            invalidatesTags: ['User'],
          }),

        updateUserForManager: builder.mutation({
            query: (data) => ({
              url: `${USERS_URL}/update/${data.id}/manager`,
              method: 'PUT',
              body: data,
            }),
            invalidatesTags: [
                { type: 'User', id: 'ALL' },   
                { type: 'User', id: 'qa' },    
                { type: 'User', id: 'qac' },  
            ],
          }),

          forgotPassword: builder.mutation({
            query: (email) => ({
              url: `${USERS_URL}/forgotPassword`,
              method: 'POST',
              body: { email },
            }),
          }),
      
          resetPassword: builder.mutation({
            query: (data) => ({
              url: `${USERS_URL}/resetPassword`,
              method: 'POST',
              body: data,
            }),
          }),
    })
});

export const {useLoginMutation , 
              useLogoutMutation , 
              useRegisterMutation ,
              useUpdateUserMutation ,    
              useGetAllUsersQuery , 
              useGetUserByIdQuery , 
              useGetAllUsersForQaQuery , 
              useGetAllUsersForQacQuery,
              useDeleteUserMutation ,
              useRegisterForManagerMutation,
              useUpdateUserForManagerMutation,
              useForgotPasswordMutation,
              useResetPasswordMutation,
            } = usersApiSlice;