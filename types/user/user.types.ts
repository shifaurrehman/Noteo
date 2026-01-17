export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastSyncAt: string | null;
  registered: boolean;
}