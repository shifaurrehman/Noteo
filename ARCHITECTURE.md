# Noteo System Architecture

## 1. Overview

The Noteo application architecture is designed around three principal goals:
1. **Offline-First Resilience**: An application that stays usable regardless of user connectivity.
2. **Clear Separation of Concerns**: Strict boundaries between UI logic, state management, and data mutation.
3. **High Predictability**: Standardized data flows that make tracking side effects and debugging effortless.

By coupling the **React Native/Expo** environment with **Redux Toolkit** and **Redux Saga**, we create a state machine that seamlessly scales, synchronizes across devices, and maintains a highly polished user experience.

## 2. Global Application Structure

The application isolates functional layers, heavily relying on abstractions to reduce code duplication and enforce structured scaling.

### The UI Layer
- **Screens vs Routes**: We decouple our routing abstraction from the actual UI content. `src/app/` holds file-based structural entries. They inject layout headers and params into robust `src/screens/` files, ensuring routing rules never clutter pure UI component structures.
- **Dumb Components**: Deep components located in `src/components/` rarely attach directly to the Redux store. Instead, they accept data explicitly via props. This guarantees high reusability for standard components (buttons, headers, lists).
- **Responsive Handling**: The UI leverages platform-detection layers (e.g., handling safe area boundaries, iOS vs Android quirks) without deeply embedding platform-specific OS checks inside business blocks.

### The Services Layer
- **Decoupled Connectivity**: External data mutations route entirely through `src/services/`.
- **Axios Wrappers**: We use heavily typed HTTP wrappers that manage base URLs, inject authorization headers natively, and normalize network timeouts. Components are purely unaware of exact endpoint path strings.

### The Storage Layer
- **AsyncStorage Adaptation**: The local database lives purely in stringified storage contexts (often leveraging underlying platform storage logic abstractions via `AsyncStorage`).
- **Storage Interfaces**: The app interacts with `getData`, `saveData`, and `deleteData` interfaces instead of touching AsyncStorage natively. If the team migrated to MMKV in the future, it is a single-file refactor.

## 3. State Management (Redux Toolkit + Saga)

To provide an exceptional user experience, state cannot sit locally within component contexts. The application maintains all structural domain entities entirely in Redux.

### The Redux Slice Ecosystem
Each core domain receives a targeted slice inside `src/store/slices/`:
- **Notes Slice**: Handles arrays of fetched notes. Includes normalized IDs and manages loading boolean tags.
- **Category Slice**: Governs category groupings, enforcing sorting or nested structures over raw arrays depending on user setups.
- **Theme Slice**: Holds color preference details and overrides system preferences dynamically.

Reducers exclusively handle purely synchronous mutations, remaining entirely deterministic. Side-effects strictly belong to Redux Sagas.

### Redux Saga Implementations
Redux Sagas orchestrate long-running processes:
- **Listening Patterns**: Every side-effect requirement emits an action (e.g., `FETCH_NOTES_REQUESTED`). A Saga listener intercepts this action via generator yields such as `takeLatest` or `takeEvery`.
- **Delegation**: The Saga fires the Axios promise through the service layer, yielding the event loop.
- **Resolution**: Upon yielding, the Saga inspects HTTP codes. Success propagates back to the synchronous store via a `FETCH_NOTES_SUCCESS` commit, instantly refreshing all listening UI bindings.
- **Error Capturing**: Generator blocks wrap `try/catch` execution to ensure a consistent `FETCH_NOTES_FAILED` path, enabling standardized error snack bars on screen effortlessly.

## 4. The Request Lifecycle & Data Flow

The flow of user intent adheres strictly to a unidirectional architecture. Violating this flow directly in components produces unstable edge cases and is strictly prohibited during code reviews.

**(1) Trigger Event:**
A User presses a button mapped to the component function (`handleSave()`).

**(2) Action Dispatch:**
The component fires a standard Redux action `dispatch(saveNoteRequest(draftNote))`. The component **does not know or care** if it is online or offline, nor does it block the UI thread waiting for HTTP to resolve.

**(3) Saga Interception:**
A `noteSaga` listens for `saveNoteRequest`. It intercepts the payload and initiates a call to `NoteService.createNote(payload)`.

