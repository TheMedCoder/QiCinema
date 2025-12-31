
import { Store } from './stores/store';

// Mock crypto if needed (since we are running in node, it might be available in newer node versions, but better safe)
if (!globalThis.crypto) {
    // @ts-ignore
    globalThis.crypto = { randomUUID: () => "mock-uuid-" + Math.random().toString(36).substring(7) };
}

const payload = {
    "movie": { "title": "Avatar", "duration": "02:42:00" },
    "room": { "name": "Room A", "capacity": 50 },
    "start": new Date().toISOString(),
    "end": new Date(Date.now() + 2 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString(), // + 2h 42m
    "price": 14.50,
    "rows": 6,
    "seatsPerRow": 10
};

console.log("---------------------------------------------------");
console.log("Testing Store.addShow with payload:");
console.log(JSON.stringify(payload, null, 2));

try {
    const newShow = Store.addShow(payload as any);
    console.log("Show added successfully!");
    console.log("New Show ID:", newShow.id);
    console.log("Number of seats generated:", newShow.seats.length);
    console.log("Check seats count match (rows * seatsPerRow):", newShow.seats.length === (payload.rows * payload.seatsPerRow) ? "MATCH" : "MISMATCH");

    // Check first and last seat
    console.log("First seat:", newShow.seats[0]);
    console.log("Last seat:", newShow.seats[newShow.seats.length - 1]);

} catch (e: any) {
    console.error("FAILED to add show:", e.message);
    console.error(e);
}
console.log("---------------------------------------------------");
