import { ViewCategoryNotesParams } from "@/types/notes";
import { useRouter } from "expo-router";

export const useNavigation = () => {
  const router = useRouter();

  const viewCategoryNotes = ({categoryId, categoryName, isFavorite}: ViewCategoryNotesParams) => {
    const path = isFavorite ? "favorites" : "home";
    router.push({
      pathname: `/(tabs)/${path}/notes/[categoryId]`,
      params: {
        categoryId,
        name: categoryName,
        isFavorite : isFavorite ? "true" : "false",
      },
    });
  };

  const addUpdateNote = (categoryId: string) => {
    router.push({
      pathname: "/(tabs)/home/notes/[categoryId]/addNote",
      params: {
        categoryId,
      },
    });
  };

  const openFavoriteNotes = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: "/(tabs)/favorites/notes/[categoryId]",
      params: {
        categoryId,
        name: categoryName,
      },
    });
  };

  const redirectLogin = () => {
    router.replace("/auth/Login");
  };

  const redirectHome = () => {
    router.replace("/(tabs)/home");
  };

  const openSettings = () => {
    router.push("/screens/settings");
  };

  return { viewCategoryNotes, addUpdateNote, openFavoriteNotes, redirectLogin, redirectHome, openSettings, };
};
