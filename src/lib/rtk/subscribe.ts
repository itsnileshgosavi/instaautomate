import { apiSlice } from "../slices/apiSlice";

export const subscribeApi = apiSlice.injectEndpoints({
  overrideExisting: false,
    endpoints: (builder) => ({
        subscribe: builder.mutation<void, void>({
            query: () => ({
                url: "instagram/subscribe/comments",
                method: "POST",
            }),
        }),
    }),
});

export const { useSubscribeMutation } = subscribeApi;
