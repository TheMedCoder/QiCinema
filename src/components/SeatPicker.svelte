<script lang="ts">
  import type { Seat, Show } from '../stores/types';

  interface Props {
    show: Show;
    selectedSeats: string[]; // List of Seat IDs
    onToggleSeat: (id: string) => void;
  }

  let { show, selectedSeats, onToggleSeat }: Props = $props();

  let rows = $derived(
    show.seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>)
  );
</script>

<div class="w-full flex flex-col items-center select-none">
  
  <div class="flex flex-wrap justify-center gap-4 mb-8 text-sm px-4">
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 bg-red-500/20 border border-red-500 rounded flex items-center justify-center">
        <span class="text-red-500 text-xs">✕</span>
      </div>
      <span class="text-white/60">Sold</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 bg-emerald-500/20 border border-emerald-500 rounded"></div>
      <span class="text-white/60">Available</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 bg-emerald-500 border border-emerald-500 rounded text-white flex items-center justify-center text-xs">✓</div>
      <span class="text-white/60">Selected</span>
    </div>
  </div>

  
  <div class="w-full overflow-x-auto pb-8 -mx-8 px-8">
    <div class="flex flex-col items-center gap-3 min-w-max mx-auto">
      <!-- Screen -->
      <div class="w-full max-w-sm mb-8">
        <div class="w-full h-12 relative flex justify-center">
          <div class="absolute inset-0 border-t-4 border-[#ea384c]/20 rounded-[50%] -top-4 shadow-[0_-20px_30px_-5px_rgba(255,255,255,0.1)]"></div>
          <span class="text-xs text-white/60 uppercase tracking-widest mt-2">Screen</span>
        </div>
      </div>
      {#each Object.entries(rows) as [rowLabel, seats]}
        <div class="flex gap-4 items-center justify-center">
          <div class="w-4 font-bold text-white/60 text-sm sticky left-0 bg-[#0a0a0a] z-10 p-2 pr-4 rounded">{rowLabel}</div>
          <div class="flex gap-2">
            {#each seats.sort((a, b) => a.number - b.number) as seat}
              {@const isSelected = selectedSeats.includes(seat.id)}
              {@const isBooked = seat.status === 'booked'}
              <button
                disabled={isBooked}
                onclick={() => onToggleSeat(seat.id)}
                class="w-8 h-8 rounded-t-lg rounded-b-sm border flex items-center justify-center text-xs font-medium transition-all
                  {isBooked
                    ? 'bg-red-500/20 border-red-500/50 text-red-500 cursor-not-allowed opacity-50'
                    : isSelected
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] transform -translate-y-1'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                  }"
              >
                {isBooked ? '✕' : seat.number}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
