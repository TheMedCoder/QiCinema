<script lang="ts">
  import { onMount } from "svelte";
  import { getShows, bookShow, getShow, addShow } from "../api";
  import type { Show } from "../stores/types";
  import QRScanner from "../components/QRScanner.svelte";
  import SeatPicker from "../components/SeatPicker.svelte";
  import { AuthStore } from "../stores/AuthStore.svelte";
  import { TicketStore } from "../stores/TicketStore.svelte";

  let shows = $state<Show[]>([]);
  let selectedShow = $state<Show | null>(null);
  let seatSelection = $state<string[]>([]); // Array of Seat IDs
  let showScanner = $state(false);

  const fetchShows = () => {
    // Fetch all shows for today
    // Use local time for "today" to match the user's perception and store generated data
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    console.log("Fetching shows for:", today);
    getShows(today).then((data) => {
      console.log("Fetched shows:", data);
      shows = data;
    });
  };

  onMount(() => {
    fetchShows();
  });

  const toggleSeat = (id: string) => {
    if (seatSelection.includes(id)) {
      seatSelection = seatSelection.filter((s) => s !== id);
    } else {
      seatSelection = [...seatSelection, id];
    }
  };

  const handleBook = async () => {
    if (!selectedShow) return;
    if (seatSelection.length === 0) {
      // @ts-ignore
      my.alert({
        title: "Error",
        content: "Please select at least one seat",
        buttonText: "OK",
      });
      return;
    }

    const totalPrice = (seatSelection.length * selectedShow.price).toFixed(2);

    try {
      // Step 1: Initiate payment
      // @ts-ignore
      my.alert({
        content: "Processing payment...",
      });

      const paymentRes = await fetch("https://its.mouamle.space/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthStore.backendToken,
        },
      });

      if (!paymentRes.ok) {
        throw new Error("Payment initialization failed");
      }

      const paymentData = await paymentRes.json();

      // Step 2: Launch payment UI
      // @ts-ignore
      my.tradePay({
        paymentUrl: paymentData.url,
        // @ts-ignore
        success: async () => {
          try {
            // Step 3: Book seats after payment succeeds
            if (!selectedShow) return;
            await bookShow(selectedShow.id, seatSelection);

            // Step 4: Save Ticket
            const newTicket = {
              id: crypto.randomUUID(),
              showId: selectedShow.id,
              movieTitle: selectedShow.movie.title,
              roomName: selectedShow.room.name,
              startTime: selectedShow.start,
              seatIds: [...seatSelection],
              pricePaid: parseFloat(totalPrice),
              purchaseTime: new Date().toISOString(),
            };
            TicketStore.addTicket(newTicket);

            // @ts-ignore
            my.alert({
              title: "Success",
              content: "Payment and booking successful!",
              buttonText: "OK",
              success: () => {
                seatSelection = [];
                selectedShow = null;
                fetchShows();
              },
            });
          } catch (bookError: any) {
            // @ts-ignore
            my.alert({
              title: "Booking Error",
              content: `Payment succeeded but booking failed: ${bookError.response?.data || bookError.message}`,
              buttonText: "OK",
            });
          }
        },
        // @ts-ignore
        fail: (err) => {
          // @ts-ignore
          my.alert({
            title: "Payment Failed",
            content: "Payment was cancelled or failed. No booking made.",
            buttonText: "OK",
            success: () => {
              selectedShow = null;
              seatSelection = [];
            },
          });
        },
      });
    } catch (e: any) {
      // @ts-ignore
      my.alert({
        title: "Error",
        content: `Failed to process payment: ${e.message}`,
        buttonText: "OK",
      });
    }
  };

  // const handleBook = () => {
  //           fetch('https://its.mouamle.space/api/payment', {
  //               method: 'POST',
  //               headers: {
  //                   'Content-Type': 'application/json',
  //                   'Authorization': AuthStore.backendToken
  //               },
  //           }).then(res => res.json()).then(data => {
  //               // @ts-ignore
  //               my.tradePay({
  //                   paymentUrl: data.url,
  //                   // @ts-ignore
  //                   success: (res) => {
  //                       // @ts-ignore
  //                       my.alert({
  //                           content: "Payment successful",
  //                       });
  //                   },
  //               });
  //           // @ts-ignore
  //           }).catch(err => {
  //               // @ts-ignore
  //               my.alert({
  //                   content: "Payment failed",
  //               });
  //           });
  //       }

  const handleScan = (text: string) => {
    showScanner = false;

    console.log("Raw scanned text:", text);

    // Clean up the text (trim whitespace)
    const cleanText = text.trim();

    // First, try to parse as JSON (most likely for adding shows)
    try {
      const parsedData = JSON.parse(cleanText);
      console.log("Successfully parsed JSON:", parsedData);

      // Check if it has show structure (movie, room, start, price)
      if (
        parsedData.movie &&
        parsedData.room &&
        parsedData.start &&
        parsedData.price
      ) {
        console.log("Valid show structure detected, adding show...");
        // Add the show
        addShow(parsedData)
          .then((newShow) => {
            // @ts-ignore
            my.alert({
              title: "Success",
              content: `Show "${newShow.movie.title}" added successfully!`,
              buttonText: "OK",
              success: () => {
                fetchShows();
              },
            });
          })
          .catch((e) => {
            console.error("Failed to add show:", e);
            // @ts-ignore
            my.alert({
              title: "Error",
              content: `Failed to add show: ${e.response?.data || e.message}`,
              buttonText: "OK",
            });
          });
      } else {
        // Valid JSON but not a show structure
        // @ts-ignore
        my.alert({
          title: "Scanned Data",
          content: JSON.stringify(parsedData, null, 2),
          buttonText: "OK",
        });
      }
    } catch (jsonError) {
      console.log("Not valid JSON, trying as show ID...");
      // Not JSON, try to fetch show by ID (assuming text is UUID)
      getShow(cleanText)
        .then((show) => {
          selectedShow = show;
        })
        .catch(() => {
          // Not a show ID either, show error
          // @ts-ignore
          my.alert({
            title: "Scan Result",
            content: `Scanned text:\n${cleanText.substring(0, 200)}${cleanText.length > 200 ? "..." : ""}\n\nLength: ${cleanText.length} chars\n\nNot a valid show ID or JSON format.\n\nExpected: Show UUID or JSON with {movie, room, start, price}`,
            buttonText: "OK",
          });
        });
    }
  };
