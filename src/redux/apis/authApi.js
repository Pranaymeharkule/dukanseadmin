import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_API_BASEURL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token; // ✅ Corrected path
            console.log("TOKEN SENDING from authapii.jss:", token);

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "/admin/login",
                method: "POST",
                body: data,
            }),
        }),
        getAdminProfile: builder.query({
            query: () => ({
                url: "/admin/getProfile",
                method: "GET",
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/admin/forgotPassword",
                method: "POST",
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: ({ email, otp }) => ({
                url: "/admin/verifyOTP",
                method: "POST",
                body: { email, otp },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ email, newPassword, confirmPassword }) => ({
                url: "/admin/resetPassword",
                method: "POST",
                body: {
                    email,
                    newPassword,
                    confirmPassword,
                },
            }),
        }),
        logoutAdmin: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST",
            }),
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: '/admin/updateProfile', // 👈  endpoint
                method: 'PUT',
                body: profileData,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const { useLoginAdminMutation, useGetAdminProfileQuery, useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation, useLogoutAdminMutation, useUpdateProfileMutation } = authApi;
