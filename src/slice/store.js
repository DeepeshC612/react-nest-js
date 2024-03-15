import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "./auth/auth.slices";

const RootReducer = combineReducers({
  auth: authReducer,
});

const encryptor = encryptTransform({
  secretKey: "deep-storage",
  onError: (error) => {
    console.log(error);
  },
});

const persistConfig = {
  key: "deep",
  storage,
  whitelist: ["auth"], // Only persist the "auth" slice of the state
  transforms: [encryptor], // Apply encryption transform to persisted data
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure middleware to ignore certain actions during serialization
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // devTools: "" !== "production", // Enable Redux DevTools in development
});

export default store;

export const Persistor = persistStore(store);
