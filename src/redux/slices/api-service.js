// src/services/api-service.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_API_BASEURL,

    credentials: "include", // for cookies
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        console.log("token here from api-services", token);
        if (token) {

            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const Apiservices = createApi({
    reducerPath: "apiservices",
    baseQuery,
    tagTypes: ["Admin"], // helpful for cache invalidation
    endpoints: (builder) => ({}), // for later
});
