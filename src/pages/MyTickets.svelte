<script lang="ts">
    import { TicketStore } from "../stores/TicketStore.svelte";
    import { onMount } from "svelte";
</script>

<div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">My Tickets</h1>

    {#if TicketStore.tickets.length === 0}
        <div
            class="text-white/60 text-center py-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
        >
            <p class="text-xl">You haven't booked any tickets yet.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each TicketStore.tickets as ticket (ticket.id)}
                <div
                    class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-[#ea384c]/50 transition-colors group"
                >
                    <!-- Ticket Info -->
                    <div class="flex-1 space-y-4">
                        <div>
                            <h2
                                class="text-2xl font-bold group-hover:text-[#ea384c] transition-colors"
                            >
                                {ticket.movieTitle}
                            </h2>
                            <p class="text-white/60 text-sm">
                                {ticket.roomName}
                            </p>
                        </div>

                        <div class="flex items-center gap-4 text-sm">
                            <div
                                class="bg-black/40 px-3 py-1.5 rounded-lg flex items-center gap-2"
                            >
                                <svg
                                    class="w-4 h-4 text-[#ea384c]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="4"
                                        rx="2"
                                    /><line
                                        x1="16"
                                        x2="16"
                                        y1="2"
                                        y2="6"
                                    /><line x1="8" x2="8" y1="2" y2="6" /><line
                                        x1="3"
                                        x2="21"
                                        y1="10"
                                        y2="10"
                                    /></svg
                                >
                                {new Date(
                                    ticket.startTime,
                                ).toLocaleDateString()}
                            </div>
                            <div
                                class="bg-black/40 px-3 py-1.5 rounded-lg flex items-center gap-2"
                            >
                                <svg
                                    class="w-4 h-4 text-[#ea384c]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><circle cx="12" cy="12" r="10" /><polyline
                                        points="12 6 12 12 16 14"
                                    /></svg
                                >
                                {new Date(ticket.startTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                )}
                            </div>
                        </div>

                        <div>
                            <span
                                class="text-xs text-white/40 uppercase tracking-wider font-bold"
                                >Seats</span
                            >
                            <div class="flex flex-wrap gap-2 mt-1">
                                {#each ticket.seatIds as seat}
                                    <span
                                        class="bg-[#ea384c]/20 text-[#ea384c] px-2 py-1 rounded text-xs font-bold border border-[#ea384c]/20"
                                        >{seat}</span
                                    >
                                {/each}
                            </div>
                        </div>

                        <div
                            class="pt-4 border-t border-white/10 flex justify-between items-end"
                        >
                            <div>
                                <span
                                    class="text-xs text-white/40 uppercase tracking-wider font-bold"
                                    >Total Paid</span
                                >
                                <div class="text-xl font-bold">
                                    ${ticket.pricePaid.toFixed(2)}
                                </div>
                            </div>
                            <div class="text-xs text-white/20">
                                ID: {ticket.id.slice(0, 8)}...
                            </div>
                        </div>
                    </div>

                    <!-- QR Code Section (Mock Visual) -->
                    <div
                        class="bg-white p-4 rounded-xl flex items-center justify-center shrink-0"
                    >
                        <!-- This is where a real QR code would go. For now, a visual placeholder. -->
                        <div
                            class="w-24 h-24 bg-black flex items-center justify-center text-white text-xs text-center p-1"
                        >
                            QR Code for<br />{ticket.id.slice(0, 5)}...
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
