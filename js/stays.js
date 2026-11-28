/**
 * js/stays.js
 * Controller for the Stays Directory page of NorthPeak Tours
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("searchForm");
  const destInput = document.getElementById("destInput");
  const checkinInput = document.getElementById("checkinInput");
  const checkoutInput = document.getElementById("checkoutInput");
  const guestsInput = document.getElementById("guestsInput");
  const resetBtn = document.getElementById("resetSearchBtn");
  const pillsContainer = document.getElementById("destinationPills");
  const sortSelect = document.getElementById("sortSelect");
  const hotelGrid = document.getElementById("hotelGrid");
  const emptyState = document.getElementById("emptyState");
  const emptyResetBtn = document.getElementById("emptyResetBtn");
  const resultsCountEl = document.getElementById("resultsCount");
  const savedCountBadges = document.querySelectorAll(".np-saved-count");
  const savedListContainer = document.getElementById("savedListContainer");
  const clearSavedBtn = document.getElementById("clearSavedBtn");

  const STORAGE_KEY = "northpeak_saved_stays_v1";

  // State
  let currentFilters = {
    destination: "all",
    checkin: "",
    checkout: "",
    guests: 2,
    sortBy: "recommended"
  };

  // 1. Date Setup & Validations
  function setupDefaultDates() {
    const today = new Date();
    
    // Check-in minimum is today
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    checkinInput.min = todayStr;

    // Default dates: 3 and 5 days from today
    const defCheckin = new Date();
    defCheckin.setDate(today.getDate() + 3);
    const defCheckout = new Date();
    defCheckout.setDate(today.getDate() + 5);

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Check query params if user returned back from room-details
    const params = new URLSearchParams(window.location.search);
    const qCheckin = params.get("checkin");
    const qCheckout = params.get("checkout");
    const qGuests = params.get("guests");
    const qDest = params.get("destination");

    checkinInput.value = qCheckin || formatDate(defCheckin);
    updateCheckoutMin(checkinInput.value);
    checkoutInput.value = qCheckout || formatDate(defCheckout);
    if (qGuests) guestsInput.value = qGuests;
    if (qDest) currentFilters.destination = qDest;

    currentFilters.checkin = checkinInput.value;
    currentFilters.checkout = checkoutInput.value;
    currentFilters.guests = parseInt(guestsInput.value, 10) || 2;
  }

  function updateCheckoutMin(checkinVal) {
    if (!checkinVal) return;
    const d = new Date(checkinVal);
    // Checkout minimum is next day
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const minCheckoutStr = `${yyyy}-${mm}-${dd}`;
    checkoutInput.min = minCheckoutStr;

    // If current checkout is earlier or equal to checkin, adjust it
    if (checkoutInput.value && checkoutInput.value <= checkinVal) {
      checkoutInput.value = minCheckoutStr;
    }
  }

  checkinInput.addEventListener("change", (e) => {
    updateCheckoutMin(e.target.value);
    currentFilters.checkin = e.target.value;
    currentFilters.checkout = checkoutInput.value;
    render();
  });

  checkoutInput.addEventListener("change", (e) => {
    currentFilters.checkout = e.target.value;
    render();
  });

  guestsInput.addEventListener("change", (e) => {
    currentFilters.guests = parseInt(e.target.value, 10) || 2;
    render();
  });

  destInput.addEventListener("change", (e) => {
    currentFilters.destination = e.target.value;
    updatePillHighlight(currentFilters.destination);
    render();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentFilters.destination = destInput.value;
    currentFilters.checkin = checkinInput.value;
    currentFilters.checkout = checkoutInput.value;
    currentFilters.guests = parseInt(guestsInput.value, 10) || 2;
    updatePillHighlight(currentFilters.destination);
    render();
  });

  resetBtn.addEventListener("click", () => {
    resetFilters();
  });

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener("click", () => {
      resetFilters();
    });
  }

  function resetFilters() {
    setupDefaultDates();
    destInput.value = "all";
    sortSelect.value = "recommended";
    currentFilters.destination = "all";
    currentFilters.sortBy = "recommended";
    updatePillHighlight("all");
    render();
  }

  // 2. Destination Pills Handling
  pillsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".np-pill-btn");
    if (!btn) return;
    const dest = btn.dataset.dest;
    currentFilters.destination = dest;
    destInput.value = dest;
    updatePillHighlight(dest);
    render();
  });

  function updatePillHighlight(dest) {
    const buttons = pillsContainer.querySelectorAll(".np-pill-btn");
    buttons.forEach((b) => {
      if (b.dataset.dest === dest) {
        b.classList.add("active");
        b.setAttribute("aria-pressed", "true");
      } else {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      }
    });
  }

  // 3. Sorting Handling
  sortSelect.addEventListener("change", (e) => {
    currentFilters.sortBy = e.target.value;
    render();
  });

  // 4. Saved Stays - delegating to shared helper in hotels-data.js
  window.onSavedStaysChanged = () => {
    render();
  };

  function toggleSaveStay(id) {
    window.toggleSavedStayId(id);
    render();
  }

  function getSavedStays() {
    return window.getSavedStayIds ? window.getSavedStayIds() : [];
  }

  // 5. Main Filter, Calculate & Render
  function render() {
    const savedIds = getSavedStays();
    const isWinter = window.isWinterDate(currentFilters.checkin);
    const guestsNum = currentFilters.guests;
    const nights = window.calculateNights(currentFilters.checkin, currentFilters.checkout);

    // Filter
    let list = window.HOTELS.filter((hotel) => {
      // Destination filter
      if (currentFilters.destination !== "all" && hotel.destination !== currentFilters.destination) {
        return false;
      }
      // Guest capacity filter
      if (guestsNum > hotel.maxGuests) {
        return false;
      }
      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (currentFilters.sortBy === "price-asc") {
        return a.pricePerNight - b.pricePerNight;
      } else if (currentFilters.sortBy === "price-desc") {
        return b.pricePerNight - a.pricePerNight;
      } else if (currentFilters.sortBy === "rating") {
        return b.rating - a.rating;
      } else {
        // "recommended" default: rating then review volume
        return b.rating * b.reviews - a.rating * a.reviews;
      }
    });

    // Update aria-live count
    const countText = `Showing ${list.length} stay${list.length === 1 ? "" : "s"} in Northern Pakistan for ${guestsNum} guest${guestsNum === 1 ? "" : "s"}`;
    if (resultsCountEl) {
      resultsCountEl.textContent = countText;
    }

    // Render Cards or Empty State
    if (list.length === 0) {
      hotelGrid.innerHTML = "";
      hotelGrid.classList.add("d-none");
      emptyState.classList.remove("d-none");
      return;
    }

    emptyState.classList.add("d-none");
    hotelGrid.classList.remove("d-none");

    hotelGrid.innerHTML = list
      .map((hotel) => {
        const isSaved = savedIds.includes(hotel.id);
        const stayPricing = window.calculateStayTotal(
          hotel,
          null,
          currentFilters.checkin,
          currentFilters.checkout,
          guestsNum
        );

        // Winter advisory check
        const isWinterClosed = isWinter && !hotel.winterOpen;
        const accessBoxClass = isWinterClosed ? "np-access-box winter-closed" : "np-access-box";
        const accessBoxText = isWinterClosed
          ? `<strong>Winter Advisory:</strong> Closed Dec–Feb due to high-altitude road snow. Open for spring/summer bookings.`
          : `<strong>Access Note:</strong> ${hotel.accessNote}`;

        const tagsHtml = hotel.amenities
          .slice(0, 4)
          .map((a) => `<span class="np-tag">${a}</span>`)
          .join("");

        // Carried-over search params for Room Details page
        const roomDetailsUrl = `room-details.html?id=${encodeURIComponent(hotel.id)}&checkin=${encodeURIComponent(currentFilters.checkin)}&checkout=${encodeURIComponent(currentFilters.checkout)}&guests=${guestsNum}`;

        return `
        <article class="np-hotel-card" data-id="${hotel.id}">
          <div class="np-card-image-wrap">
            <img src="../images/${hotel.image}" alt="${hotel.name} in ${hotel.destinationLabel}" class="np-card-image" loading="lazy" />
            <div class="np-card-corner-badge">
              ${hotel.destinationLabel} • Up to ${hotel.maxGuests} Guests
            </div>
            <button type="button" class="np-card-heart-btn ${isSaved ? "is-saved" : ""}" data-id="${hotel.id}" aria-label="${isSaved ? "Remove from saved stays" : "Save this stay"}" title="${isSaved ? "Remove from saved stays" : "Save this stay"}">
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          <div class="np-card-body">
            <div class="np-card-location-row">
              <span class="np-card-location" title="${hotel.location}">
                📍 ${hotel.location}
              </span>
              <span class="np-rating-chip" aria-label="Rated ${hotel.rating} out of 5 stars based on ${hotel.reviews} reviews">
                ★ ${hotel.rating} <span style="font-weight: normal; opacity: 0.8">(${hotel.reviews})</span>
              </span>
            </div>
            <h3 class="np-card-title">${hotel.name}</h3>
            <p class="np-card-summary">${hotel.summary}</p>
            <div class="np-card-tags">
              ${tagsHtml}
            </div>
            <div class="${accessBoxClass}">
              ${accessBoxText}
            </div>
            <div class="np-card-footer">
              <div class="np-price-block">
                <span class="np-price-main">${window.formatPKR(hotel.pricePerNight)}<small style="font-size:0.75rem; font-weight:normal; color:var(--np-text-muted)"> / night</small></span>
                <span class="np-price-sub">Est. Total: <strong>${window.formatPKR(stayPricing.grandTotal)}</strong> (${nights} night${nights > 1 ? "s" : ""}, incl. tax)</span>
              </div>
              <a href="${roomDetailsUrl}" class="np-btn np-btn-navy">
                View Rooms
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    // Attach event listeners to card heart buttons
    hotelGrid.querySelectorAll(".np-card-heart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        toggleSaveStay(id);
        render();
      });
    });
  }

  // Initial runs
  setupDefaultDates();
  updateSavedBadge();
  updateSavedModalContent();
  render();
});
