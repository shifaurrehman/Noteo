import { Stack } from 'expo-router';

export default function NotesLayout() {
    return (
        <Stack>
            <Stack.Screen name="[categoryId]/index" options={{ headerShown: false }} />
            <Stack.Screen
                name="[categoryId]/addNote/index"
                options={{
                    presentation: 'formSheet',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}