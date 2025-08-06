import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface AutomationRule {
  id: string;
  userId: string;
  instaUserId: string;
  triggerType: 'message' | 'comment';
  triggerWord: string;
  replyText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  refetchOnFocus: true,
  tagTypes: ["Instagram", "Automation"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
  }),
  endpoints: (builder) => ({
    getAutomations: builder.query<AutomationRule[], void>({
      query: () => ({ url: 'automation', method: 'GET' }),
      providesTags: ['Automation'],
    }),
    createAutomation: builder.mutation<AutomationRule, Partial<AutomationRule>>({
      query: (body) => ({ url: 'automation', method: 'POST', body }),
      invalidatesTags: ['Automation'],
    }),
    updateAutomation: builder.mutation<AutomationRule, { id: string; data: Partial<AutomationRule> }>({
      query: ({ id, data }) => ({ url: `automation/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Automation'],
    }),
    deleteAutomation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `automation/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Automation'],
    }),
  })
});

export const {
  useGetAutomationsQuery,
  useCreateAutomationMutation,
  useUpdateAutomationMutation,
  useDeleteAutomationMutation,
} = apiSlice;
