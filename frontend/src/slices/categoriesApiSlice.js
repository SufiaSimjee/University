import { CATEGORIES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}/create`,
        body: data,
        method: 'POST',
      }),
      invalidatesTags: ['Category'],
    }),
    
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApiSlice;
