import { Middleware } from "@reduxjs/toolkit";
import * as CategoriesActions from "../actions/categoriesActions";
import * as NotesActions from "../actions/notesActions";

export const offlineMiddleware: Middleware<object, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  if (!action || typeof action !== "object" || !("type" in action)) {
    return result;
  }

  // Check both categories and notes API maps
  const apiActionType =
    CategoriesActions.CATEGORIES_API_MAP[action.type] || NotesActions.NOTES_API_MAP[action.type];
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
