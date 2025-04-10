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
      keepUnusedDataFor: 5,
      providesTags: ['Ideas'],
    }),

      // Get a single idea by ID
      getIdeaById: builder.query({
        query: (ideaId) => ({
          url: `${IDEAS_URL}/${ideaId}`,
          method: 'GET',
        }),
        keepUnusedDataFor: 5,
        providesTags: (result, error, ideaId) => [{ type: 'Ideas', id: ideaId }],
      }),

      // Get popular ideas
      getPopularIdeas: builder.query({
        query: () => ({
          url: `${IDEAS_URL}/popular/idea`,
          method: 'GET',
        }),
        keepUnusedDataFor: 5,
        providesTags: ['Ideas'],
      }),

      getMostDislikedIdeas: builder.query({
        query: () => ({
          url: `${IDEAS_URL}/dislike/idea`,
          method: 'GET',
        }),
        keepUnusedDataFor: 5,
        providesTags: ['Ideas'],
      }),

        // Create a new idea
    createIdea: builder.mutation({
      query: (data) => ({
        url: `${IDEAS_URL}/create`,
        method: 'POST',
        body: data,
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),


    // Delete an idea
    deleteIdea: builder.mutation({
      query: (id) => ({
        url: `${IDEAS_URL}/${id}`,
        method: 'DELETE',
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),

    // Create a comment
    createComment: builder.mutation({
      query: ({ ideaId, commentData }) => ({
        url: `${IDEAS_URL}/comments/create/${ideaId}`,
        method: 'POST',
        body: commentData,
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),

    // Get comments for an idea
    getCommentsByIdeaId: builder.query({
      query: (ideaId) => ({
        url: `${IDEAS_URL}/comments/${ideaId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Ideas'],
    }),

    // Update a comment
    updateComment: builder.mutation({
      query: ({ ideaId, commentId, text }) => ({
        url: `${IDEAS_URL}/comments/${ideaId}/${commentId}`,
        method: 'PUT',
        body: { text },
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),

    // Delete a comment
    deleteComment: builder.mutation({
      query: ({ ideaId, commentId }) => ({
        url: `${IDEAS_URL}/comments/${ideaId}/${commentId}`,
        method: 'DELETE',
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),

    // Upvote an idea
    upVoteIdea: builder.mutation({
      query: ({ ideaId, userId }) => ({
        url: `${IDEAS_URL}/upVotes/${ideaId}/${userId}`,
        method: 'POST',
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),

    // Downvote an idea
    downVoteIdea: builder.mutation({
      query: ({ ideaId, userId }) => ({
        url: `${IDEAS_URL}/downVotes/${ideaId}/${userId}`,
        method: 'POST',
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ['Ideas'],
    }),
    
    // get all my ideas
    getMyIdeas: builder.query({
      query: () => ({
        url: `${IDEAS_URL}/myideas`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Ideas'],     
    }),
    

    updateIdea: builder.mutation({
      query: ({ ideaId, updatedData }) => ({
        url: `/api/ideas/editidea/${ideaId}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Ideas'],
    }),
    
    // delete idea files by id
    deleteIdeaFilesById: builder.mutation({
      query: (id) => ({
        url: `/api/ideas/delete/idea/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ideas'],
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
  useGetMyIdeasQuery,
  useUpdateIdeaMutation,
  useDeleteIdeaFilesByIdMutation,
} = ideasApiSlice;