# Material Top Tabs Migration Design

**Date:** 2026-05-03
**Status:** Approved
**Author:** Claude + Shifa

## Objective

Replace custom "All/Favorites" filter tabs in `HomeScreen` and "All/Recent/Pinned/Drafts" tabs in `AllNotesScreen` with `@react-navigation/material-top-tabs` for a premium, native feel with smooth swipe gestures.

## Architecture Overview

### High-Level Structure

The refactoring maintains the existing Redux + Saga flow while replacing custom tab implementations with Material Top Tabs:

**HomeScreen:**
- Container with `createMaterialTopTabNavigator` hosting 2 tabs
- Uses `useCategoriesList` hook (moved from `CategoryListScreen`)
- Manages all modals, refs, and CRUD handlers
- Renders FAB and shared modals

**AllNotesScreen:**
- Container with `createMaterialTopTabNavigator` hosting 4 tabs
- Manages all modals, refs, and CRUD handlers
- Renders FAB and shared modals

### Key Architectural Decisions

1. **Parent-level state management**: All modals, refs, and handlers live in parent screens
2. **Dumb child components**: Tab content components are "dumb" - they accept data and handlers as props
3. **Single source of truth**: Redux store + parent screen state
4. **No duplicate modals**: Modals rendered once in parent, persist across tab switches
5. **Tab navigators are pure routing**: They only manage tab switching and visual styling

## Components and File Structure

### New Components

```
src/components/tabs/
├── CategoryTabNavigator.tsx        # Material Top Tabs for HomeScreen
└── NotesTabNavigator.tsx           # Material Top Tabs for AllNotesScreen

src/components/category/
└── CategoryListContent.tsx         # Dumb category list component (extracted)

src/components/notes/
└── NotesListContent.tsx            # Dumb notes list component (extracted)
```

### Modified Files

```
src/screens/home/index.tsx          # Simplified to use CategoryTabNavigator + useCategoriesList
src/screens/allNotes/index.tsx      # Simplified to use NotesTabNavigator
```

### Component Responsibilities

#### HomeScreen (parent)
- Uses `useCategoriesList({ favoritesOnly: false })` hook
- Manages all modals, refs, and CRUD handlers
- Renders FAB that triggers `handleShowAddModal`
- Renders shared modals (AddCategoryBottomSheet, ConfirmationBottomSheet)
- Passes categories, handlers, and refs to child tabs
- Filters categories for each tab using `filterCategories` utility

#### CategoryTabNavigator
- Creates `createMaterialTopTabNavigator`
- Configures 2 tabs: "All" and "Favorites"
- Each tab renders `CategoryListContent` with appropriate data and handlers
- Handles tab bar styling (colors, indicator, typography)
- Passes `showAddButton={false}` to child tabs (FAB in parent)
- Cleans up active menus on tab switch: `onIndexChange={() => setActiveMenuId(null)}`

#### CategoryListContent (NEW - extracted from CategoryListScreen)
- "Dumb" component - no internal state or hooks
- Accepts props:
  - `categories: Category[]`
  - `notes: Note[]`
  - `isLoading: boolean`
  - `isConnected: boolean`
  - `onRefresh: () => void`
  - `onOpenNotes: (category: Category) => void`
  - `onEditCategory: (category: Category) => void`
  - `onDeleteCategory: (categoryId: string) => void`
  - `onFavoriteCategory: (category: Category) => void`
  - `activeMenuId: string | null`
  - `onToggleMenu: (id: string | null) => void`
- Renders `FlatList` with `CategoryCard` items
- Handles empty state and refresh control
- Memoized with `React.memo`

#### AllNotesScreen (parent)
- Manages all modals, refs, and CRUD handlers
- Renders FAB and shared modals
- Passes notes, handlers, and refs to child tabs

#### NotesTabNavigator
- Creates `createMaterialTopTabNavigator`
- Configures 4 tabs: "All", "Recent", "Pinned", "Drafts"
- Each tab renders `NotesListContent` with appropriate `filterType` and handlers
- Handles tab bar styling
- Passes `showAddButton={false}` to child tabs (FAB in parent)
- Cleans up active menus on tab switch: `onIndexChange={() => setActiveNoteMenuId(null)}`

