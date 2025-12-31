import type { Component } from 'svelte';
import Dashboard from './pages/Dashboard.svelte';
import LoginPage from './pages/LoginPage.svelte';
import Marathon from './pages/Marathon.svelte';
import MyTickets from './pages/MyTickets.svelte';

interface Route {
  title: string;
  path: string;
  component: Component;
}

export const routes: Route[] = [
  {
    path: "/dashboard",
    title: "dashboard",
    component: Dashboard,
  },
  {
    path: "/auth",
    title: "auth",
    component: LoginPage,
  },
  {
    path: "/marathon",
    title: "marathon",
    component: Marathon,
  },
  {
    path: "/mytickets",
    title: "mytickets",
    component: MyTickets,
  },
];
