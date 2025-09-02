// In src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { productApi } from "./apis/productApi";
import { shopApi } from "./apis/shopApi"; // <-- 1. IMPORT shopApi
import authSlice from "./slices/authSlice"; // Example

export const rootReducers = combineReducers({
  auth: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  
  // vvv 2. ADD THIS LINE vvv
  [shopApi.reducerPath]: shopApi.reducer,
});