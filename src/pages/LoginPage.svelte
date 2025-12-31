<script>
  // @ts-nocheck
  import { removeToken, saveToken } from "../storage/token";
  import { navigate } from "../utils/helper";
  import { t } from "../stores/LanguageStore";
  import { AuthStore } from "../stores/AuthStore.svelte";

  removeToken();

  function handleLogin() {
    my.getAuthCode({
      scopes: ["auth_base"],
      success: (res) => {
        const code = res.authCode || res.authcode;
        AuthStore.authCode = code; // Save authCode from super app

        fetch("https://its.mouamle.space/api/auth-with-superQi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: code }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(`Server responded with status: ${res.status}`);
            }
          })
          .then((data) => {
            // Save the token returned by YOUR backend
            const backendToken =
              data.token || data.accessToken || data.access_token;

            if (backendToken) {
              saveToken(backendToken); // Save to sessionStorage
              AuthStore.backendToken = backendToken; // Save backend token separately
              
            } else {
              // Fallback: save authCode if backend doesn't return a token
              saveToken(code);
              AuthStore.token = code;
            }

            my.alert({
              title: "Authentication Successful",
              content: `Welcome!`,
              buttonText: "Continue",
              success: () => {
                window.location.replace("#/dashboard");
              },
            });
          })
          .catch((error) => {
            // Save authCode and proceed even if backend fails (for development)
            my.alert({
              title: "Warning",
              content: `Backend not available. Proceeding with local auth.`,
              buttonText: "Continue",
              success: () => {
                saveToken(code);
                AuthStore.token = code; // Use authCode as fallback token
                window.location.replace("#/dashboard");
              },
            });
          });
      },
      fail: (res) => {
        my.alert({
          title: "Auth Code Failed",
          content: `Error scopes: ${res.authErrorScopes?.join(", ") || "Unknown error"}`,
          buttonText: "OK",
        });
      },
    });
  }
</script>

<svelte:head>
  <script
    src="https://cdn.marmot-cloud.com/npm/hylid-bridge/2.10.0/index.js"
  ></script>
</svelte:head>

<main class="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0a0a]">
  <div class="max-w-md w-full p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(234,56,76,0.15)] flex flex-col items-center text-center">
    
    <div class="mb-6 p-3 bg-[#ea384c]/10 rounded-full border border-[#ea384c]/20">
      <div class="w-10 h-10 bg-gradient-to-br from-[#ea384c] to-[#ff6b6b] rounded-full shadow-[0_0_20px_rgba(234,56,76,0.4)]"></div>
    </div>

    <h1 class="text-[1.75rem] font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
      {$t("welcome Back") || "Welcome Back"}
    </h1>
    <p class="text-white/50 mb-8 text-sm">
      Continue to access your QiCinema account
    </p>

    <button
      onclick={handleLogin}
      class="w-full py-3.5 px-6 bg-[#ea384c] hover:bg-[#ff4757] text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(234,56,76,0.3)] group"
    >
      <span>Continue to QiCinema</span>
      <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    </button>

    <div class="mt-6 text-xs text-white/40">
      By continuing, you agree to our <span class="text-white hover:underline cursor-pointer">Terms</span> and <span class="text-white hover:underline cursor-pointer">Privacy Policy</span>.
    </div>
  </div>
</main>

<style>
  /* Tailwind utility classes are used inline */
</style>
