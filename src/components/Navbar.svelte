<script>
  import { t } from "../stores/LanguageStore";
</script>

<nav
  class="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10"
>
  <div class="flex items-center gap-2">
    <svg
      class="w-6 h-6 text-[#ea384c]"
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
    <span
      class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ea384c] to-[#ff6b6b]"
    >
      Qi Cinema
    </span>
  </div>
  <div class="flex gap-6 text-sm font-medium items-center">
    <a
      href="#/dashboard"
      class="text-white/60 hover:text-[#ea384c] transition-colors">Movies</a
    >
    <a
      href="#/marathon"
      class="text-white/60 hover:text-[#ea384c] transition-colors flex items-center gap-1"
    >
      <svg
        class="w-4 h-4"
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
      </svg>
      Marathon
    </a>
  </div>
</nav>

<style>
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }
</style>
