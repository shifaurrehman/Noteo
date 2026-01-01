import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { Category } from "../../types";
import { loadCategories, setError, setLoading } from "../slices/categoriesSlice";
import { deleteNotesByCategory } from "../slices/notesSlice";
import {
  createCategoryApi,
  deleteCategoryApi,
  fetchCategoriesApi,
  updateCategoryApi,
} from "../api/categoryApi";

// Load categories from storage
function* loadCategoriesSaga() {
  try {
    yield put(setLoading(true));
    const categories: Category[] = yield call(fetchCategoriesApi);
    yield put(loadCategories(categories));
  } catch (error: any) {
    yield put(setError(error.message || "Failed to load categories"));
  } finally {
    yield put(setLoading(false));
  }
}

// Save category to storage
function* saveCategorySaga(action: PayloadAction<Category>) {
  try {
    yield put(setLoading(true));
    yield call(createCategoryApi, action.payload);
    yield call(loadCategoriesSaga);
  } catch (error: any) {
    console.error("error in saveCategorySaga: ", error)
    yield put(setError(error.message || "Failed to save category"));
  } finally {
    yield put(setLoading(false));
  }
}

// Update category saga
function* updateCategorySaga(action: PayloadAction<{ id: string; updates: Partial<Category> }>) {
  try {
    yield put(setLoading(true));
    yield call(updateCategoryApi, action.payload.id, action.payload.updates);
    yield call(loadCategoriesSaga);
  } catch (error: any) {
    yield put(setError(error.message || "Failed to update category"));
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
    yield call(loadCategoriesSaga);
  } catch (error: any) {
    yield put(setError(error.message || "Failed to delete category"));
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
