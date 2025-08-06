import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
  reducerPath: 'api',
  refetchOnFocus: true,
  tagTypes:["Instagram"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
  }),
  endpoints: (builder) => ({}),
});

