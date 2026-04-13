import { Middleware } from "@reduxjs/toolkit";
import * as CategoriesActions from "../actions/categoriesActions";
import * as NotesActions from "../actions/notesActions";
import * as SettingsActions from "../actions/settings-action";

export const offlineMiddleware: Middleware<object, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  if (!action || typeof action !== "object" || !("type" in action)) {
    return result;
  }

  // Check categories, notes and settings API maps
  const apiActionType =
    CategoriesActions.CATEGORIES_API_MAP[action.type] || 
    NotesActions.NOTES_API_MAP[action.type] ||
    SettingsActions.SETTINGS_API_MAP[action.type];
  if (!apiActionType) return result;

  const { isConnected } = store.getState().network;
  const { isAuthenticated } = store.getState().auth;

  if (isConnected && isAuthenticated) {
    store.dispatch({ type: apiActionType, payload: action.payload });
    console.log(`[Offline Middleware] Dispatched ${apiActionType}`);
  } else {
    console.log(`[Offline Middleware] Queued ${action.type} (offline or guest)`);
  }

  return result;
};
