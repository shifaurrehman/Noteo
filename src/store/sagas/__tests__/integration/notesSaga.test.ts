import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";
import { fetchNotesApi } from "@/services/api/services/notesService";
import { loadNotesSaga } from "../../notesSaga";
import { loadNotes, setError, setLoading } from "../../../slices/notesSlice";
import { setNetworkState } from "@/testing/utils/asyncUtils";

// Mock toast utilities
jest.mock("@/utilities/toast/message-toast", () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

jest.mock("@/utilities/toast/get-toast-message", () => ({
  getErrorMessage: jest.fn(() => "An error occurred"),
}));

describe("notesSaga Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load notes successfully when online", () => {
    setNetworkState(true);
    const mockNotes = [
      { id: "1", title: "Note 1", content: "Content 1", categoryId: "cat1", createdAt: "2023", updatedAt: "2023" },
    ];

    return expectSaga(loadNotesSaga)
      .provide([[matchers.call.fn(fetchNotesApi), mockNotes]])
      .put(setLoading(true))
      .put(loadNotes(mockNotes))
      .put(setLoading(false))
      .run();
  });

  it("should handle offline mode gracefully", async () => {
    setNetworkState(false);
    // In a real app, the saga might check isConnected before calling API
    // This is an example of testing that boundary
    const error = new Error("No internet connection");
    
    return expectSaga(loadNotesSaga)
      .provide([[matchers.call.fn(fetchNotesApi), throwError(error)]])
      .put(setLoading(true))
      .put(setError("An error occurred"))
      .put(setLoading(false))
      .run();
  });
});
