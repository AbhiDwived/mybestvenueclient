import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/blog',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('vendorToken'); // or 'adminToken'
      console.log('Authorization token being used:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => '/getallblogs',
      providesTags: ['Blogs'],
    }),

    searchBlogs: builder.query({
      query: (keyword) => `/search?keyword=${encodeURIComponent(keyword)}`,
      providesTags: ['Blogs'],
    }),

    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/create',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: ['Blogs'],
    }),

    // 🟢 UPDATED
    getBlogById: builder.query({
      query: (id) => `/getblog/${id}`,
      providesTags: ['Blogs'],
    }),

    // 🟢 UPDATED
    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/updateblog/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Blogs'],
    }),

    // 🟢 UPDATED
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/deleteblog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'],
    }),

    getBlogsByCategory: builder.query({
      query: (categoryName) => `/category/${encodeURIComponent(categoryName)}`,
      providesTags: ['Blogs'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllBlogsQuery,
  useSearchBlogsQuery,
  useCreateBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsByCategoryQuery,
} = blogsApi;