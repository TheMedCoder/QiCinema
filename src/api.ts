import type { Room, Movie } from './stores/types';
import { Store } from './stores/store';

// Helper to simulate network delay
const delay = <T>(data: T, ms = 500) => new Promise<T>(resolve => setTimeout(() => resolve(data), ms));

export const getRooms = () => delay(Store.getRooms());
export const createRoom = (data: Room) => {
    // Read-only for this demo
    return delay(data);
};

export const getMovies = () => delay(Store.getMovies());
export const createMovie = (data: { title: string; duration: string }) => {
    return delay({ ...data } as Movie);
};

export const getShow = (id: string) => {
    const s = Store.getShow(id);
    if (!s) return Promise.reject("Show not found");
    return delay(s);
};

export const getShows = (date?: string) => delay(Store.getShows(date));

export const createShow = (_data: { movieTitle: string; roomName: string; start: string; price: number }) => {
    return Promise.reject("Not implemented in client-only mode");
};

export const addShow = (showData: any) => {
    try {
        const newShow = Store.addShow(showData);
        return delay(newShow);
    } catch (e: any) {
        return Promise.reject({ response: { data: e.message } });
    }
};

export const bookShow = (showId: string, seats: string[]) => {
    try {
        const res = Store.book(showId, seats);
        return delay(res);
    } catch (e: any) {
        return Promise.reject({ response: { data: e.message } });
    }
};

export const getMarathonPlan = (date: string) => delay(Store.planMarathon(date));
