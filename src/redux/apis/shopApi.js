import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_API_BASEURL, // Ensure env is set
  }),
  tagTypes: ["Shop", "ApprovedShop", "NewShop"],

  endpoints: (builder) => ({
    // 1. GET New Registered Shops
    getNewRegisteredShops: builder.query({
      query: () => "/shopApproval/getNewRegisterShops",
      transformResponse: (response) => response?.newRegisterdShops || [],
      providesTags: ["NewShop"],
    }),

    // 2. GET Approved Shops (with filters)
    getAllApprovedShops: builder.query({
      query: (params) => ({
        url: "/shopApproval/getAllApprovedShops",
        params,
      }),
      providesTags: ["ApprovedShop"],
    }),

    // 3. GET single Approved Shop by ID
    getApprovedShopById: builder.query({
      query: (shopId) => `/shopApproval/getApprovedShopById/${shopId}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "ApprovedShop", id }],
    }),

    // 4. Approve a Shop
    approveShop: builder.mutation({
      query: ({ shopId }) => ({
        url: `/shopApproval/approve-shop/${shopId}`,
        method: "PUT",
        body: { shopStatus: "approved" }, // ✅ Ensure backend expects this
      }),
      invalidatesTags: ["NewShop", "ApprovedShop"],
    }),

    // 5. Update Approved Shop Details
    updateApprovedShopDetails: builder.mutation({
      query: ({ shopId, body }) => ({
        url: `/shopApproval/updateApprovedShopDetails/${shopId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ApprovedShop", id: arg.shopId },
      ],
    }),

    // 6. Delete Approved Shop
    deleteApprovedShop: builder.mutation({
      query: (shopId) => ({
        url: `/shopApproval/deleteApprovedShop/${shopId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApprovedShop"],
    }),

    // 7. Delete New Shop
    deleteNewShop: builder.mutation({
      query: (shopId) => ({
        url: `/shopApproval/deleteNewRegisterShop/${shopId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NewShop"],
    }),
  }),
});

export const {
  useGetNewRegisteredShopsQuery,
  useGetAllApprovedShopsQuery,
  useGetApprovedShopByIdQuery,
  useApproveShopMutation,
  useUpdateApprovedShopDetailsMutation,
  useDeleteApprovedShopMutation,
  useDeleteNewShopMutation,
} = shopApi;
