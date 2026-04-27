# Noteo

Noteo is a production-grade, offline-first AI note-taking application built for scalability, robustness, and performance. 
Designed with a rigorous architecture separating concerns across the UI layer, state management, and API integration, Noteo offers an unparalleled user experience, even without an active internet connection.

This project uses modern mobile best practices, bringing together powerful front-end tools into a single cohesive mobile application.

## Tech Stack Overview

- **Framework**: Expo SDK 54 / React Native
  - Utilizes the newest capabilities of Expo for smooth universal app delivery.
- **Routing**: Expo Router
  - Uses file-based navigation, allowing developers to define screens and layout wrappers by simply arranging files in the `src/app/` directory.
- **Language**: TypeScript (Strict)
  - Type-safe components and API contracts reduce runtime errors and enhance developer onboarding.
- **State Management**: Redux Toolkit & Redux Saga
  - Scalable and predictable state management. Redux Toolkit provides boilerplate-free slices, while Redux Saga manages complex async data flows.
- **Storage**: AsyncStorage via Redux Persist
  - The offline-first core. All vital information is synced to disk.
- **UI & Styling**: React Native StyleSheet, Lucide-react icons, BottomSheetModal, Lottie
  - Themed components relying on vanilla React Native StyleSheet to maximize layout performance.

## Getting Started

### Prerequisites
Before starting, ensure that you have standard Native mobile tooling on your host OS:
- Node.js LTS versions (e.g., 20.x+)
- npm, yarn, or pnpm
- iOS Simulator (macOS only) and Xcode loaded
- Android Studio and a configured Android Emulator
- Watchman locally installed

### Installation & Run Instructions

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` into a local `.env` and fill in necessary API details.
   ```bash
   EXPO_PUBLIC_API_HOST=127.0.0.1
   EXPO_PUBLIC_API_PORT=3001
   EXPO_PUBLIC_API_VERSION=v1
   ```

3. **Start the Application**
   For standard development, simply run:
   ```bash
   npm start
   ```

### Key Commands Checklist

**Development Environments**
- `npm start` - Starts Expo development server (Metro bundler)
- `npm run ios` - Rebuilds development client and launches on iOS
- `npm run android` - Rebuilds development client and launches on Android
- `npm run web` - Triggers Webpack/Metro for browser-based UI inspection

**Code Quality & CI/CD Checks**
- `npm run preflight` - Runs ESLint and the TypeScript compiler simultaneously
- `npm run lint` - Targets JS/TS lint errors exclusively
- `npm run typecheck` - Validates strict TS typing without transpiling
- `npm run test` - Executes the Jest test suite
- `npm run test:watch` - Runs the test suite in reactive file-watch mode
- `npm run format` - Standardizes spacing/quotes structure across codebase using Prettier

**Mock Backends**
- `npm run db:start` - Initializes a local JSON-Server to mock endpoints and provide local latency

**Builds**
- `npm run build:android:apk` - Generates a staging Android APK profile
- `npm run build:android:prod` - Prepares Android bundle for production rollout
- `npm run build:ios:prod` - Prepares iOS IPA for production rollout

**Maintenance**
- `npm run clean:modules` - Instantly trashes node_modules for clean reinstalls
- `npm run clean:metro` - Wipes internal bundler cache if React Native ghosts components
- `npm run clean:all` - Comprehensive cache purge (.expo, metro, and dependencies)

## Folder Structure Detail

To preserve maximum modularity, Noteo enforces strict file-placement:

- `src/app/`
  - Encapsulates Expo Router logic. Contains only `_layout.tsx` files and generic page entry points. Holds route grouping layers `(app)` for protected areas and `(auth)` for public paths.
- `src/components/`
  - Self-contained, highly reusable components that consume props but lack global state bindings.
- `src/hooks/`
  - Encapsulated lifecycle behaviors, responsive constraints, and theme-binding custom React hooks.
- `src/store/`
  - The heartbeat of Noteo state handling. Separated cleanly into `slices`, `sagas`, and `actions`.
- `src/services/`
  - API adapters and generic HTTP services encapsulating Axios behavior. Includes API request intercepts for tokens.
- `src/screens/`
  - Complex screen aggregators. Expo router pulls these into routes. Ensures navigation logic and layout design stay distinct.
- `src/utilities/`
  - Shared domain helper functions, formatting extensions, logic mappers, and error toast wrappers.
- `src/constants/`
  - Safe-to-read static data configurations avoiding hard-coded strings.
- `src/storage/`
  - Abstracting the persistence system so the database can be swapped if scaling dictates switching from AsyncStorage.
- `src/types/`
  - Global source of truth representing external database shapes (Categories, Notes, Users).
- `src/theme/`
  - System themes mapping structural color variables. Assures dark mode and light mode seamlessly match definitions.
- `src/styles/`
  - Global margin setups, padding utilities, or typography presets mapping directly off theme limits.

## How to Contribute

We encourage clear and well-documented Pull Requests.
Before submitting your changes, execute `npm run preflight`. Components must abide by the uni-directional Redux-to-State data flow pattern, avoiding component-level API pollution at all costs.

Read deeper into how the Redux mapping specifically acts as an offline-middleman inside `ARCHITECTURE.md`.
