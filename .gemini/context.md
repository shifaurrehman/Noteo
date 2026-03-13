# Project Context: AI Note Taker

## Features
- **Notes**: CRUD operations on text-based notes.
- **Categories**: Organize notes into customizable categories.
- **Search**: Real-time filtering of categories and notes.
- **Offline First**: All data is persisted locally using AsyncStorage.
- **Theme**: Full support for Light and Dark modes.

## Technical Details
- **Current Database**: AsyncStorage via Redux Persist.
- **Future Database**: Planned migration to SQLite for advanced queries and metadata handling.
- **State**: Redux Toolkit + Redux Saga (Notes, Categories, Theme state).
- **Navigation**: Expo Router (v6+).

## Key Screens
- `/index`: Home screen (Category Grid + Search)
- `/notes/[categoryId]`: List of notes for a specific category.
- `/settings`: App configuration and theme toggle.
