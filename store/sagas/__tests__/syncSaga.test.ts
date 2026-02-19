import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { SYNC_STATUS } from "@/types/category/category.types";
import { showErrorToast, showInfoToast } from "@/utilities/toast/message-toast";
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
jest.mock("@/utilities/toast/message-toast");

describe("syncPendingCategoriesSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sync pending and recoverable error categories, auto-filling missing local IDs and skipping irrecoverable ones", () => {
    const generator = syncPendingCategoriesSaga();

    // 1. Initial select
    expect(generator.next().value).toEqual(select());

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

    // 2. Start validation loop
    // First category (id: 1) is valid, no yield.

    // Second category (id: "") yields updateCategory for ID auto-fill
    expect(generator.next(mockState).value).toEqual(
      put(updateCategory({ id: "", updates: { id: "new-uuid" } }))
    );

    // Third category (id: 3) yields updateCategorySyncStatus because it's irrecoverable
    expect(generator.next().value).toEqual(
      put(updateCategorySyncStatus({ id: "3", syncStatus: SYNC_STATUS.ERROR }))
    );

    // Fifth category (id: 5) is valid for now, no yield in validation loop.

    // 3. Batch Preparation
    // Local Deleted category (id: 5) yields deleteCategory put
    expect(generator.next().value).toEqual(put(deleteCategory("5")));

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
    // Mark updated items as synced
    expect(generator.next().value).toEqual(put(markCategoryAsSynced({ id: "1" })));

    // Toast message
    generator.next();
    expect(showInfoToast).toHaveBeenCalledWith({ message: "Categories synced successfully" });

    expect(generator.next().done).toBe(true);
  });

  it("should mark items as ERROR if the API call fails", () => {
    const generator = syncPendingCategoriesSaga();

    generator.next(); // select

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

    generator.next(mockState); // Validation loop (none yield here as it's valid)

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

    // Toast message
    generator.next();
    expect(showErrorToast).toHaveBeenCalledWith({ message: "Failed to sync categories with server" });

    expect(generator.next().done).toBe(true);
  });
});
