import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";


export const apiSlice = createApi({baseQuery: fetchBaseQuery({}),
  endpoints: () => ({}),
});

