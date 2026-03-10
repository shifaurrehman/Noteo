import { ViewCategoryNotesParams } from "@/types/notes/notes.types";
import { useRouter } from "expo-router";

export const useNavigation = () => {
  const router = useRouter();

  const viewCategoryNotes = ({ categoryId, categoryName, isFavorite }: ViewCategoryNotesParams) => {
    const path = isFavorite ? "favorites" : "home";
    router.push({
      pathname: "/notes/[categoryId]",
      params: {
        categoryId,
        name: categoryName,
        isFavorite: isFavorite ? "true" : "false",
      },
    });
  };

  const addUpdateNote = (categoryId: string) => {
    router.push({
      pathname: "/notes/[categoryId]/add-note",
      params: {
        categoryId,
      },
    });
  };

  const openFavoriteNotes = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: "/notes/[categoryId]",
      params: {
        categoryId,
        name: categoryName,
      },
    });
  };

  const redirectLogin = () => {
    router.replace("/login");
  };

  const redirectHome = () => {
    router.replace("/home");
  };

  const openSettings = () => {
    router.push("/settings");
  };

  const redirectVerifyEmail = (email: string) => {
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  const redirectRegister = () => {
    router.push("/register");
  };

  const redirectForgotPassword = () => {
    router.push("/forgot-password");
  };

  return {
    viewCategoryNotes,
    addUpdateNote,
    openFavoriteNotes,
    redirectLogin,
    redirectHome,
    openSettings,
    redirectVerifyEmail,
    redirectRegister,
    redirectForgotPassword,
  };
};
