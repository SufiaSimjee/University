import { STATISTICS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNumberofIdeasByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getNumberOfIdeasByDepartment`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    
    getPercentageOfIdeasByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getpercentageofideasbydepartment`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    
    getContributorsByDepartment: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getnumberofcontributorsbydepartment`, 
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),

    getAnonymousIdeasAndComments: builder.query({
      query: () => ({
        url: `${STATISTICS_URL}/getanonymousideasandcomments`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    })
    
  }),
});

export const { useGetNumberofIdeasByDepartmentQuery ,
               useGetPercentageOfIdeasByDepartmentQuery,
               useGetContributorsByDepartmentQuery,
               useGetAnonymousIdeasAndCommentsQuery
             } = reportApiSlice;