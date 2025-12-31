import type { Room, Movie, Show, MarathonPlan } from './types';

// ==========================================
// SEED DATA
// ==========================================

const rooms: Room[] = [
    { name: 'Room A', capacity: 50 },
    { name: 'Room B', capacity: 100 },
];

const movies: Movie[] = [
    { title: 'Inception', duration: '02:28:00' },
    { title: 'The Matrix', duration: '02:16:00' },
    { title: 'Interstellar', duration: '02:49:00' },
];

// Helper to add hours to just the time part of a date for demo simplicity
const today = new Date();
const setTime = (hours: number) => {
    const d = new Date(today);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
};

// Helper to generate seats for a room
const generateSeats = (rows: number, seatsPerRow: number): import('./types').Seat[] => {
    const seats: import('./types').Seat[] = [];
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (let r = 0; r < rows; r++) {
        for (let s = 1; s <= seatsPerRow; s++) {
            seats.push({
                id: `${rowLabels[r]}${s}`,
                row: rowLabels[r],
                number: s,
                status: 'available'
            });
        }
    }

    // Simulate some random booked seats
    if (Math.random() > 0.5) {
        const randomIdx = Math.floor(Math.random() * seats.length);
        seats[randomIdx].status = 'booked';
    }

    return seats;
};

const initialShows: Show[] = [
    // Room A - Inception
    {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        movie: movies[0],
        room: rooms[0],
        start: setTime(10), // 10:00
        end: setTime(12 + (28 / 60)),
        price: 12.50,
        seats: generateSeats(5, 8) // 5 rows x 8 seats = 40 (close to 50 cap)
    },
    {
        id: 'a881f1ee-6c54-4b01-90e6-d701748f0852',
        movie: movies[0],
        room: rooms[0],
        start: setTime(14), // 14:00
        end: setTime(16 + (28 / 60)),
        price: 12.50,
        seats: generateSeats(5, 8)
    },
    // Room B - Matrix
    {
        id: 'b991f1ee-6c54-4b01-90e6-d701748f0853',
        movie: movies[1],
        room: rooms[1],
        start: setTime(11),
        end: setTime(13 + (16 / 60)),
        price: 11.00,
        seats: generateSeats(8, 10) // 80 seats
    },
    {
        id: 'c771f1ee-6c54-4b01-90e6-d701748f0854',
        movie: movies[1],
        room: rooms[1],
        start: setTime(15),
        end: setTime(17 + (16 / 60)),
        price: 11.00,
        seats: generateSeats(8, 10)
    },
    // Room B - Interstellar
    {
        id: 'e661f1ee-6c54-4b01-90e6-d701748f0855',
        movie: movies[2],
        room: rooms[1],
        start: setTime(19),
        end: setTime(21 + (49 / 60)),
        price: 15.00,
        seats: generateSeats(8, 10)
    }
];

// Internal state
let showStore: Show[] = [...initialShows];

// ==========================================
// LOGIC
// ==========================================

export const Store = {
    getRooms: () => rooms,
    getMovies: () => movies,

    getShows: (date?: string) => {
        if (!date) return showStore;
        // Simple string comparison for YYYY-MM-DD
        return showStore.filter(s => s.start.startsWith(date));
    },

    getShow: (id: string) => {
        return showStore.find(s => s.id === id);
    },

    book: (showId: string, seatIds: string[]) => { // changed valid seats to string IDs
        const show = showStore.find(s => s.id === showId);
        if (!show) throw new Error("Show not found");

        // Validate all seats are free
        const requestedSeats = show.seats.filter(s => seatIds.includes(s.id));
        if (requestedSeats.some(s => s.status === 'booked')) {
            throw new Error("One or more selected seats are already booked");
        }

        // Mark as booked
        requestedSeats.forEach(s => s.status = 'booked');

        const remaining = show.seats.filter(s => s.status === 'available').length;
        return { message: "Booked", remaining };
    },

    addShow: (showData: Omit<Show, 'id' | 'seats'> & { rows?: number, seatsPerRow?: number }) => {
        const newShow: Show = {
            id: crypto.randomUUID(),
            movie: showData.movie,
            room: showData.room,
            start: showData.start,
            end: showData.end,
            price: showData.price,
            seats: generateSeats(showData.rows || 5, showData.seatsPerRow || 8)
        };
        showStore.push(newShow);
        return newShow;
    },

    // GREEDY ALGORITHM PORT
    planMarathon: (date: string): MarathonPlan => {
        // 1. Filter
        const dayShows = showStore.filter(s => s.start.startsWith(date));

        // 2. Sort by End Time
        //   (We need to calculate End Date objects for comparison)
        const getEnd = (s: Show) => {
            const [h, m] = s.movie.duration.split(':').map(Number);
            const d = new Date(s.start);
            d.setHours(d.getHours() + h, d.getMinutes() + m);
            return d;
        };

        const sorted = [...dayShows].sort((a, b) => {
            return getEnd(a).getTime() - getEnd(b).getTime();
        });

        const plan: Show[] = [];
        let lastEnd = new Date(0); // Epoch

        // 3. Selection
        for (const show of sorted) {
            const start = new Date(show.start);
            if (start >= lastEnd && !plan.some(s => s.movie.title === show.movie.title)) {
                plan.push(show);
                lastEnd = getEnd(show);
            }
        }

        // Calculate total duration string
        let totalMinutes = 0;
        for (const s of plan) {
            const [h, m] = s.movie.duration.split(':').map(Number);
            totalMinutes += (h * 60) + m;
        }

        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        return {
            date,
            shows: plan,
            count: plan.length,
            totalDuration: `${h}h ${m}m`
        };
    }
};
