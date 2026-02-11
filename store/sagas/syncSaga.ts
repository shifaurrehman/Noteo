import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { Category, CategoryApi, SYNC_STATUS } from "@/types/category/category.types";
import { showErrorToast, showInfoToast } from "@/utilities/toast/message-toast";
import { call, put, select } from "redux-saga/effects";
import { deleteCategory, markCategoryAsSynced, updateCategorySyncStatus } from "../slices/categoriesSlice";
import { RootState } from "../store";


export function* syncPendingCategoriesSaga() {
  try {
    console.log("[Sync Saga] Starting sync of pending categories...");

    // Get all pending categories from Redux
    const state: RootState = yield select();
    const categories = state.categories.categories;
    const pendingCategories = categories.filter((cat: Category) => cat.syncStatus === SYNC_STATUS.PENDING);
    const failedCategories = categories.filter((cat: Category) => cat.syncStatus === SYNC_STATUS.ERROR);

    if (pendingCategories.length === 0) {
      console.log("[Sync Saga] No pending categories to sync");
      return;
    }

    console.log(`[Sync Saga] Found ${pendingCategories.length} pending categories`);

    // Prepare batch payload
    const created: CategoryApi[] = [];
    const updated: CategoryApi[] = [];
    const deleted: CategoryApi[] = [];

    for (const category of pendingCategories) {
      if (category.isDeleted) {
        if (category.isLocal) {
          yield put(deleteCategory(category.id));
        } else {
          deleted.push(category);
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

    // Call batch sync API
    try {
      yield call(syncCategoriesApi, { created, updated, deleted });
      console.log(
        `[Sync Saga] Synced: ${created.length} created, ${updated.length} updated, ${deleted.length} deleted`
      );

      // 1. Mark created items as synced and not local
      for (const cat of created) {
        yield put(markCategoryAsSynced({ id: cat.id, isLocal: false }));
      }

      // 2. Mark updated items as synced
      for (const cat of updated) {
        yield put(markCategoryAsSynced({ id: cat.id }));
      }

      // 3. Handle deleted items
      for (const item of deleted) {
        yield put(markCategoryAsSynced({ id: item.id }));
      }

      showInfoToast({ message: "Categories synced successfully" });
    } catch (error: any) {
      console.error("[Sync Saga] Batch sync failed:", error);
      showErrorToast({ message: "Failed to sync categories" });
      for (const cat of created)
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const cat of updated)
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const item of deleted)
        yield put(updateCategorySyncStatus({ id: item.id, syncStatus: SYNC_STATUS.ERROR }));
    }
  } catch (error: any) {
    console.error("[Sync Saga] Error syncing pending categories:", error);
    showErrorToast({ message: "Failed to sync some categories" });
  }
}
