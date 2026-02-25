// Redux store root state type
import { RootState } from './store';

export type AppDispatch = typeof import('./store').store.dispatch;

// Re-export for convenience
export type { RootState };

