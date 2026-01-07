import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware, { AnyAction } from "redux-saga";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootSaga } from "./sagas/rootSaga";
import { apiSlice } from "./api/apiSlice";
import categoriesReducer from "./slices/categoriesSlice";
import notesReducer from "./slices/notesSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import networkReducer from "./slices/networkSlice";

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine reducers
const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  categories: categoriesReducer,
  notes: notesReducer,
  theme: themeReducer,
  auth: authReducer,
  network: networkReducer,
});

// Root reducer wrapper to handle global reset on logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

// Configure persistence (excluding API cache)
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: ["auth", "theme", "categories", "notes"],
  blacklist: [apiSlice.reducerPath, "network"],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(apiSlice.middleware)
      .concat(sagaMiddleware),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Run root saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
