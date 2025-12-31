<script lang="ts">
  import { getMarathonPlan } from "../api";
  import type { MarathonPlan } from "../stores/types";

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  let date = $state(localDate);
  let plan = $state<MarathonPlan | null>(null);

  const handlePlan = async () => {
    try {
      const data = await getMarathonPlan(date);
      plan = data;
    } catch (e) {
      // @ts-ignore
      my.alert({
        title: "Error",
        content: "Failed to plan marathon. Maybe no shows?",
        buttonText: "OK",
      });
    }
  };
</script>

<div class="p-8 max-w-4xl mx-auto">
  <div class="flex flex-col md:flex-row md:items-end gap-6 mb-12">
    <div class="flex-1">
      <label class="block text-sm font-medium mb-2 text-white/60"
        >Pick a Date for Your Marathon</label
      >
      <input
        type="date"
        bind:value={date}
        class="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-lg focus:border-[#ea384c] outline-none text-white"
      />
    </div>
    <button
      onclick={handlePlan}
      class="bg-[#ea384c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ea384c]/90 transition-all shadow-lg shadow-[#ea384c]/25 whitespace-nowrap"
    >
      Plan Marathon
    </button>
  </div>

  {#if plan}
    <div class="animate-fade-in">
      <div
        class="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl backdrop-blur-md"
      >
        <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
          <svg
            class="w-8 h-8 text-[#ff6b6b]"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="m9 16 2 2 4-4" />
          </svg>
          Marathon Schedule
        </h2>
        <div class="text-white/60 flex gap-8 text-lg">
          <span class="font-bold text-white">{plan.count} Movies</span>
          <span
            >Total Duration: <span class="text-[#ff6b6b]"
              >{plan.totalDuration}</span
            ></span
          >
        </div>
      </div>

      <div class="relative border-l-2 border-[#ea384c]/30 ml-4 space-y-8 py-4">
        {#each plan.shows as show, i (show.id)}
          <div
            class="relative pl-8 animate-fade-in"
            style="animation-delay: {i * 100}ms"
          >
            <div
              class="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-[#ea384c] ring-4 ring-[#0a0a0a]"
            />
            <div
              class="bg-white/5 backdrop-blur-md p-6 rounded-xl hover:bg-white/10 transition-colors border-l-4 border-l-[#ea384c]"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-white">{show.movie.title}</h3>
                <span
                  class="text-[#ff6b6b] font-mono text-sm bg-[#ff6b6b]/10 px-2 py-1 rounded"
                >
                  {new Date(show.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div class="flex items-center gap-6 text-sm text-white/60 mt-4">
                <span class="flex items-center gap-2">
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
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {show.movie.duration}
                </span>
                <span class="flex items-center gap-2">
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
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  {show.room.name}
                </span>
              </div>
            </div>
          </div>
        {/each}

        {#if plan.shows.length === 0}
          <div class="text-white/60 pl-8">
            No suitable shows found for a marathon on this date.
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
</style>
