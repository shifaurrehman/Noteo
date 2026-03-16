import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createSagaMiddleware, { AnyAction } from "redux-saga";
import { offlineMiddleware } from "./middleware/offlineMiddleware";
import { rootSaga } from "./sagas/rootSaga";
import authReducer from "./slices/authSlice";
import categoriesReducer from "./slices/categoriesSlice";
import networkReducer from "./slices/networkSlice";
import notesReducer from "./slices/notesSlice";
import settingsReducer from "./slices/settingsSlice";

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine reducers
const appReducer = combineReducers({
  categories: categoriesReducer,
  notes: notesReducer,
  settings: settingsReducer,
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
  whitelist: ["auth", "settings", "categories", "notes"],
  blacklist: ["network"],
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
        warnAfter: 100,
      },
      immutableCheck: {
        warnAfter: 100,
      },
    })
      .concat(sagaMiddleware)
      .concat(offlineMiddleware),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Run root saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
