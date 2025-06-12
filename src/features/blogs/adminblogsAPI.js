import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/admin/blog',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('vendorToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => '/getallblogs',
      providesTags: (result) =>
        result
          ? [
              ...result.blogs.map(({ _id }) => ({ type: 'Blog', id: _id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
      // ✅ Remove transformResponse - use data as-is
    }),

    searchBlogs: builder.query({
      query: (keyword) => `/search?keyword=${encodeURIComponent(keyword)}`,
      providesTags: ['Blog'],
      // ✅ Remove transformResponse
    }),

    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/create',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    getBlogById: builder.query({
      query: (id) => `/getblog/${id}`,
      // ✅ Remove transformResponse
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/updateblog/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/deleteblog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    getBlogsByCategory: builder.query({
      query: (categoryName) => `/category/${encodeURIComponent(categoryName)}`,
      providesTags: ['Blog'],
      // ✅ Remove transformResponse
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useSearchBlogsQuery,
  useCreateBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsByCategoryQuery,
} = blogsApi;