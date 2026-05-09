import { syncCategoriesApi } from "@/services/api/services/categoriesService";
import { SYNC_STATUS } from "@/types/category/category.types";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { call, put, select } from "redux-saga/effects";
import {
  deleteCategory,
  markCategoryAsSynced,
  updateCategory,
  updateCategorySyncStatus,
  initialState as categoriesInitialState,
} from "../../slices/categoriesSlice";
import { syncPendingCategoriesSaga } from "../syncSaga";

import { initialState as authInitialState } from "../../slices/authSlice";
import { initialState as networkInitialState } from "../../slices/networkSlice";
import { initialState as notesInitialState } from "../../slices/notesSlice";
import { initialState as settingsInitialState } from "../../slices/settingsSlice";

// Mock uuid
jest.mock("uuid", () => ({
  v4: () => "new-uuid",
}));

// ... (rest of the imports)

// Mock API and utilities
jest.mock("@/services/api/services/categoriesService", () => ({
  ...jest.requireActual("@/services/api/services/categoriesService"),
  syncCategoriesApi: jest.fn((payload) => Promise.resolve({ success: true })),
}));
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
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
      {
        id: "",
        name: "Local Missing ID",
        syncStatus: SYNC_STATUS.ERROR,
        isLocal: true,
        isDeleted: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
      {
        id: "3",
        name: "", // Irrecoverable: missing name
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: false,
        isDeleted: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
      {
        id: "4",
        name: "Already Synced",
        syncStatus: SYNC_STATUS.SYNCED,
        isLocal: false,
        isDeleted: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
      {
        id: "5",
        name: "Local Deleted",
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: true,
        isDeleted: true,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
    ];

    const mockState = {
      categories: {
        ...categoriesInitialState,
        categories: mockCategories,
      },
      notes: notesInitialState,
      settings: settingsInitialState,
      auth: authInitialState,
      network: networkInitialState,
    };

    // 2. Start validation loop
    // Second category (id: "") yields updateCategory for ID auto-fill
    expect(generator.next(mockState).value).toEqual(
      put(updateCategory({ id: "", updates: { id: "new-uuid" } }))
    );

    // Third category (id: 3) yields updateCategorySyncStatus because it's irrecoverable
    expect(generator.next().value).toEqual(
      put(updateCategorySyncStatus({ id: "3", syncStatus: SYNC_STATUS.ERROR }))
    );

    // 3. Batch Preparation
    // Local Deleted category (id: 5) yields deleteCategory put
    expect(generator.next().value).toEqual(put(deleteCategory("5")));

    // 4. Batch Sync API call
    // We use expect.objectContaining to avoid issues with dynamic dates and extra fields
    const result = generator.next().value;
    expect(result).toEqual(
      call(syncCategoriesApi as any, expect.objectContaining({
        created: [expect.objectContaining({ id: "new-uuid", name: "Local Missing ID" })],
        updated: [expect.objectContaining({ id: "1", name: "Valid Pending" })],
        deleted: []
      }))
    );

    // 5. Success Handlers
    // Mark created items as synced
    expect(generator.next().value).toEqual(put(markCategoryAsSynced({ id: "new-uuid", isLocal: false })));
    // Mark updated items as synced
    expect(generator.next().value).toEqual(put(markCategoryAsSynced({ id: "1" })));

    // Toast message
    expect(generator.next().value).toBeUndefined(); // showSuccessToast doesn't return anything or is mocked
    expect(showSuccessToast).toHaveBeenCalledWith({ message: "Categories synced successfully" });

    expect(generator.next().done).toBe(true);
  });

  it("should mark items as ERROR if the API call fails", () => {
    const generator = syncPendingCategoriesSaga();

    expect(generator.next().value).toEqual(select());

    const mockCategories = [
      {
        id: "1",
        name: "Valid Pending",
        syncStatus: SYNC_STATUS.PENDING,
        isLocal: false,
        isDeleted: false,
        isFavorite: false,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        version: 1,
      },
    ];

    const mockState = {
      categories: {
        ...categoriesInitialState,
        categories: mockCategories,
      },
      notes: notesInitialState,
      settings: settingsInitialState,
      auth: authInitialState,
      network: networkInitialState,
    };

    // API call should be returned by this next()
    expect(generator.next(mockState).value).toEqual(
      call(syncCategoriesApi as any, {
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
    expect(showErrorToast).toHaveBeenCalledWith({ message: "Failed to sync categories" });

    expect(generator.next().done).toBe(true);
  });
});
