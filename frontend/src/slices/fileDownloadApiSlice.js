import { FILE_DOWNLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const fileDownloadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    downloadAllFilesAsZip: builder.mutation({
      query: () => ({
        url: `${FILE_DOWNLOAD_URL}/downloadzip`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
     
    }),

     downloadcsv: builder.mutation({
      query: () => ({
    url: `${FILE_DOWNLOAD_URL}/downloadcsv`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),

    downloadcategorycsv: builder.mutation({
      query: () => ({
    url: `${FILE_DOWNLOAD_URL}/downloadcategorycsv`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),

    downloaddepartmentcsv: builder.mutation({
      query: () => ({
    url: `${FILE_DOWNLOAD_URL}/downloaddepartmentcsv`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),

    downloadusercsvforadmin: builder.mutation({
      query: () => ({
      url: `${FILE_DOWNLOAD_URL}/downloadusercsvforadmin`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),

    downloadusercsvforqa: builder.mutation({
      query: () => ({
      url: `${FILE_DOWNLOAD_URL}/downloadusercsvforqa`,
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),


  }),
});

export const { useDownloadAllFilesAsZipMutation, 
               useDownloadcsvMutation,
               useDownloadcategorycsvMutation,
               useDownloaddepartmentcsvMutation,
               useDownloadusercsvforadminMutation,
               useDownloadusercsvforqaMutation,
             } =
            fileDownloadApiSlice;
