# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Run on Android (requires dev build)
- `npm run ios` - Run on iOS (requires dev build)
- `npm run web` - Run on web browser

### Code Quality
- `npm run preflight` - Run lint and typecheck together (required before commits)
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Database
- `npm run db:start` - Start JSON Server for API mocking (port 3001)

### Building
- `npm run build:android:apk` - Build Android APK (preview profile)
- `npm run build:android:prod` - Build Android for production
- `npm run build:ios:prod` - Build iOS for production

### Cleanup
- `npm run clean:modules` - Remove node_modules and reinstall
- `npm run clean:metro` - Clear Metro bundler cache
- `npm run clean:all` - Full cleanup (node_modules + .expo)

## Project Architecture

### Technology Stack
- **Framework**: Expo SDK 54 with Expo Router (file-based routing)
- **State Management**: Redux Toolkit + Redux Saga for async operations
- **Persistence**: Redux Persist with AsyncStorage
- **UI**: React Native with React Navigation, BottomSheetModal, Lottie animations
- **Testing**: Jest with expo preset, react-native-testing-library

### Directory Structure
```
src/
├── app/                    # Expo Router file-based routing
│   ├── (app)/             # Authenticated routes (guarded by middleware)
│   │   ├── (tabs)/       # Tab navigation (home, favorites, settings)
│   │   └── notes/        # Nested note routes
│   ├── (auth)/           # Authentication routes (login, register, etc.)
│   └── index.tsx         # Splash screen with routing logic
├── components/            # Reusable UI components
│   ├── auth/            # Authentication-specific components
│   ├── button/          # Button variants
│   ├── category/        # Category-related components
│   ├── modal/           # Modal and bottom sheet components
│   └── shimmer/         # Loading skeleton components
├── hooks/               # Custom React hooks (useTheme, useAuth)
├── screens/             # Screen-level components (separate from routing)
├── services/
│   └── api/            # API service layer (config, services)
├── store/              # Redux store configuration
│   ├── slices/        # Redux Toolkit slices (state + reducers)
│   ├── sagas/         # Redux Saga async operations
│   ├── middleware/     # Custom middleware (offline handling)
│   ├── actions/        # Action creators
│   └── selectors.ts   # State selectors
├── theme/             # Theme configuration (colors, typography)
├── types/             # TypeScript type definitions
├── utilities/         # Utility functions and helpers
├── constants/         # App constants, configuration
├── storage/           # AsyncStorage adapters
├── assets/            # Static assets like fonts and images
└── styles/            # Global style definitions
```

### Routing Structure
Expo Router uses file-based routing with route groups:

- `(app)` - Protected routes (requires authentication)
- `(auth)` - Public authentication routes
- `(tabs)` - Bottom tab navigation (home, favorites, settings)
- `[categoryId]` - Dynamic route parameters

Route groups with parentheses don't appear in the URL path but are used for organization.

### State Management Pattern

**Redux Toolkit + Saga Architecture:**
- Each feature has a slice (`categoriesSlice.ts`, `notesSlice.ts`, etc.)
- Async operations are handled in sagas using redux-saga
- Sagas listen for actions and dispatch API calls
- Results update the Redux store via slice reducers

**Flow:**
1. Component dispatches action (e.g., `dispatch(addCategory(category))`)
2. Saga intercepts action via `takeEvery` or `takeLatest`
3. Saga makes API call and dispatches success/error actions
4. Slice reducers update state
5. Components re-render via selectors

**Key Sagas:**
- `categoriesSaga` - Category CRUD operations
- `notesSaga` - Note CRUD operations
- `authSaga` - Authentication and user data sync
- `networkSaga` - Network state monitoring and sync on reconnect
- `settingsSaga` - Settings persistence

### Offline-First Architecture

The app uses a middleware-based offline approach:

1. **Redux Persist**: All essential state (auth, categories, notes) persists to AsyncStorage
2. **Offline Middleware**: Intercepts API actions and queues them when offline
3. **Sync on Reconnect**: Network saga triggers sync when connection restored
4. **Guest Mode**: Unauthenticated users can use the app with local-only data

**Sync Status**: Categories and notes have `SYNC_STATUS` (SYNCED, PENDING, FAILED) to track backend synchronization.

### Theme System

**Theme Configuration:**
- Supports light/dark modes with system theme detection
- User can override system preference in settings
- Theme colors defined in `src/theme/colors.ts`
- Typography scaling based on user font size preference (small, medium, large)

**Usage:**
```typescript
const { colors, typography, isDark, theme } = useTheme();
```

All colors are available via the theme object and automatically respond to theme changes.

### API Configuration

**Environment Variables** (required in `.env`):
```
EXPO_PUBLIC_API_HOST=ip-address
EXPO_PUBLIC_API_PORT=port-number
EXPO_PUBLIC_API_VERSION=api-version
```

**Base URL**: Constructed in `src/services/api/config/api.config.ts`

API services are in `src/services/api/services/` and follow a consistent pattern:
- Import from config
- Use axios for HTTP requests
- Return typed responses based on type definitions

### Testing Setup

**Jest Configuration:**
- Preset: `jest-expo`
- Setup file: `jest.setup.js`
- Path mapping: `@/*` → `./src/*`