</script>

<div class="p-8 max-w-7xl mx-auto">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold">Now Showing</h1>

    <button
      onclick={() => (showScanner = true)}
      class="flex items-center gap-2 bg-[#ff6b6b] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ff6b6b]/90 transition-colors"
    >
      <svg
        class="w-5 h-5"
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
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
      </svg>
      Scan Ticket
    </button>
  </div>

  {#if showScanner}
    <QRScanner onScan={handleScan} onClose={() => (showScanner = false)} />
  {/if}

  {#if shows.length === 0}
    <div class="text-white/60 text-center py-12">
      No shows scheduled for today.
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each shows as show (show.id)}
        {@const availableSeats = show.seats.filter(
          (s) => s.status === "available",
        ).length}
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#ea384c]/50 transition-colors group"
        >
          <h2
            class="text-2xl font-bold mb-2 group-hover:text-[#ea384c] transition-colors"
          >
            {show.movie.title}
          </h2>
          <div class="space-y-2 text-white/60 mb-6">
            <div class="flex items-center gap-2">
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                >{new Date(show.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - {show.movie.duration}</span
              >
            </div>
            <div class="flex items-center gap-2">
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
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{show.room.name}</span>
            </div>
            <div class="flex items-center gap-2">
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
                <path d="M12 2 2 7l10 5 10-5-10-5z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              <span class="text-[#ff6b6b] font-bold">${show.price}</span>
            </div>
            <div class="text-sm">
              Seats: <span class="text-white">{availableSeats}</span> / {show
                .seats.length}
            </div>
          </div>
          <button
            onclick={() => (selectedShow = show)}
            disabled={availableSeats === 0}
            class="w-full py-2 bg-[#ea384c]/20 text-[#ea384c] rounded-lg font-bold hover:bg-[#ea384c] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availableSeats === 0 ? "Sold Out" : "Book Tickets"}
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if selectedShow}
    <div
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <div
        class="bg-[#0a0a0a] bg-white/5 backdrop-blur-md p-8 rounded-2xl max-w-xl w-full border border-[#ea384c]/20 shadow-2xl shadow-[#ea384c]/10 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-2xl font-bold">{selectedShow.movie.title}</h3>
            <div class="text-sm text-white/60 mt-1 flex items-center gap-2">
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
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selectedShow.room.name}
              <span class="text-white/20">|</span>
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {new Date(selectedShow.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <button
            onclick={() => (selectedShow = null)}
            class="p-2 hover:bg-white/10 rounded-full transition-colors"
            >✕</button
          >
        </div>

        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <label
              class="text-sm font-bold text-white/60 uppercase tracking-wider"
              >Choose Your Seats</label
            >
            <div
              class="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-[#ea384c]/30"
            >
              Seats No: <span class="text-[#ea384c] text-lg ml-2"
                >{seatSelection.length}</span
              >
            </div>
          </div>

          <SeatPicker
            show={selectedShow}
            selectedSeats={seatSelection}
            onToggleSeat={toggleSeat}
          />
        </div>

        <div class="flex gap-4 pt-4 border-t border-white/10">
          <div class="flex-1">
            <span class="block text-xs text-white/60">Total Price</span>
            <span class="text-2xl font-bold text-white"
              >${(seatSelection.length * selectedShow.price).toFixed(2)}</span
            >
          </div>
          <button
            onclick={handleBook}
            disabled={seatSelection.length === 0}
            class="flex-1 py-3 bg-[#ea384c] rounded-xl font-bold hover:bg-[#ea384c]/90 transition-all text-white shadow-lg shadow-[#ea384c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
