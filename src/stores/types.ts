export interface Room {
    name: string;
    capacity: number;
}

export interface Movie {
    title: string;
    duration: string;
}

export interface Seat {
    id: string;
    row: string;
    number: number;
    status: 'available' | 'booked';
}

export interface Show {
    id: string;
    movie: Movie;
    room: Room;
    start: string;
    end: string;
    price: number;
    seats: Seat[];
}

export interface MarathonPlan {
    date: string;
    shows: Show[];
    totalDuration: string;
    count: number;
}

export interface Ticket {
    id: string;
    showId: string;
    movieTitle: string;
    roomName: string;
    startTime: string;
    seatIds: string[];
    pricePaid: number;
    purchaseTime: string;
}
