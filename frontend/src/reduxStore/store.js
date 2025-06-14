import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import orderSlice from "./orderSlice";
import cartSlice from "./cartSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine your reducers
const reducer = combineReducers({
  auth: authSlice,
  product: productSlice,
  order: orderSlice,
  cart: cartSlice,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
});

export { store };
