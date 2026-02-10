export const SYNC_STATUS = {
  PENDING: "pending",
  SYNCED: "synced",
  ERROR: "error",
} as const;

export type SyncStatus = (typeof SYNC_STATUS)[keyof typeof SYNC_STATUS];

export interface Category {
  id: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  syncStatus: SyncStatus;
  version: number;
  isLocal?: boolean;
}

export type CategoryApi = {
  id: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  version: number;
  isLocal?: boolean;
};
