import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_API_BASEURL,
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (formData) => ({
                url: '/product/addProduct',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Product'],
        }),
        getAllProducts: builder.query({
            query: ({ page = 1, limit = 10, search = "", sortOrder = "desc" }) =>
                `product/getAllProducts?page=${page}&limit=${limit}&search=${search}&sortOrder=${sortOrder}`,
        }),
        // In your productApi.js or wherever your API slice is defined
        getProductById: builder.query({
            query: (id) => `/product/getProductById/${id}`,
        }),
        updateProductById: builder.mutation({
            query: ({ id, data }) => ({
                url: `/product/updateProduct/${id}`,
                method: "PUT",
                body: data,
                formData: true, // Important for file uploads
            }),
        }),
        deleteProductById: builder.mutation({
            query: (id) => ({
                url: `/product/deleteProduct/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ['Product'],
        }),



    }),
});

export const { useAddProductMutation, useGetAllProductsQuery, useGetProductByIdQuery,
    useUpdateProductByIdMutation,useDeleteProductByIdMutation
} = productApi;