#### NotesListContent (NEW - extracted from AllNotesScreen)
- "Dumb" component - no internal state or hooks
- Accepts props:
  - `allNotes: Note[]`
  - `filterType: FilterTab` ("all" | "recent" | "pinned" | "drafts")
  - `categories: Category[]`
  - `isLoading: boolean`
  - `isConnected: boolean`
  - `onEdit: (note: Note) => void`
  - `onDelete: (note: Note) => void`
  - `onToggleFavorite: (note: Note) => void`
  - `onMove: (note: Note) => void`
  - `activeNoteMenuId: string | null`
  - `onToggleMenu: (id: string | null) => void`
  - `onRefresh: () => void`
- Filters notes based on `filterType` using `useMemo` with switch pattern
- Renders `FlatList` with `NoteCard` items
- Handles empty state and refresh control
- Memoized with `React.memo`

## Data Flow

### HomeScreen Data Flow

```
HomeScreen (parent)
  ├─ Hook: useCategoriesList({ favoritesOnly: false })
  ├─ State: modals, activeMenuId, refs
  ├─ Handlers: CRUD, modal controls
  ├─ Shared modals (AddCategoryBottomSheet, ConfirmationBottomSheet)
  ├─ FAB (triggers handleShowAddModal)
  └─ CategoryTabNavigator
      ├─ Tab: "All" → CategoryListContent({
            categories: filterCategories(allCategories, { favoritesOnly: false }),
            ...handlers
          })
      └─ Tab: "Favorites" → CategoryListContent({
            categories: filterCategories(allCategories, { favoritesOnly: true }),
            ...handlers
          })
```

### AllNotesScreen Data Flow

```
AllNotesScreen (parent)
  ├─ Redux: fetchNotes on mount
  ├─ State: modals, activeNoteMenuId, noteToMove, refs
  ├─ Handlers: CRUD, modal controls
  ├─ Shared modals (ConfirmationModal, SelectionBottomSheet)
  ├─ FAB (triggers handleCreateNote)
  └─ NotesTabNavigator
      ├─ Tab: "All" → NotesListContent({ filterType: "all", ...handlers })
      ├─ Tab: "Recent" → NotesListContent({ filterType: "recent", ...handlers })
      ├─ Tab: "Pinned" → NotesListContent({ filterType: "pinned", ...handlers })
      └─ Tab: "Drafts" → NotesListContent({ filterType: "drafts", ...handlers })
```

### Filtering Logic

**CategoryListContent:** Filtering handled by parent using existing `filterCategories` utility.

**NotesListContent:**
```typescript
const filteredNotes = useMemo(() => {
  switch (filterType) {
    case 'recent':
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 7);
      return allNotes
        .filter(n => !n.isDeleted)
        .filter(n => new Date(n.updatedAt ?? n.createdAt) >= oneDayAgo)
        .sort((a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() -
          new Date(a.updatedAt ?? a.createdAt).getTime()
        );
    case 'pinned':
      return allNotes.filter(n => !n.isDeleted && n.isFavorite);
    case 'drafts':
      return allNotes.filter(n => !n.isDeleted && (!n.content?.trim() || !n.title?.trim()));
    default: // 'all'
      return allNotes
        .filter(n => !n.isDeleted)
        .sort((a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() -
          new Date(a.updatedAt ?? a.createdAt).getTime()
        );
  }
}, [allNotes, filterType]);
```

### Handler Flow

**User actions:**
- Tap item → Child component calls `onEdit/onDelete/etc.` → Parent handles via Redux/modals
- Toggle favorite → Child calls `onToggleFavorite` → Parent dispatches update action
- Move note → Child calls `onMove` → Parent shows selection sheet

**State mutations:**
- All CRUD operations dispatch Redux actions
- Redux updates trigger automatic re-renders in all tabs
- Memoization prevents unnecessary re-renders during tab switches

## Styling and Theming

### Tab Bar Configuration

Both navigators use consistent styling with `useTheme`:

