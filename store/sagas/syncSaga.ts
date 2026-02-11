import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { Category, CategoryApi, SYNC_STATUS } from "@/types/category/category.types";
import { showErrorToast, showInfoToast } from "@/utilities/toast/message-toast";
import { call, put, select } from "redux-saga/effects";
import { v4 as uuidv4 } from "uuid";
import {
  deleteCategory,
  markCategoryAsSynced,
  updateCategory,
  updateCategorySyncStatus,
} from "../slices/categoriesSlice";
import { RootState } from "../store";


export function* syncPendingCategoriesSaga() {
  try {
    console.log("[Sync Saga] Starting smart sync of categories...");

    // 1. Combine PENDING + ERROR categories from Redux
    const state: RootState = yield select();
    const categories: Category[] = state.categories.categories;
    const categoriesToSync = categories.filter(
      (cat: Category) => cat.syncStatus === SYNC_STATUS.PENDING || cat.syncStatus === SYNC_STATUS.ERROR
    );

    if (categoriesToSync.length === 0) {
      console.log("[Sync Saga] No categories to sync");
      return;
    }

    console.log(`[Sync Saga] Found ${categoriesToSync.length} categories to validate and sync`);

    const validCategories: Category[] = [];

    // 2 & 3. Validate required fields and auto-fill or mark as ERROR
    for (const category of categoriesToSync) {
      let currentCategory = { ...category };
      let isRecoverable = true;

      // Validate/Auto-fill ID (required)
      if (!currentCategory.id || currentCategory.id.trim() === "") {
        if (currentCategory.isLocal) {
          const newId = uuidv4();
          console.log(`[Sync Saga] Auto-filling missing ID for local category: ${newId}`);
          yield put(updateCategory({ id: category.id, updates: { id: newId } }));
          currentCategory.id = newId;
        } else {
          console.error(`[Sync Saga] Category ${category.id} is missing ID and is not local.`);
          isRecoverable = false;
        }
      }

      // Validate Name (required)
      if (!currentCategory.name || currentCategory.name.trim() === "") {
        console.error(`[Sync Saga] Category ${category.id} is missing required field: name`);
        isRecoverable = false;
      }

      if (isRecoverable) {
        validCategories.push(currentCategory);
      } else {
        console.warn(`[Sync Saga] Category ${category.id} is irrecoverable. Marking as ERROR.`);
        yield put(updateCategorySyncStatus({ id: category.id, syncStatus: SYNC_STATUS.ERROR }));
      }
    }

    if (validCategories.length === 0) {
      console.log("[Sync Saga] No valid categories to sync after validation");
      return;
    }

    // 4. Prepare batch payload
    const created: CategoryApi[] = [];
    const updated: CategoryApi[] = [];
    const deleted: { id: string }[] = [];

    for (const category of validCategories) {
      if (category.isDeleted) {
        if (category.isLocal) {
          // If it was never synced, just delete it locally
          yield put(deleteCategory(category.id));
        } else {
          deleted.push({ id: category.id });
        }
      } else if (category.isLocal) {
        created.push(category);
      } else {
        updated.push(category);
      }
    }

    // If there's nothing to sync to server
    if (created.length === 0 && updated.length === 0 && deleted.length === 0) {
      return;
    }

    // 5. Call batch sync API
    try {
      yield call(syncCategoriesApi, { created, updated, deleted });
      console.log(
        `[Sync Saga] Successfully synced: ${created.length} created, ${updated.length} updated, ${deleted.length} deleted`
      );

      // Mark items as SYNCED
      for (const cat of created) {
        yield put(markCategoryAsSynced({ id: cat.id, isLocal: false }));
      }
      for (const cat of updated) {
        yield put(markCategoryAsSynced({ id: cat.id }));
      }
      for (const item of deleted) {
        yield put(markCategoryAsSynced({ id: item.id }));
      }

      showInfoToast({ message: "Categories synced successfully" });
    } catch (error: any) {
      console.error("[Sync Saga] Batch sync failed:", error);
      showErrorToast({ message: "Failed to sync categories with server" });

      // 5c. Mark all items in the failed batch as ERROR
      for (const cat of created)
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const cat of updated)
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const item of deleted)
        yield put(updateCategorySyncStatus({ id: item.id, syncStatus: SYNC_STATUS.ERROR }));
    }
  } catch (error: any) {
    console.error("[Sync Saga] Unexpected error in syncPendingCategoriesSaga:", error);
    showErrorToast({ message: "An unexpected error occurred during sync" });
  }
}
