import { writable } from "svelte/store";
import { AuthStore } from "./AuthStore.svelte";

const getInitialPage = () => {
  const hash = window.location.hash.slice(1);

  const isAuthenticated = !!AuthStore.authCode;

  if (isAuthenticated && hash === "/auth") {
    return "/dashboard";
  }

  return hash || (isAuthenticated ? "/dashboard" : "/auth");
};

export const navigationStore = writable({
  page: getInitialPage(),
});

navigationStore.subscribe((state) => {
  if (window.location.hash.slice(1) !== state.page) {
    window.location.hash = state.page;
  }
});

// Listen for browser back/forward buttons
window.addEventListener("hashchange", () => {
  const newPage = window.location.hash.slice(1) || "/dashboard";
  const isAuthenticated = !!AuthStore.authCode;
  
  // Prevent going back to auth page if logged in
  if (isAuthenticated && newPage === "/auth") {
    navigationStore.set({ page: "/dashboard" });
    return;
  }
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated && newPage !== "/auth") {
    navigationStore.set({ page: "/auth" });
    return;
  }
  
  navigationStore.set({ page: newPage });
});