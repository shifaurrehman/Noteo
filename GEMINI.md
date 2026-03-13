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
- `src/context/`: Context providers for state management
- `src/utils/`: Helper functions and constants
- `src/types/`: TypeScript interfaces and types

## Coding Rules
1. **TypeScript Only**: Always define interfaces/types for props and state.
2. **Expo Router**: Use `Link` and `router` for navigation.
3. **Hooks Over Classes**: Prefer functional components and custom hooks.
4. **Performance**: Avoid unnecessary re-renders; use `memo`, `useCallback`, and `useMemo` where appropriate.
5. **Lists**: Use `FlatList` or `@shopify/flash-list` for large datasets.
6. **Themes**: Support dark/light mode using the `ThemeContext`.
7. **Offline-First**: Ensure data is persisted to AsyncStorage via the storage layer.

## Code Style
- Use descriptive camelCase for variables and PascalCase for components.
- Prefer early returns to reduce nesting.
- Write reusable, atomic components.
- Document complex logic with concise comments.

## When Generating Code
- Follow Expo best practices.
- Use the existing design system (colors, spacing).
- Ensure accessibility (ARIA labels, hit slop).
- Include basic unit tests where applicable.
