import { navigationStore } from "../stores/NavigationStore";

export const navigate = (page: string) => {
  navigationStore.set({ page });
};