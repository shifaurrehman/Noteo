import { Stack } from 'expo-router';

export default function NotesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[categoryId]/index" />
            <Stack.Screen
                name="[categoryId]/add-note"
                options={{
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}