```typescript
screenOptions={{
  tabBarStyle: {
    backgroundColor: colors.background,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,
  tabBarIndicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: 3,
  },
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'none',
  },
  tabStyle: {
    paddingVertical: 12,
  },
}}
```

### Theme Compliance

- **Dark mode**: Uses `colors.background` (deep navy/black, e.g., `#15172A`)
- **Light mode**: `colors.background` adapts automatically
- **No semi-transparent "haze"**: Avoids `rgba` overlays for primary card backgrounds
- **Primary color**: Follows app's theme system
- **Typography**: Consistent with current design (font weight 800 active, 600 inactive)
- **Spacing**: 32px gap between tabs (matching current design)

### Visual Consistency

- Tab bar has subtle bottom separator
- No shadows or elevation (clean, flat design)
- Indicator is a rounded bar at bottom
- Colors respect light/dark theme

## Error Handling and Edge Cases

### Network Errors

- Existing `isConnected` state from Redux handles offline mode
- `RefreshControl` disabled when `!isConnected`
- Error toasts handled by existing `showErrorToast` utility

### Empty States

- **CategoryListContent**: Folder icon + "No categories" text
- **NotesListContent**: Document icon + "No notes yet" + subtitle
- Consistent with current implementation

### Loading States

- `RefreshControl` shows loading indicator during fetch
- `isLoading` from Redux selectors controls refresh state
- No new skeleton components (not introducing new loading UI)

### Edge Cases

1. **No categories/notes**: Both components handle empty lists gracefully
2. **Single item**: Grid and list layouts adapt correctly
3. **Rapid tab switching**: `React.memo` prevents unnecessary re-renders
4. **Modal while switching**: Parent-level modals persist across tab switches
5. **FAB visibility**: Always visible regardless of active tab
6. **Active menu cleanup**: `onIndexChange` in TabNavigator clears active menus

### Error Boundaries

- Not adding new error boundaries (existing app-level handling suffices)
- Redux actions already have error handling in sagas

## Dependencies

### New Packages

```bash
npm install @react-navigation/material-top-tabs react-native-pager-view
```

### Existing Dependencies Used

- `@react-navigation/native` - Navigation core
- `react-native-gesture-handler` - Already installed (for bottom sheets)
- `@react-navigation/native-stack` - Already installed

## Implementation Notes

### Performance Optimizations

1. **React.memo**: Both `CategoryListContent` and `NotesListContent` wrapped with `React.memo`
2. **useMemo**: Filtering logic uses `useMemo` to avoid recalculations
3. **Callback memoization**: All handlers use `useCallback` in parents
4. **Single modal instances**: Modals rendered once in parent, not per-tab

### TypeScript Types

- Reuse existing types from `@/types/category/category.types` and `@/types/notes/notes.types`
- Define props interfaces for new components with strict typing
- No `any` types allowed

### Testing Considerations

- Test tab switching behavior
- Test that FAB works from any tab
- Test modal persistence across tabs
- Test filtering logic for each tab
- Test empty states
- Test active menu cleanup on tab switch

### Migration Path

1. Install dependencies
2. Create `CategoryListContent` component
3. Create `CategoryTabNavigator` component
4. Refactor `HomeScreen` to use new structure
5. Create `NotesListContent` component
6. Create `NotesTabNavigator` component
7. Refactor `AllNotesScreen` to use new structure
8. Test thoroughly
9. Delete old custom tab code (scroll views, pressables)

### Rollback Plan

If issues arise:
- Git revert to previous commit
- All changes are contained in specific files
- No database migrations or API changes required

## Success Criteria

- [ ] Material Top Tabs installed and working
- [ ] HomeScreen has "All" and "Favorites" tabs with smooth swipe
- [ ] AllNotesScreen has "All", "Recent", "Pinned", "Drafts" tabs with smooth swipe
- [ ] FAB works from any tab in both screens
- [ ] Modals persist and work correctly across tab switches
- [ ] Active menus close when switching tabs
- [ ] Styling matches current design system
- [ ] Dark mode works correctly (no "haze" overlays)
- [ ] Performance is smooth (no lag on tab switch)
- [ ] All CRUD operations work from any tab
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Tests pass
