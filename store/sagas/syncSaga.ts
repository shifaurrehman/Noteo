import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { Category, CategoryApi, SYNC_STATUS } from "@/types/category/category.types";
import {
  requestNotificationPermissions,
  showSyncErrorNotification,
  showSyncNotification,
} from "@/utilities/notifications/sync-notification";
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

    // 0. Request notification permissions
    const hasPermission: boolean = yield call(requestNotificationPermissions);
    if (!hasPermission) {
      console.warn("[Sync Saga] Notification permissions not granted");
    }

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

    if (hasPermission) {
      yield call(showSyncNotification, 0, categoriesToSync.length);
    }

    const validCategories: Category[] = [];
    let processedCount = 0;
    const totalToSync = categoriesToSync.length;

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
        processedCount++;
        if (hasPermission) yield call(showSyncNotification, processedCount, totalToSync);
      }
    }

    if (validCategories.length === 0) {
      console.log("[Sync Saga] No valid categories to sync after validation");
      if (hasPermission) {
        yield call(showSyncNotification, processedCount, totalToSync, "Failed to sync categories");
      }
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
          processedCount++;
          if (hasPermission) yield call(showSyncNotification, processedCount, totalToSync);
        } else {
          deleted.push({ id: category.id });
        }
      } else if (category.isLocal) {
        created.push(category);
      } else {
        updated.push(category);
      }
    }

    // If there's nothing to sync to server (and all local deletions are done)
    if (created.length === 0 && updated.length === 0 && deleted.length === 0) {
      if (hasPermission && processedCount === totalToSync) {
        yield call(showSyncNotification, processedCount, totalToSync);
      }
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
        processedCount++;
        if (hasPermission) yield call(showSyncNotification, processedCount, totalToSync);
      }
      for (const cat of updated) {
        yield put(markCategoryAsSynced({ id: cat.id }));
        processedCount++;
        if (hasPermission) yield call(showSyncNotification, processedCount, totalToSync);
      }
      for (const item of deleted) {
        yield put(markCategoryAsSynced({ id: item.id }));
        processedCount++;
        if (hasPermission) yield call(showSyncNotification, processedCount, totalToSync);
      }
    } catch (error: any) {
      console.error("[Sync Saga] Batch sync failed:", error);

      // 5c. Mark all items in the failed batch as ERROR
      for (const cat of created) {
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
        processedCount++;
      }
      for (const cat of updated) {
        yield put(updateCategorySyncStatus({ id: cat.id, syncStatus: SYNC_STATUS.ERROR }));
        processedCount++;
      }
      for (const item of deleted) {
        yield put(updateCategorySyncStatus({ id: item.id, syncStatus: SYNC_STATUS.ERROR }));
        processedCount++;
      }

      if (hasPermission) {
        yield call(showSyncNotification, processedCount, totalToSync, "Failed to sync categories");
      }
    }
  } catch (error: any) {
    console.error("[Sync Saga] Unexpected error in syncPendingCategoriesSaga:", error);
    if (hasPermission) {
      yield call(showSyncErrorNotification, "An unexpected error occurred during sync");
    }
  }
}
