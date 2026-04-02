# Noteo - Architecture Documentation

## Overview
This note-taking app is built with scalability and maintainability in mind, using React Native with Expo and TypeScript.

## Architecture

### 1. **Context-Based State Management**
The app uses React Context API for global state management, providing:
- **ThemeContext**: Manages theme (light/dark mode) and app settings
- **CategoriesContext**: Manages categories (CRUD operations)
- **NotesContext**: Manages notes (CRUD operations, dummy note handling)

### 2. **Type Definitions** (`types/index.ts`)
Centralized TypeScript types for:
- `Note`: Note structure with metadata
- `Category`: Category structure
- `ThemeMode`: Theme options
- `AppSettings`: App configuration

### 3. **Storage Layer** (`storage/asyncStorage.ts`)
Abstracted storage operations using AsyncStorage:
- `saveData`: Save data to storage
- `getData`: Retrieve data from storage
- `deleteData`: Delete data from storage

### 4. **Reusable Components** (`components/`)
- **Header**: Reusable header component with navigation
- **CategoryCard**: Category display card
- **NoteCard**: Note display card with edit/delete actions
- **AddNoteModal**: Modal for adding/editing notes
- **AddCategoryModal**: Modal for adding categories

### 5. **Screens** (`app/`)
- **Home Screen** (`index.tsx`): Displays categories with search functionality
- **Notes Screen** (`notes/[categoryId].tsx`): Displays notes for a category
- **Settings Screen** (`settings.tsx`): App settings and theme configuration

## Scalability Features

### 1. **Separation of Concerns**
- Context providers handle business logic
- Components are reusable and focused
- Storage is abstracted for easy replacement

### 2. **Type Safety**
- Full TypeScript support
- Centralized type definitions
- Type-safe context providers

### 3. **Extensible Architecture**
- Easy to add new features (e.g., categories, notes)
- Settings screen designed for future expansion
- Theme system supports additional themes

### 4. **Performance Optimizations**
- Memoized category filtering
- Direct context consumption (no unnecessary re-renders)
- Efficient note filtering

### 5. **Data Management**
- Centralized state management
- Automatic persistence to AsyncStorage
- Clean dummy note handling

## Key Features

### Home Screen
- Display categories in a grid layout
- Search functionality
- Add new categories
- Navigate to notes by category

### Notes Screen
- Display notes for a category
- Add/edit/delete notes
- Dummy note for empty categories
- Automatic dummy note removal

### Settings Screen
- Theme switching (light/dark)
- Notification settings
- Future settings expansion points

## Future Enhancements

### Easy to Add:
1. **New Note Features**:
   - Rich text editing
   - Attachments
   - Tags
   - Reminders

2. **New Category Features**:
   - Category colors
   - Category icons
   - Category sorting

3. **New Settings**:
   - Font size adjustment
   - Export/import notes
   - Backup/restore
   - Sync with cloud storage

4. **New Themes**:
   - Additional color schemes
   - Custom themes
   - Accent color selection

## Data Flow

1. **User Action** → Component
2. **Component** → Context Hook (useNotes, useCategories, useTheme)
3. **Context Hook** → Context Provider
4. **Context Provider** → Storage Layer
5. **Storage Layer** → AsyncStorage
6. **State Update** → Component Re-render

## Best Practices

1. **Always use Context Hooks** for state management
2. **Keep components focused** on presentation
3. **Use TypeScript types** for type safety
4. **Abstract storage operations** for easy replacement
5. **Handle edge cases** (empty states, loading states)

## Testing Considerations

- Components are isolated and testable
- Context providers can be mocked
- Storage layer can be replaced with test storage
- Type safety reduces runtime errors

