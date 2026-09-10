import notesReducer, { addNote, markNoteAsSynced, initialState } from "../../notesSlice";
import { SYNC_STATUS } from "@/types/category/category.types";

describe("notesSlice", () => {
  it("should return the initial state", () => {
    expect(notesReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle addNote", () => {
    const newNote = {
      id: "1",
      title: "Test Note",
      content: "Content",
      categoryId: "cat1",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const nextState = notesReducer(initialState, addNote(newNote));

    expect(nextState.notes).toHaveLength(1);
    expect(nextState.notes[0]).toEqual({
      ...newNote,
      syncStatus: SYNC_STATUS.PENDING,
      isLocal: false,
    });
  });

  it("should handle markNoteAsSynced", () => {
    const existingState = {
      ...initialState,
      notes: [
        {
          id: "1",
          title: "Note 1",
          content: "Content",
          categoryId: "cat1",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          syncStatus: SYNC_STATUS.PENDING as any,
          isLocal: true,
        },
      ],
    };

    const nextState = notesReducer(existingState, markNoteAsSynced({ id: "1", isLocal: false }));

    expect(nextState.notes[0].syncStatus).toBe(SYNC_STATUS.SYNCED);
    expect(nextState.notes[0].isLocal).toBe(false);
  });
});
