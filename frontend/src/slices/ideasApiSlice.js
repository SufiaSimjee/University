import { IDEAS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ideasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all ideas
    getAllIdeas: builder.query({
      query: () => ({
        url: `${IDEAS_URL}`,
        method: 'GET',
      }),
      providesTags: ['Ideas'],
    }),

    // Get an idea by ID
      // Get a single idea by ID
      getIdeaById: builder.query({
        query: (ideaId) => ({
          url: `${IDEAS_URL}/${ideaId}`,
          method: 'GET',
        }),
        providesTags: (result, error, ideaId) => [{ type: 'Ideas', id: ideaId }],
      }),

      // Get popular ideas
      getPopularIdeas: builder.query({
        query: () => ({
          url: `${IDEAS_URL}/popular/idea`,
          method: 'GET',
        }),
        providesTags: ['Ideas'],
      }),

      getMostDislikedIdeas: builder.query({
        query: () => ({
          url: `${IDEAS_URL}/dislike/idea`,
          method: 'GET',
        }),
        providesTags: ['Ideas'],
      }),

        // Create a new idea
    createIdea: builder.mutation({
      query: (data) => ({
        url: `${IDEAS_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ideas'],
    }),


    // Delete an idea
    deleteIdea: builder.mutation({
      query: (ideaId) => ({
        url: `${IDEAS_URL}/${ideaId}`,
        method: 'DELETE',
      }),
    }),

    // Create a comment
    createComment: builder.mutation({
      query: ({ ideaId, commentData }) => ({
        url: `${IDEAS_URL}/comments/create/${ideaId}`,
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: ['Ideas'],
    }),

    // Get comments for an idea
    getCommentsByIdeaId: builder.query({
      query: (ideaId) => ({
        url: `${IDEAS_URL}/comments/${ideaId}`,
        method: 'GET',
      }),
    }),

    // Update a comment
    updateComment: builder.mutation({
      query: ({ ideaId, commentId, text }) => ({
        url: `${IDEAS_URL}/comments/${ideaId}/${commentId}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: ['Ideas'],
    }),

    // Delete a comment
    deleteComment: builder.mutation({
      query: ({ ideaId, commentId }) => ({
        url: `${IDEAS_URL}/comments/${ideaId}/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ideas'],
    }),

    // Upvote an idea
    upVoteIdea: builder.mutation({
      query: ({ ideaId, userId }) => ({
        url: `${IDEAS_URL}/upVotes/${ideaId}/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Ideas'],
    }),

   

    // Downvote an idea
    downVoteIdea: builder.mutation({
      query: ({ ideaId, userId }) => ({
        url: `${IDEAS_URL}/downVotes/${ideaId}/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Ideas'],
    }),

    downloadIdeas: builder.mutation({
      query: () => ({
        url: `${IDEAS_URL}/download/export`, 
        method: 'POST',
        responseHandler: (response) => response.blob(), 
      }),
      transformResponse: (response) => response,
    }),
  })
});

export const {
  useCreateIdeaMutation,
  useGetAllIdeasQuery,
  useGetIdeaByIdQuery,
  useDeleteIdeaMutation,
  useCreateCommentMutation,
  useGetCommentsByIdeaIdQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useUpVoteIdeaMutation,
  useDownVoteIdeaMutation,
  useGetPopularIdeasQuery,
  useGetMostDislikedIdeasQuery,
  useDownloadIdeasMutation
 
} = ideasApiSlice;