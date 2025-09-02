// src/redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import all your APIs and slices here
import { authApi } from "./apis/authApi";
import { productApi } from "./apis/productApi";
import { shopApi } from "./apis/shopApi";
import { Apiservices } from "./slices/api-service"; // Note: Naming this with 'Api' can be confusing.
import authReducer from "./slices/authSlice"; // Use the default import

// 1. Define the root reducer right here
const rootReducer = combineReducers({
  // Add reducers from your slices
  auth: authReducer,

  // Add the reducers from your RTK Query APIs
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [Apiservices.reducerPath]: Apiservices.reducer,
});

// 2. Configure Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only the 'auth' slice will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }).concat(
      // Add all your API middlewares here
      authApi.middleware,
      productApi.middleware,
      shopApi.middleware,
      Apiservices.middleware
    ),
});

export const persistor = persistStore(store);