import { Middleware } from "@reduxjs/toolkit";
import * as CategoriesActions from "../actions/categoriesActions";

export const offlineMiddleware: Middleware<{}, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  if (!action || typeof action !== "object" || !("type" in action)) {
    return result;
  }

  const apiActionType = CategoriesActions.CATEGORIES_API_MAP[action.type];
  if (!apiActionType) return result;

  const { isConnected } = store.getState().network;
  const { user } = store.getState().auth;

  if (user?.registered && isConnected) {
    store.dispatch({ type: apiActionType, payload: action.payload });
    console.log(`[Offline Middleware] Dispatched ${apiActionType}`);
  } else {
    console.log(`[Offline Middleware] Queued ${action.type} (offline or guest)`);
  }

  return result;
};
