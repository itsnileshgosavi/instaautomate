import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface AutomationRule {
  id: string;
  userId: string;
  instaUserId: string;
  triggerType: 'message' | 'comment' | 'pvtreply';
  triggerWord: string;
  replyText: string;
  postId?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  refetchOnFocus: true,
  tagTypes: ["Instagram", "Automation", "Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/`
      : "/api/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<any[], void>({
      query: () => ({ url: 'instagram/posts', method: 'GET' }),
      providesTags: ['Posts'],
    }),
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
  useGetPostsQuery,
  useGetAutomationsQuery,
  useCreateAutomationMutation,
  useUpdateAutomationMutation,
  useDeleteAutomationMutation,
} = apiSlice;
