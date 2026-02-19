import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { SYNC_STATUS } from "@/types/category/category.types";
import {
  requestNotificationPermissions,
  showSyncNotification,
} from "@/utilities/notifications/sync-notification";
import { call, put, select } from "redux-saga/effects";
import {
  deleteCategory,
  markCategoryAsSynced,
  updateCategory,
  updateCategorySyncStatus,
} from "../../slices/categoriesSlice";
import { syncPendingCategoriesSaga } from "../syncSaga";

// Mock uuid
jest.mock("uuid", () => ({
  v4: () => "new-uuid",
}));

// Mock API and utilities
jest.mock("@/services/api/services/categoriesService");
jest.mock("@/utilities/notifications/sync-notification");

describe("syncPendingCategoriesSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sync pending and recoverable error categories, auto-filling missing local IDs and skipping irrecoverable ones", () => {
    const generator = syncPendingCategoriesSaga();

    // 0. Permission check
    expect(generator.next().value).toEqual(call(requestNotificationPermissions));

    // 1. Initial select
    expect(generator.next(true).value).toEqual(select());

    const mockCategories = [
      {
        id: "1",
        name: "Valid Pending",
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: false,
        isDeleted: false,
      },
      {
        id: "",
        name: "Local Missing ID",
        syncStatus: SYNC_STATUS.ERROR,
        isLocal: true,
        isDeleted: false,
      },
      {
        id: "3",
        name: "", // Irrecoverable: missing name
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: false,
        isDeleted: false,
      },
      {
        id: "4",
        name: "Already Synced",
        syncStatus: SYNC_STATUS.SYNCED,
        isLocal: false,
        isDeleted: false,
      },
      {
        id: "5",
        name: "Local Deleted",
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: true,
        isDeleted: true,
      },
    ];

    const mockState = {
      categories: {
        categories: mockCategories,
      },
    };

    const categoriesToSync = [
      mockCategories[0],
      mockCategories[1],
      mockCategories[2],
      mockCategories[4],
    ];

    // Initial Notification
    expect(generator.next(mockState).value).toEqual(call(showSyncNotification, 0, categoriesToSync.length));

    // 2. Start validation loop
    // First category (id: 1) is valid, no yield.

    // Second category (id: "") yields updateCategory for ID auto-fill
    expect(generator.next().value).toEqual(put(updateCategory({ id: "", updates: { id: "new-uuid" } })));

    // Third category (id: 3) yields updateCategorySyncStatus because it's irrecoverable
    expect(generator.next().value).toEqual(
      put(updateCategorySyncStatus({ id: "3", syncStatus: SYNC_STATUS.ERROR }))
    );

    // Progress update after irrecoverable
    expect(generator.next().value).toEqual(call(showSyncNotification, 1, categoriesToSync.length));

    // Fifth category (id: 5) is valid for now, no yield in validation loop.

    // 3. Batch Preparation
    // Local Deleted category (id: 5) yields deleteCategory put
    expect(generator.next().value).toEqual(put(deleteCategory("5")));

    // Progress update after local delete
    expect(generator.next().value).toEqual(call(showSyncNotification, 2, categoriesToSync.length));

    // 4. Batch Sync API call
    const expectedBatch = {
      created: [
        {
          id: "new-uuid",
          name: "Local Missing ID",
          syncStatus: SYNC_STATUS.ERROR,
          isLocal: true,
          isDeleted: false,
        },
      ],
      updated: [
        {
          id: "1",
          name: "Valid Pending",
          syncStatus: SYNC_STATUS.PENDING,
          isLocal: false,
          isDeleted: false,
        },
      ],
      deleted: [],
    };

    expect(generator.next().value).toEqual(call(syncCategoriesApi, expectedBatch));

    // 5. Success Handlers
    // Mark created items as synced
    expect(generator.next().value).toEqual(put(markCategoryAsSynced({ id: "new-uuid", isLocal: false })));
    // Progress update
    expect(generator.next().value).toEqual(call(showSyncNotification, 3, categoriesToSync.length));

    // Mark updated items as synced
    expect(generator.next().value).toEqual(put(markCategoryAsSynced({ id: "1" })));
    // Progress update (Final)
    expect(generator.next().value).toEqual(call(showSyncNotification, 4, categoriesToSync.length));

    expect(generator.next().done).toBe(true);
  });

  it("should mark items as ERROR if the API call fails", () => {
    const generator = syncPendingCategoriesSaga();

    generator.next(); // permission check
    generator.next(true); // select

    const mockCategories = [
      {
        id: "1",
        name: "Valid Pending",
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: false,
        isDeleted: false,
      },
    ];

    const mockState = {
      categories: {
        categories: mockCategories,
      },
    };

    generator.next(mockState); // initial notification
    generator.next(); // Validation loop (none yield here as it's valid)

    // API call
    expect(generator.next().value).toEqual(
      call(syncCategoriesApi, {
        created: [],
        updated: [mockCategories[0]],
        deleted: [],
      })
    );

    // Throw error from API call
    const error = new Error("Network Error");
    expect(generator.throw(error).value).toEqual(
      put(updateCategorySyncStatus({ id: "1", syncStatus: SYNC_STATUS.ERROR }))
    );

    // Final failure notification
    expect(generator.next().value).toEqual(
      call(showSyncNotification, 1, 1, "Failed to sync categories")
    );

    expect(generator.next().done).toBe(true);
  });
});
