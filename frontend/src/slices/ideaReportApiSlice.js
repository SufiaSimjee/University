import {IDEA_REPORT_URL} from '../constants.js';
import { apiSlice } from './apiSlice';

export const ideaReportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
    
    // Create Idea Report
    createIdeaReport: builder.mutation({
        query: (data) => ({
          url: `${IDEA_REPORT_URL}/create`,
          body: data,
          method: 'POST',
        }),
        invalidatesTags: ['IdeaaReport'],
        keepUnusedDataFor: 5,
      }),

      getReportsByIdeaId: builder.query({
        query: (ideaId) => ({
          url: `${IDEA_REPORT_URL}/${ideaId}`,
          method: 'GET',
        }),
        providesTags: ['IdeaaReport'],
        keepUnusedDataFor: 5,
      }),

    }),
});

export const { useCreateIdeaReportMutation 
               , useGetReportsByIdeaIdQuery
} = ideaReportApiSlice;



 