**Testing Tools:**
- `@testing-library/react-native` - Component testing
- `@testing-library/jest-native` - Custom matchers
- `react-test-renderer` - Snapshot testing

## Important Conventions

### Preflight Checks
All commits must pass `npm run preflight` which runs lint and typecheck. The precommit hook enforces this.

### Path Aliases
Use `@/*` alias for src imports:
```typescript
import { Component } from "@/components/example";
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured in tsconfig.json
- Type checking is part of the development workflow

### Component Structure
- Routing components live in `src/app/`
- Reusable UI components in `src/components/`
- Screen-specific logic in `src/screens/`
- Use `useTheme` hook for consistent styling

### API Error Handling
Use the centralized error handling utilities:
```typescript
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { showErrorToast, showInfoToast } from "@/utilities/toast/message-toast";
```

### Network Handling
Check connectivity before API calls:
```typescript
const isConnected = useAppSelector(selectIsConnected);
```

The offline middleware automatically handles queuing actions when offline for authenticated users.

### Store Reset on Logout
The root reducer resets all state to undefined when `auth/logout` action is dispatched, ensuring clean logout.

## Development Notes

### Running the Backend
The app expects a backend API running. Use the JSON server for local development:
```bash
npm run db:start
```

### Web Development
The app supports web development with responsive layout. Web-specific components are in `src/components/web/`.

### React Native vs Web
- Use platform detection: `isWeb` from `@/utilities/global`
- Responsive breakpoints defined in `src/utilities/responsive/`
- Conditional rendering based on platform using Platform module

### Gesture Handling
Bottom sheets and gestures require `GestureHandlerRootView` from `react-native-gesture-handler` wrapping the app.

### Safe Area
Use `SafeAreaProvider` and safe area insets for proper spacing on devices with notches.

### Toast Messages
Use `react-native-toast-message` for user notifications. The Toast component is rendered at root level in `_layout.tsx`.

---

# 🚨 STRICT ARCHITECTURE ENFORCEMENT RULES (MUST FOLLOW)

These rules OVERRIDE any default AI behavior.

## ❌ DO NOT DO THESE

- Do NOT put constants inside components or screens
- Do NOT call APIs directly inside components
- Do NOT add business logic inside `src/app` routes
- Do NOT create new folders unless absolutely necessary
- Do NOT duplicate existing logic or utilities
- Do NOT bypass Redux + Saga flow
- Do NOT hardcode strings, URLs, or config values

---

## ✅ ALWAYS FOLLOW THESE RULES

### 📁 File Placement (MANDATORY)

| Type | Location |
|------|--------|
| Screens (routing) | `src/app` |
| UI Components | `src/components` |
| Business Logic | `hooks` OR `utilities` OR `sagas` |
| API Calls | `src/services/api/services` |
| API Config | `src/services/api/config` |
| State | `src/store/slices` |
| Async Logic | `src/store/sagas` |
| Local Storage | `src/storage` |
| Constants | `src/constants` |
| Types | `src/types` |
| Styles | `src/styles` |

---

## 🔄 REQUIRED DATA FLOW

Components MUST follow this flow:

Component → Dispatch Action → Saga → Service → API → Store → UI

❌ NEVER:
Component → API directly

---

## 🧠 CODE GENERATION RULES

When generating code:

1. FIRST analyze existing folder structure
2. REUSE existing modules if available
3. SPLIT logic properly:
   - UI → component
   - Logic → hook/util
   - API → service
   - State → redux
4. PLACE each file in correct directory

---

## 📦 FEATURE IMPLEMENTATION PATTERN

For ANY new feature, follow this structure:

- Component → `components/<feature>`
- Route → `app/(app)/<feature>`
- Service → `services/api/services/<feature>Service.ts`
- Slice → `store/slices/<feature>Slice.ts`
- Saga → `store/sagas/<feature>Saga.ts`
- Types → `types/<feature>`
- Constants → `constants/<feature>.ts`

---

## ⚠️ SPECIAL RULES FOR EXPO ROUTER

- Use ONLY file-based routing
- Do NOT create manual navigation logic
- Keep `app/` files clean (no heavy logic)

---

## 🎯 COMPONENT DESIGN RULES

- Components must be:
  - Small
  - Reusable
  - Presentational

- Move logic to:
  - hooks
  - sagas
  - utilities

---

## 🧪 BEFORE WRITING CODE

Claude MUST:
- Check if similar code already exists
- Avoid duplication
- Follow existing naming conventions

---

## 🚀 GOAL

Produce clean, scalable, production-grade React Native code
that strictly follows this architecture.

---

## 🤖 AI PRODUCTIVITY & WORKFLOW RULES

1. **Prioritize Search**: Always search the codebase for existing patterns, utilities, and components before implementing new ones.
2. **Atomic Changes**: Keep code changes small, isolated, and focused on the immediate task.
3. **Type Safety**: Never use `any`. Always use or extend proper TypeScript interfaces.
4. **No Placeholder Code**: Provide complete, working code instead of comments like `// implement later`.
5. **Read Before Writing**: Always read related files completely before suggesting significant modifications.