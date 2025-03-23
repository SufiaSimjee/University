import { STATISTICS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNumberofIdeasByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getNumberOfIdeasByDepartment`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),
    
    getPercentageOfIdeasByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getpercentageofideasbydepartment`,
        method: 'GET',
      }),
     keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),
    
    getContributorsByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getnumberofcontributorsbydepartment`, 
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getAnonymousIdeasAndComments: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getanonymousideasandcomments`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getIdeasWithAndWithoutComments: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getideaswithandwithoutcomments`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getCategoryCount: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getcategorycount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getDepartmentCount: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getdepartmentcount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }) , 

    getNonAnonymousIdeasCount: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getnonanonymousideascount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getAnonymousIdeasCount: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getanonymousideascount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getUserIdeasCount : builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getuserideascount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    }),

    getdepartmentusercount : builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getdepartmentusercount`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Report'],
    })
  }),
});

export const { useGetNumberofIdeasByDepartmentQuery ,
               useGetPercentageOfIdeasByDepartmentQuery,
               useGetContributorsByDepartmentQuery,
               useGetAnonymousIdeasAndCommentsQuery,
               useGetIdeasWithAndWithoutCommentsQuery,
               useGetCategoryCountQuery,
               useGetDepartmentCountQuery,
               useGetNonAnonymousIdeasCountQuery,
               useGetAnonymousIdeasCountQuery,
               useGetUserIdeasCountQuery,
               useGetdepartmentusercountQuery
             } = reportApiSlice;