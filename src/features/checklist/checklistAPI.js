import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const checklistApi = createApi({
  reducerPath: 'checklistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Checklist'],
  endpoints: (builder) => ({
    // Get user's checklist
    getUserChecklist: builder.query({
      query: () => ({
        url: '/checklist',
        method: 'GET',
      }),
      providesTags: ['Checklist'],
    }),

    // Add a new task
    addChecklistTask: builder.mutation({
      query: (task) => ({
        url: '/checklist/task',
        method: 'POST',
        body: { task },
      }),
      invalidatesTags: ['Checklist'],
    }),

    // Toggle task completion status
    toggleTaskCompletion: builder.mutation({
      query: (taskId) => ({
        url: `/checklist/task/${taskId}/toggle`,
        method: 'PUT',
      }),
      invalidatesTags: ['Checklist'],
    }),

    // Delete a task
    deleteChecklistTask: builder.mutation({
      query: (taskId) => ({
        url: `/checklist/task/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Checklist'],
    }),
  }),
});

export const {
  useGetUserChecklistQuery,
  useAddChecklistTaskMutation,
  useToggleTaskCompletionMutation,
  useDeleteChecklistTaskMutation,
} = checklistApi; 