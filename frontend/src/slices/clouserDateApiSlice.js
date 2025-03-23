import { CLOUSER_DATE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const clouserDateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createClouserDate: builder.mutation({
      query: (data) => ({
        url: `${CLOUSER_DATE_URL}`,
        body: data,
        method: 'POST',
        }),
        keepUnusedDataFor: 5,
        invalidatesTags: ['ClouserDate'],
        }),

        updateClosureDate: builder.mutation({
          query: ({ id, data }) => ({
            url: `${CLOUSER_DATE_URL}/${id}`, 
            method: 'PUT',
            body: data,
          }),
          keepUnusedDataFor: 5,
          invalidatesTags: ['ClosureDate'], 
        }),
        
        getLatestClosureDate: builder.query({
          query: () => ({
            url: `${CLOUSER_DATE_URL}/latest`,
          }),
          keepUnusedDataFor: 5,
          providesTags: ['ClosureDate'], 
        }),

        getClouserDate: builder.query({
          query: () => ({
            url: `${CLOUSER_DATE_URL}`,
          }),
          keepUnusedDataFor: 5,
          providesTags: ['ClouserDate'],
        }),
        


    }),
    });

export const {
       useCreateClouserDateMutation,
       useUpdateClosureDateMutation,
       useGetLatestClosureDateQuery,
      useGetClouserDateQuery,
   } = clouserDateApiSlice;