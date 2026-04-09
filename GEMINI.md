# Gemini AI Development Guide

This repository is an Expo React Native application for an offline-first AI note-taking app.

## Tech Stack
- **Framework**: Expo Router (File-based navigation)
- **UI**: React Native, Lucide-react/vector-icons
- **Language**: TypeScript
- **State Management**: Redux Toolkit & Redux Saga (Notes, Categories, Theme)
- **Storage**: AsyncStorage with Redux Persist (Offline-first architecture)
- **Styling**: Vanilla CSS/React Native StyleSheet

## Folder Structure
- `src/app/`: Expo Router pages and layouts
- `src/components/`: Reusable UI components
- `src/hooks/`: Custom React hooks
- `src/store/`: Redux store configuration, slices, and sagas
- `src/services/`: API service layer
- `src/screens/`: Screen-level components
- `src/utilities/`: Helper functions
- `src/constants/`: App constants and configuration
- `src/storage/`: Async storage adapters
- `src/types/`: TypeScript interfaces and types
- `src/theme/`: Theme configuration
- `src/styles/`: Global style definitions

## Coding Rules
1. **TypeScript Only**: Always define interfaces/types for props and state. Avoid `any`.
2. **Expo Router**: Use `Link` and `router` for navigation. No business logic in routes.
3. **Hooks Over Classes**: Prefer functional components and custom hooks.
4. **Performance**: Avoid unnecessary re-renders; use `memo`, `useCallback`, and `useMemo` where appropriate.
5. **Lists**: Use `FlatList` or `@shopify/flash-list` for large datasets.
6. **Themes**: Support dark/light mode using the `useTheme` hook.
7. **Offline-First**: Ensure data is persisted to AsyncStorage via the storage layer.

## 🚨 STRICT ARCHITECTURE ENFORCEMENT RULES (MUST FOLLOW)

- **File Placement**:
  - Routing strictly in `src/app/`
  - Reusable logic in `src/hooks/` or `src/utilities/`
  - Backend integration in `src/services/`
  - Redux logic in `src/store/`
- **Data Flow**: Component → Dispatch Action → Saga → API → Store → UI. NEVER call APIs directly in components.
- **Do not invent folders**: Strict adherence to the provided folder structure.

## 🤖 AI PRODUCTIVITY & WORKFLOW RULES
- **Search First**: Look for existing components, utilities, and constants before creating new ones.
- **No Placeholders**: Never generate `// ... existing code` or `// implement later`. Write the complete function or file if regenerating.
- **Atomic Responses**: Keep code diffs focused and atomic.
- **Check Connections**: When altering Redux or Sagas, verify selector usage in components.
- **Dark Mode Visual Depth**: NEVER use semi-transparent `rgba` or `surface` overlays for main card backgrounds in dark mode. This creates a "hazy" effect. Always use solid, deep colors (e.g., `#15172A`).

## When Generating Code
- Follow Expo best practices.
- Use the existing design system (colors, spacing).
- Ensure accessibility (ARIA labels, hit slop).
- Include basic unit tests where applicable.
