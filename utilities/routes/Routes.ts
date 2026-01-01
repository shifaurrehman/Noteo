import { router } from "expo-router";

export const openNotes = (categoryId: string, categoryName: string) => {
  router.push({
    pathname: "/(tabs)/home/notes/[categoryId]",
    params: {
      categoryId,
      name: categoryName,
    },
  });
};


export const RedirectLogin = () => {
  router.replace("/auth/Login");
};

export const RedirectHome = () => {
  router.replace("/(tabs)/home")
}