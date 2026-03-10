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

  const openAddNote = (categoryId: string) => {
    router.push({
      pathname: "/notes/[categoryId]/add-note",
      params: { categoryId },
    });
  };

  const openEditNote = (categoryId: string, noteId: string) => {
    router.push({
      pathname: "/notes/[categoryId]/add-note",
      params: { categoryId, noteId },
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

  const redirectResetPassword = (email: string) => {
    router.push({
      pathname: "/(auth)/reset-password",
      params: { email },
    });
  };

  return {
    viewCategoryNotes,
    openAddNote,
    openEditNote,
    openFavoriteNotes,
    redirectLogin,
    redirectHome,
    openSettings,
    redirectVerifyEmail,
    redirectRegister,
    redirectForgotPassword,
    redirectResetPassword
  };
};
