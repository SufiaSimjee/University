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
    }),
    updateCategory: builder.mutation({
      query: (categoryId , data) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'DELETE',
      }),
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