**(4) The Service Layer:**
The API utility validates request tokens, constructs headers, bounds timeout rules, and initiates the HTTP `POST` transaction.

**(5) Normalization:**
Whether receiving a newly generated server ID mapping or trapping an HTTP error, the Service resolves control back to the unblocked Saga block.

**(6) Store Commit:**
The Saga explicitly pushes the outcome back using slices via `saveNoteSuccess(response)` or `saveNoteFailure(fault)`.

**(7) Visual Re-render:**
The active screen automatically retrieves data hooks tied to Redux selectors. Once Redux acknowledges `saveNoteSuccess`, the component visually mutates for the user near-instantaneously.

## 5. Offline-First Architecture and Sync Strategy

The absolute defining feature of Noteo is offline integrity. Users frequently craft notes in subways or areas experiencing signal degradation. A local-first workflow acts as the backbone solution to seamless productivity.

### Core Mechanisms
- **Redux Persist Automation**: Every Redux domain (Auth, Notes, Themes, Categories) links tightly into `redux-persist`. App suspension saves entire memory maps natively. Opening the app reloads previous state vectors accurately, meaning cache is constantly warm without network checking.
- **Guest Environments**: In scenarios lacking server-verified login identities, apps fall back into "Guest Mode." The user is treated structurally as identical. Redux persists all payload creations independently on the guest branch.

### Pledged Queue System (Offline Middleware)
Instead of forcing sagas to manually catch offline edge cases, we lean heavily on custom middleware to handle dropped connections automatically tracking user actions.
- Any action executing over HTTP inherently passes a custom Redux network listener.
- If connectivity detects `offline`, actions do not fail entirely; instead, they transition to an internal queue loop and alter local representation UI to reflect locally accepted.
- Notes and models apply a local `SYNC_STATUS` identifying them as `PENDING`, `FAILED`, or `SYNCED`.

### Background Re-Connection Sub-Systems
Re-connection handlers track platform connectivity status natively via hooks mapping against iOS/Android OS hooks. Upon verifying successful server pings and reestablishing connection:
1. Sagas process pending sync arrays explicitly.
2. Previously batched events re-iterate synchronously.
3. UUIDs map local records tightly against new database creations, merging any delta changes.
4. The UX flags visual loaders individually on data records transitioning from `PENDING` to `SYNCED`.

## 6. Scaling & Future Proofing Considerations

To ensure the architecture stands resilient as new features deploy, specific rules are bound:
- Sagas allow implementing polling endpoints seamlessly inside generators. A polling mechanism can run effortlessly behind screens, updating specific live details.
- Store structure ensures that we scale effectively simply by layering `store/slices/newFeatureSlice.ts`.
- Component scaling relies thoroughly heavily on memoization (`React.memo`, `useCallback`) alongside Reselect mappings inside the store, bypassing component-tree re-render issues historically common to heavy React Native UI structures.

## 7. Security and Data Protection
Given Noteo operates securely as an AI-powered note-taking platform, critical application security parameters sit strictly baked into our structural architecture:
- **Token Handling**: We do not store tokens globally available on Window abstractions. All HTTP authorization bearers sit encrypted inside specifically secure OS layer implementations.
- **Persisted Data Encryption**: Redux-Persist is powerful, but we take precautions enforcing potential abstraction shifts capable of swapping simple unencrypted AsyncStorage vectors with hardware-accelerated encrypted storage logic per OS (e.g., Expo SecureStore mapping).
- **Environment Parity**: The system strictly maps explicit boundaries masking endpoints through isolated `.env` environments, preventing debug routing accidentally pointing into sensitive tables.

## 8. UX Performance Scaling Metrics
- **FlashList Operations**: To render massive, unpaginated lists of local categories or note structures without experiencing standard React Native scroll lag, the app strictly prefers implementing Shopify's FlashList, utilizing recycled rendering systems automatically bounded to UI dimensions.
- **Render Culling**: Store `selectors.ts` tightly control props passing to lists. A component observing a deeply nested selector guarantees zero tree re-renders as long as the specifically bounded object instance remains unchanged.
