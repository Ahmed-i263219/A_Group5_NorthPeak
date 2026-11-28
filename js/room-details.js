/**
 * js/room-details.js
 * Controller for the Room Details page of NorthPeak Tours
 * Manages hotel loading, room selection, capacity validation, live sticky price calculation,
 * and favorites/heart synchronization.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Read URL query parameters
  const params = new URLSearchParams(window.location.search);
  const hotelId = params.get("id") || "karimabad-heritage-lodge";
  let qCheckin = params.get("checkin");
  let qCheckout = params.get("checkout");
  let qGuests = parseInt(params.get("guests"), 10) || 2;
  let qRoomId = params.get("room");

  // Lookup Hotel
  const hotel = window.HOTELS.find((h) => h.id === hotelId) || window.HOTELS[0];

  // DOM Elements
  const heroHotelName = document.getElementById("heroHotelName");
  const heroLocation = document.getElementById("heroLocation");
  const heroRatingChip = document.getElementById("heroRatingChip");
  const heroHeartBtn = document.getElementById("heroHeartBtn");
  const heroHeartLabel = document.getElementById("heroHeartLabel");
  const backToStaysLink = document.getElementById("backToStaysLink");

  // Overview Elements
  const hotelPhoto = document.getElementById("hotelPhoto");
  const hotelDescription = document.getElementById("hotelDescription");
  const checkinTimeEl = document.getElementById("checkinTime");
  const checkoutTimeEl = document.getElementById("checkoutTime");
  const maxGuestsEl = document.getElementById("maxGuests");
  const altitudeEl = document.getElementById("altitude");
  const amenitiesList = document.getElementById("amenitiesList");
  const accessBox = document.getElementById("accessBox");
  const cancellationPolicyEl = document.getElementById("cancellationPolicy");

  // Room Selection Elements
  const roomCardsList = document.getElementById("roomCardsList");

  // Sticky Booking Panel Elements
  const bookCheckin = document.getElementById("bookCheckin");
  const bookCheckout = document.getElementById("bookCheckout");
  const bookGuests = document.getElementById("bookGuests");
  const selectedRoomNameEl = document.getElementById("selectedRoomName");
  const selectedRoomRateEl = document.getElementById("selectedRoomRate");
  const priceNightsEl = document.getElementById("priceNights");
  const priceRoomSubtotalEl = document.getElementById("priceRoomSubtotal");
  const seasonRow = document.getElementById("seasonRow");
  const seasonLabelEl = document.getElementById("seasonLabel");
  const seasonCostEl = document.getElementById("seasonCost");
  const discountRow = document.getElementById("discountRow");
  const discountLabelEl = document.getElementById("discountLabel");
  const discountAmountEl = document.getElementById("discountAmount");
  const priceTaxEl = document.getElementById("priceTax");
  const grandTotalEl = document.getElementById("grandTotal");
  const proceedBtn = document.getElementById("proceedBtn");

  // Local State
  let state = {
    hotel: hotel,
    selectedRoom: hotel.rooms[0],
    checkin: "",
    checkout: "",
    guests: qGuests
  };

  // 1. Initial Dates Setup
  function initDates() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    bookCheckin.min = todayStr;

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (!qCheckin) {
      const defCheckin = new Date();
      defCheckin.setDate(today.getDate() + 3);
      qCheckin = formatDate(defCheckin);
    }

    if (!qCheckout) {
      const defCheckout = new Date();
      defCheckout.setDate(today.getDate() + 5);
      qCheckout = formatDate(defCheckout);
    }

    bookCheckin.value = qCheckin;
    updateCheckoutMin(qCheckin);
    bookCheckout.value = qCheckout;
    bookGuests.value = String(state.guests);

    state.checkin = bookCheckin.value;
    state.checkout = bookCheckout.value;

    // Preserve search queries in back link
    backToStaysLink.href = `stays.html?destination=${hotel.destination}&checkin=${encodeURIComponent(state.checkin)}&checkout=${encodeURIComponent(state.checkout)}&guests=${state.guests}`;
  }

  function updateCheckoutMin(checkinVal) {
    if (!checkinVal) return;
    const d = new Date(checkinVal);
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const minCheckoutStr = `${yyyy}-${mm}-${dd}`;
    bookCheckout.min = minCheckoutStr;

    if (bookCheckout.value && bookCheckout.value <= checkinVal) {
      bookCheckout.value = minCheckoutStr;
    }
  }

  // 2. Select initial room (or match room query if provided)
  if (qRoomId) {
    const matched = hotel.rooms.find((r) => r.id === qRoomId);
    if (matched) state.selectedRoom = matched;
  }
  // If preselected room cannot fit current guests, pick first suitable room or stay on current
  const fitsCurrent = hotel.rooms.find((r) => r.capacity >= state.guests);
  if (fitsCurrent && state.selectedRoom.capacity < state.guests) {
    state.selectedRoom = fitsCurrent;
  }

  // 3. Populate Hero & Overview
  function renderOverview() {
    heroHotelName.textContent = hotel.name;
    heroLocation.textContent = `📍 ${hotel.location}`;
    heroRatingChip.innerHTML = `★ ${hotel.rating} <span style="font-weight: normal; opacity: 0.8">(${hotel.reviews} reviews)</span>`;

    hotelPhoto.src = `../images/${hotel.image}`;
    hotelPhoto.alt = `${hotel.name} scenic lodge exterior`;
    hotelDescription.textContent = hotel.description;

    checkinTimeEl.textContent = hotel.checkInTime || "14:00";
    checkoutTimeEl.textContent = hotel.checkOutTime || "11:30";
    maxGuestsEl.textContent = `Up to ${hotel.maxGuests} Guests`;

    // Extract altitude string if present in location
    const altMatch = hotel.location.match(/Alt:\s*([0-9,]+m)/i);
    altitudeEl.textContent = altMatch ? altMatch[1] : "Alpine Zone";

    // Amenities
    amenitiesList.innerHTML = hotel.amenities
      .map(
        (a) => `
        <div class="np-amenity-item">
          <span class="np-amenity-check">✓</span>
          <span>${a}</span>
        </div>
      `
      )
      .join("");

    // Access & Winter Advisory Note
    const isWinter = window.isWinterDate(state.checkin);
    const isWinterClosed = isWinter && !hotel.winterOpen;

    if (isWinterClosed) {
      accessBox.className = "np-access-box winter-closed";
      accessBox.innerHTML = `
        <strong>⚠️ Winter Advisory:</strong> This lodge is closed December through February due to heavy snow and high-altitude road closures. Access resumes in spring.
        <div class="mt-1" style="font-size: 0.8rem; opacity: 0.9;"><strong>Standard Road Access:</strong> ${hotel.accessNote}</div>
      `;
    } else {
      accessBox.className = "np-access-box";
      accessBox.innerHTML = `<strong>Road Access & Transit Note:</strong> ${hotel.accessNote}`;
    }

    cancellationPolicyEl.textContent = hotel.cancellationPolicy;

    syncHeartState();
  }

  // 4. Render "Choose your room" Section
  function renderRooms() {
    roomCardsList.innerHTML = hotel.rooms
      .map((room) => {
        const isSelected = state.selectedRoom.id === room.id;
        const canFit = room.capacity >= state.guests;

        const cardClasses = [
          "np-room-card",
          isSelected ? "selected" : "",
          !canFit ? "is-unavailable" : ""
        ]
          .filter(Boolean)
          .join(" ");

        const amenitiesHtml = room.amenities
          .map((a) => `<span class="np-tag">${a}</span>`)
          .join("");

        return `
          <article class="${cardClasses}" data-room-id="${room.id}">
            <div>
              <div class="np-room-header-row">
                <div>
                  <h3 class="np-room-title">${room.name}</h3>
                  <div class="np-room-specs-row">
                    <span class="np-room-spec-item">
                      🛏️ ${room.bedType}
                    </span>
                    <span class="np-room-spec-item">
                      📐 ${room.sizeSqFt} sq ft
                    </span>
                    <span class="np-room-spec-item">
                      👥 Capacity: up to ${room.capacity} guest${room.capacity > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div class="np-room-price">
                  ${window.formatPKR(room.pricePerNight)}
                  <div class="np-room-price-sub">per night</div>
                </div>
              </div>

              <p class="np-room-desc">${room.description}</p>

              <div class="np-room-amenities-row">
                ${amenitiesHtml}
              </div>

              ${
                !canFit
                  ? `
                <div class="np-unavailable-callout">
                  ⚠️ Unavailable for your party: Capacity is ${room.capacity} guest${room.capacity > 1 ? "s" : ""}, but you requested ${state.guests} guests.
                </div>
              `
                  : ""
              }
            </div>

            <div class="np-room-footer-row">
              <span style="font-size: 0.85rem; font-weight: 600; color: ${isSelected ? "var(--np-green-forest)" : "var(--np-text-muted)"}">
                ${isSelected ? "✓ Currently Selected Room" : canFit ? "Available for selection" : "Exceeds Room Capacity"}
              </span>

              <button type="button" class="np-btn ${isSelected ? "np-btn-primary" : "np-btn-outline-navy"} select-room-btn" data-room-id="${room.id}">
                ${isSelected ? "Selected" : "Select Room"}
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    // Wire Room Selection Buttons
    roomCardsList.querySelectorAll(".select-room-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rId = e.currentTarget.dataset.roomId;
        const targetRoom = hotel.rooms.find((r) => r.id === rId);
        if (targetRoom) {
          state.selectedRoom = targetRoom;
          renderRooms();
          calculateAndRenderPricing();
        }
      });
    });
  }

  // 5. Live Price Calculation for Sticky Booking Panel
  function calculateAndRenderPricing() {
    const nights = window.calculateNights(state.checkin, state.checkout);
    const breakdown = window.calculateStayTotal(
      state.hotel,
      state.selectedRoom,
      state.checkin,
      state.checkout,
      state.guests
    );

    // Selected room info
    selectedRoomNameEl.textContent = state.selectedRoom.name;
    selectedRoomRateEl.textContent = `${window.formatPKR(state.selectedRoom.pricePerNight)} / night • Max ${state.selectedRoom.capacity} guests`;

    // Nights & Room Subtotal
    priceNightsEl.textContent = `${nights} night${nights > 1 ? "s" : ""}`;
    priceRoomSubtotalEl.textContent = window.formatPKR(breakdown.roomSubtotal);

    // Seasonal surcharge
    if (breakdown.seasonSurcharge > 0) {
      seasonRow.classList.remove("d-none");
      seasonLabelEl.textContent = breakdown.seasonLabel;
      seasonCostEl.textContent = `+ ${window.formatPKR(breakdown.seasonSurcharge)}`;
    } else {
      seasonRow.classList.add("d-none");
    }

    // Long-stay discount
    if (breakdown.longStayDiscount > 0) {
      discountRow.classList.remove("d-none");
      discountLabelEl.textContent = breakdown.longStayLabel;
      discountAmountEl.textContent = `- ${window.formatPKR(breakdown.longStayDiscount)}`;
    } else {
      discountRow.classList.add("d-none");
    }

    // Tax & Grand Total
    priceTaxEl.textContent = window.formatPKR(breakdown.tax);
    grandTotalEl.textContent = window.formatPKR(breakdown.grandTotal);

    // Update Proceed to Reservation Link
    const reservationUrl = `stay-reservation.html?id=${encodeURIComponent(state.hotel.id)}&room=${encodeURIComponent(state.selectedRoom.id)}&checkin=${encodeURIComponent(state.checkin)}&checkout=${encodeURIComponent(state.checkout)}&guests=${state.guests}`;
    proceedBtn.href = reservationUrl;

    // Update back button query parameters
    backToStaysLink.href = `stays.html?destination=${hotel.destination}&checkin=${encodeURIComponent(state.checkin)}&checkout=${encodeURIComponent(state.checkout)}&guests=${state.guests}`;
  }

  // 6. Listen to Sticky Panel Inputs
  bookCheckin.addEventListener("change", (e) => {
    updateCheckoutMin(e.target.value);
    state.checkin = e.target.value;
    state.checkout = bookCheckout.value;
    renderOverview(); // updates winter warning if date entered Dec-Feb
    calculateAndRenderPricing();
  });

  bookCheckout.addEventListener("change", (e) => {
    state.checkout = e.target.value;
    calculateAndRenderPricing();
  });

  bookGuests.addEventListener("change", (e) => {
    state.guests = parseInt(e.target.value, 10) || 2;
    renderRooms(); // updates room availability warning
    calculateAndRenderPricing();
  });

  // 7. Save / Heart Button Functionality & Sync
  function syncHeartState() {
    const savedIds = window.getSavedStayIds ? window.getSavedStayIds() : [];
    const isSaved = savedIds.includes(hotel.id);
    if (isSaved) {
      heroHeartBtn.classList.add("is-saved");
      heroHeartBtn.setAttribute("aria-pressed", "true");
      heroHeartLabel.textContent = "Saved to Favorites";
    } else {
      heroHeartBtn.classList.remove("is-saved");
      heroHeartBtn.setAttribute("aria-pressed", "false");
      heroHeartLabel.textContent = "Save this Stay";
    }
  }

  heroHeartBtn.addEventListener("click", () => {
    if (window.toggleSavedStayId) {
      window.toggleSavedStayId(hotel.id);
      syncHeartState();
    }
  });

  // Global listener when saved stay is modified via modal
  window.onSavedStaysChanged = (id) => {
    syncHeartState();
  };

  // Initial Execution
  initDates();
  renderOverview();
  renderRooms();
  calculateAndRenderPricing();
});
