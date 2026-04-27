# Developer Coding Conventions

To scale gracefully, standardizing coding behavior prevents entropy and fragmentation across the project's ecosystem. Every pull request submitted to the Noteo application must abide explicitly by these core conventions.

## 1. File Structure & Component Rules

- **Module Co-location**: Files specific to a single component must live directly together in a folder wrapper unless highly reused across distinct features.
  ```
  src/components/MyButton/
    ├── index.tsx
    ├── MyButton.styles.ts
    └── types.ts
  ```
- **Strict File Extentions**: All UI rendering logic must utilize `.tsx`. Pure logic systems, Redux mappers, and utility helpers must be typed thoroughly utilizing purely `.ts`.
- **Absolute Imports**: Always employ `@/...` over utilizing deeply ugly relative chaining logic (`../../../components/MyButton`).
- **No Route Bloat**: Files existing within `src/app/...` natively operate as top-level screen containers. They should purely call internal page-level components found in `src/screens/...`. Do not hard code layout business complexities into routing entry points directly.

## 2. Naming Standards

Consistent casing patterns instantly communicate function intention or variable type maps without relying on explicitly tracking definition blocks natively.
- **PascalCase**: Applied to every React Component definition (e.g., `NoteCard`, `CategoryModal`). Filenames reflecting component entries equally utilize `PascalCase`.
- **camelCase**: Applied broadly for generic variable definitions, custom React hooks (`useTheme`, `useNotes`), and specific helper utility files (`formatDate.ts`).
- **SCREAMING_SNAKE_CASE**: Enforced for static configuration assignments and hard environment abstractions (e.g., `DEFAULT_ANIMATION_SPEED`, `MAX_RETRIES`).
- **Event Handler Patterns**: Handler functions bind closely with verbs demonstrating an intention. `onPress` passes into logic functions styled like `handleAddNote` or `handleSessionLogout`.

## 3. The React Rules

React Native requires rigorous control to prevent UI clipping or memory stutter.
- **Functional Strictness**: Classes are fundamentally banned. Emphasize functional react components leveraging standardized lifecycle hooks natively.
- **Dependency Arrays**: All dependencies mapping `useEffect`, `useCallback`, and `useMemo` must contain exactly what triggers updates natively, never lying to ignore rules out of convenience.
- **Use TypeScript Explicitly**: Define all passed props and configurations securely utilizing specific TypeScript `interface` or `type` abstractions. Absolutely no default assignments as `any`.
- **Prop Drilling Warning**: Any variable traversing downwards deeper than 2 nested layers demands analyzing context boundaries or placing parameters directly into a scalable slice system natively using `useAppSelector`.

## 4. Redux & Saga Conventions

We maintain a strict definition separating immediate UI impacts from heavy system operations utilizing standard Redux patterns.
- **One Source of Dispatch**: UI Components push intents, never resolving actual logic. Instead of updating three separate domains manually from an `onPress` toggle, dispatch `APP_INITIALIZED` and bind multiple distinct slices listening globally.
- **Side Effect Wrapping**: Sagas natively execute potentially volatile asynchronous behaviors. Try-catch boundaries must exist natively across generator loops (`function* fetchSaga()`), executing clear `FAILED` action dispatches mapped seamlessly to error handlers.
- **Clean Default States**: All slicing schemas must reflect robust initial fall-back logic ensuring zero unhandled Null reference crashes occurring on application load.
- **Immutable Updates**: State mutations must remain deterministic utilizing deeply spread arrays natively or robustly executing internal RTK draft behaviors. Avoid executing structural `delete` commands operating directly against slice trees.

## 5. API & Services Integration Layer

Business boundaries must safely block potentially compromised inputs from crashing display environments natively.
- **Axios Reusability**: Do not configure ad hoc fetch logic internally. Always route via standardized `ApiClient.ts` structures natively encapsulating standardized authorization headers seamlessly.
- **Type Casting Payloads**: The front-end sets explicit parameter requests ensuring correct boundaries. Never map open JSON strings natively without strictly wrapping utilizing custom `IServerResponse<T>` wrappers natively verifying field accuracy.
- **Graceful Retries**: Network integrations inherently flake out utilizing mobile towers. All generic HTTP GET logic mapping deeply into services requires reasonable timeout boundary enforcement ensuring screens don't spin indefinitely. 

## 6. UI & Styling Strictness 

- **Responsive Flexibility**: Never hard-set values specifying physical screen rendering widths. Exploit flexbox layouts scaling perfectly over different platform orientations natively.
- **Theme Variables Strictness**: Colors must deeply hook against current context variables seamlessly (e.g., `colors.backgroundPrimary`) and explicitly avoid hardcoding hex structures internally bypassing the dark mode systems natively.
- **Dark Mode Hazing Prohibition**: Crucial UI bugs natively occur applying `rgba` overlays directly over standard dark mode component blocks. Use defined deeply structured dark theme alternatives strictly mapped (`#15172A`) ensuring components appear vivid natively rather than cloudy or muted dynamically.

## 7. Critical Do's 

- **DO** write self-documenting logic variable structures providing explicit clarity on purpose.
- **DO** heavily unit tests specific util implementations dealing across potentially complex date abstractions natively.
- **DO** map generic icon strings safely behind unified lookup directories native limiting duplicate string paths directly across code locations natively.
- **DO** verify connection listeners mapping native internet availability natively pushing warning prompts prior executing sync logic.

## 8. Critical Don'ts

- **DON'T** generate massive components bypassing 200 lines arbitrarily; refactor specific UI segments explicitly mapping isolated components effectively.
- **DON'T** merge code triggering default active Prettier validation rule failures ensuring a uniform structural representation across environments strictly.
- **DON'T** ignore async await structural traps natively resulting deeply into un-caught promise loops.

## 9. Version Control & Git Guidelines

Clean git histories empower code reviews, debugging, and cross-team collaborations effectively.
- **Descriptive Commits**: The codebase expects logical conventional commits. Follow structures resembling `feat(notes): enhance list sorting` or `fix(api): handle timeout exception`, making tracking regressions instantly transparent.
- **Atomic History**: Push modular behaviors as standalone implementations directly avoiding deeply convoluted structural pull request blocks containing five unlinked feature iterations natively.
- **Linear Re-basing**: Do not pollute git history natively generating complex automated merges utilizing standard branch commits strictly pulling `--rebase` over origin updates.
- **Preflight Executions**: Every single executed commit explicitly triggers checking boundaries utilizing `npm run preflight`. Do not bypass the formatting or typing guards unilaterally executing `commit -n`. Code quality natively overrides immediate delivery pace universally.

## 10. Memory Considerations

Mobile devices, particularly mature Android operating models, deeply struggle when applications rapidly devour functional background memory natively.
- **List Optimizations**: Employ `@shopify/flash-list` rendering loops processing heavy memory boundaries effectively overriding deeply heavy `ScrollView` structural setups scaling against large collections directly. 
- **Image Tiling**: Employ heavy compression caching and remote request resolution seamlessly mitigating out of memory issues commonly native executing native UI scaling components across un-bound generic source URIs directly.
