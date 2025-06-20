import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetApi = createApi({
  reducerPath: 'budgetApi',
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
  tagTypes: ['Budget'],
  endpoints: (builder) => ({
    // Get user's budget
    getUserBudget: builder.query({
      query: () => ({
        url: '/budget',
        method: 'GET',
      }),
      providesTags: ['Budget'],
    }),

    // Add a budget item
    addBudgetItem: builder.mutation({
      query: (itemData) => ({
        url: '/budget/item',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Update a budget item
    updateBudgetItem: builder.mutation({
      query: ({ itemId, itemData }) => ({
        url: `/budget/item/${itemId}`,
        method: 'PUT',
        body: itemData,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Delete a budget item
    deleteBudgetItem: builder.mutation({
      query: (itemId) => ({
        url: `/budget/item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budget'],
    }),
  }),
});

export const {
  useGetUserBudgetQuery,
  useAddBudgetItemMutation,
  useUpdateBudgetItemMutation,
  useDeleteBudgetItemMutation,
} = budgetApi; 