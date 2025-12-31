
import type { Ticket } from './types';

let tickets = $state<Ticket[]>([]);

export const TicketStore = {
    get tickets() {
        return tickets;
    },
    addTicket(ticket: Ticket) {
        tickets = [...tickets, ticket];
    }
};
