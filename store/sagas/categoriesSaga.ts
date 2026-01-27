import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { loadCategories, setError, setLoading, updateCategorySyncStatus } from "../slices/categoriesSlice";
import { deleteNotesByCategory } from "../slices/notesSlice";

import {
  createCategoryApi,
  deleteCategoryApi,
  fetchCategoriesApi,
  updateCategoryApi,
} from "@/services/api/services/categoriesService";
import { CategoryApi, SYNC_STATUS } from "@/types/category/category.types";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { showErrorToast, showInfoToast } from "@/utilities/toast/message-toast";

// Load categories from storage
function* loadCategoriesSaga() {
  try {
    yield put(setLoading(true));
    const categories: CategoryApi[] = yield call(fetchCategoriesApi);
    yield put(loadCategories(categories));
    showInfoToast({ message: "categories loaded successfully" });
  } catch (error: any) {
    console.error("error in loadCategoriesSaga: ", error);
    const message = getErrorMessage(error) || "Failed to load categories";
    showErrorToast({ message: message });
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Save category to storage
function* saveCategorySaga(action: PayloadAction<CategoryApi>) {
  try {
    yield put(setLoading(true));
    yield call(createCategoryApi, action.payload);
    yield put(updateCategorySyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.SYNCED }));
    showInfoToast({ message: "category added successfully" });
  } catch (error: any) {
    console.error("error in saveCategorySaga: ", error);
    const message = getErrorMessage(error) || "Failed to save category";
    showErrorToast({ message: message });
    yield put(updateCategorySyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Update category saga
function* updateCategorySaga(action: PayloadAction<{ id: string; updates: Partial<CategoryApi> }>) {
  try {
    yield put(setLoading(true));
    yield call(updateCategoryApi, action.payload.id, action.payload.updates);
    showInfoToast({ message: "category updated successfully" });
  } catch (error: any) {
    console.error("error in updateCategorySaga: ", error);
    const message = getErrorMessage(error) || "Failed to update category";
    showErrorToast({ message: message });
    yield put(updateCategorySyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Delete category saga
function* deleteCategorySaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield call(deleteCategoryApi, action.payload);
    yield put(deleteNotesByCategory(action.payload));
    showInfoToast({ message: "category deleted successfully" });
  } catch (error: any) {
    console.error("error in deleteCategorySaga: ", error);
    const message = getErrorMessage(error) || "Failed to delete category";
    showErrorToast({ message: message });
    yield put(updateCategorySyncStatus({ id: action.payload, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher sagas
export function* watchLoadCategories() {
  yield takeEvery("categories/fetchCategories", loadCategoriesSaga);
}

export function* watchAddCategory() {
  yield takeEvery("categories/addCategory", saveCategorySaga);
}

export function* watchUpdateCategory() {
  yield takeEvery("categories/updateCategory", updateCategorySaga);
}

export function* watchDeleteCategory() {
  yield takeEvery("categories/deleteCategory", deleteCategorySaga);
}
