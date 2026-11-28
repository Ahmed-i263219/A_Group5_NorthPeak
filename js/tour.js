/* ==========================================================================
   NorthPeak Tours — Tour page interactions
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    SAVED_TRIPS: "northpeak_saved_trips",
    SEARCH_PREFS: "northpeak_search_prefs",
    LAST_BOOKING: "northpeak_last_booking",
  };
  const DESTINATIONS = [
    { id: "hunza", name: "Hunza & Khunjerab Pass", description: "Iconic Karakoram views of Rakaposhi, Baltit & Altit Forts, Attabad Lake boating, and Passu Cones along the KKH.", days: 7, nights: 6, price: 68500, maxAltitude: "4,693m (Khunjerab Pass)", transport: "Toyota Grand Cabin / Coaster", rating: 4.9 },
    { id: "skardu", name: "Skardu & Deosai Plains", description: "Home to Shangrila Resort, Upper Kachura Lake, Cold Desert Sarfaranga, and wildflower plateaus of Deosai National Park.", days: 6, nights: 5, price: 64000, maxAltitude: "4,114m (Deosai Plateau)", transport: "4x4 Prado / Toyota Coaster", rating: 4.9 },
    { id: "fairy-meadows", name: "Fairy Meadows & Nanga Parbat", description: "Thrilling Raikot jeep track and pine forest trek leading directly to the Basecamp reflection pond facing Nanga Parbat.", days: 5, nights: 4, price: 52000, maxAltitude: "3,300m (Nanga Parbat Viewpoint)", transport: "Coaster + Raikot 4x4 Jeep", rating: 4.8 },
    { id: "swat", name: "Swat, Kalam & Mahodand Lake", description: "Family-friendly green meadows, Malam Jabba chairlift, Usho cedar forests, and emerald waters of Mahodand Lake.", days: 4, nights: 3, price: 34500, maxAltitude: "2,865m (Mahodand Lake)", transport: "Toyota Grand Cabin", rating: 4.8 },
    { id: "naran", name: "Naran & Saif-ul-Malook", description: "Accessible glacier lakes, Kunhar River trout dining, Lulusar Lake, and scenic Babusar Top crossover route.", days: 3, nights: 2, price: 27000, maxAltitude: "3,224m (Saif-ul-Malook Lake)", transport: "Toyota Hiace / Grand Cabin", rating: 4.7 },
    { id: "kumrat", name: "Kumrat & Jahaz Banda", description: "Dense riverside pine woods along Panjkora River, Dojanga waterfalls, and alpine meadows ideal for student camping groups.", days: 4, nights: 3, price: 32000, maxAltitude: "3,100m (Jahaz Banda Meadow)", transport: "Coaster + Local 4x4 Jeep", rating: 4.8 },
  ];
  const ITINERARY_DAYS = [
    { day: "01", title: "Islamabad Departure to Chilas / Besham", summary: "Early morning departure via Hazara Motorway and KKH (or Babusar Top in summer). Afternoon riverfront lunch stop and evening hotel check-in.", extra: "Departure Point: Zero Point Islamabad at 5:30 AM. Recommended snack stop at Balakot / Mansehra." },
    { day: "02", title: "Three Mountain Junction & Karimabad Arrival", summary: "Stop at the confluence of the Himalayas, Hindu Kush & Karakoram ranges and Rakaposhi Viewpoint before checking into Karimabad lodge.", extra: "Check-in at Karimabad Valley Lodge with mountain-facing terrace and traditional Hunza walnut cake tea." },
    { day: "03", title: "Baltit Fort, Altit Fort & Duikar Sunset", summary: "Guided heritage walk through Karimabad Bazaar, centuries-old royal forts, and sunset photography at Eagle's Nest (Duikar).", extra: "Evening cultural dinner featuring Chapshuro and local apricot juice; light jacket recommended after 6:00 PM." },
    { day: "04", title: "Attabad Lake, Hussaini Suspension Bridge & Passu", summary: "Turquoise lake boat cruise, walk across Hussaini Bridge, and dinner overlooking the Passu Cathedral Cones.", extra: "Optional boat & jet-ski tickets available at Attabad Tunnel Dock; safety lifejackets provided." },
    { day: "05", title: "Khunjerab Pass (Pak–China Border)", summary: "Ascend through Khunjerab National Park (home to Marco Polo sheep & ibex) to 4,693m altitude before returning to Hunza.", extra: "Altitude reminder: Stay hydrated and keep windproof fleece ready. Portable oxygen cylinder is carried in vehicle." },
    { day: "06", title: "Nagar Valley / Hopper Glacier & Return to Chilas", summary: "Morning excursion to Hopper Glacier in Nagar Valley followed by scenic return drive south along the Indus River.", extra: "Short 30-minute walk to Hopper viewpoint; sturdy grip shoes recommended." },
    { day: "07", title: "Return Arrival in Islamabad", summary: "Scenic mountain highway drive with refreshment stops in Abbottabad, arriving back in Islamabad by evening.", extra: "Expected drop-off at Islamabad Zero Point between 8:00 PM and 9:30 PM depending on highway traffic." },
  ];

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* Ignore storage quota errors gracefully */
    }
  }

  function formatPKR(amount) {
    return "PKR " + Number(amount).toLocaleString("en-PK");
  }

  function initNavigationAndSavedModal() {
    const navToggleBtn = document.getElementById("nav-toggle-btn");
    const navMenu = document.getElementById("nav-menu");
    if (navToggleBtn && navMenu) navToggleBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    const savedBtn = document.getElementById("open-saved-modal");
    const modal = document.getElementById("saved-trips-modal");
    const closeBtn = document.getElementById("close-saved-modal");
    const countEl = document.getElementById("saved-count-badge");
    const listEl = document.getElementById("saved-trips-list");
    function updateSavedCounter() {
      if (countEl) countEl.textContent = String(readStorage(STORAGE_KEYS.SAVED_TRIPS, []).length);
    }
    function renderSavedTrips() {
      if (!listEl) return;
      const saved = readStorage(STORAGE_KEYS.SAVED_TRIPS, []);
      if (saved.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><h3>No Saved Valleys Yet</h3><p>Click "Save" on any destination card to keep it in your trip shortlist.</p></div>';
        return;
      }
      listEl.innerHTML = saved.map(function (id) {
        const item = DESTINATIONS.find(function (destination) { return destination.id === id; });
        if (!item) return "";
        return '<div class="saved-list-item"><div><strong>' + item.name + '</strong><small>' + item.days + '-Day Package &bull; ' + formatPKR(item.price) + '</small></div><div class="saved-item-actions"><a href="tour-details.html?tour=' + encodeURIComponent(item.id) + '" class="btn btn-blue btn-sm">View</a><button type="button" class="btn btn-outline btn-sm remove-saved-btn" data-id="' + item.id + '">Remove</button></div></div>';
      }).join("");
      listEl.querySelectorAll(".remove-saved-btn").forEach(function (button) {
        button.addEventListener("click", function () {
          const next = readStorage(STORAGE_KEYS.SAVED_TRIPS, []).filter(function (id) { return id !== button.getAttribute("data-id"); });
          writeStorage(STORAGE_KEYS.SAVED_TRIPS, next);
          updateSavedCounter();
          renderSavedTrips();
          document.dispatchEvent(new CustomEvent("northpeak:savedUpdated"));
        });
      });
    }
    if (savedBtn && modal) savedBtn.addEventListener("click", function () { renderSavedTrips(); modal.classList.add("is-open"); });
    if (closeBtn && modal) closeBtn.addEventListener("click", function () { modal.classList.remove("is-open"); });
    if (modal) modal.addEventListener("click", function (event) { if (event.target === modal) modal.classList.remove("is-open"); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (modal) modal.classList.remove("is-open");
        const bookingModal = document.getElementById("booking-confirm-modal");
        if (bookingModal) bookingModal.classList.remove("is-open");
      }
    });
    document.addEventListener("northpeak:savedUpdated", updateSavedCounter);
    updateSavedCounter();
  }

  document.addEventListener("DOMContentLoaded", initNavigationAndSavedModal);

  function initTourDetailsPage() {
    const form = document.getElementById("tour-reservation-form");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const requestedTourId = params.get("tour") || "hunza";
    const activeTour =
      DESTINATIONS.find(function (destination) {
        return destination.id === requestedTourId;
      }) || DESTINATIONS[0];

    const titleEl = document.getElementById("tour-page-title");
    const descEl = document.getElementById("tour-page-desc");
    const durationEl = document.getElementById("spec-duration");
    const altitudeEl = document.getElementById("spec-altitude");
    const transportEl = document.getElementById("spec-transport");
    const ratingEl = document.getElementById("spec-rating");
    const headerPriceEl = document.getElementById("sidebar-unit-price");

    if (titleEl) {
      titleEl.textContent = activeTour.days + "-Day " + activeTour.name + " Expedition";
    }
    if (descEl) {
      descEl.textContent =
        activeTour.description + " Complete guided tour from Islamabad with verified valley stays.";
    }
    if (durationEl) {
      durationEl.textContent = activeTour.days + " Days / " + activeTour.nights + " Nights";
    }
    if (altitudeEl) {
      altitudeEl.textContent = activeTour.maxAltitude;
    }
    if (transportEl) {
      transportEl.textContent = activeTour.transport;
    }
    if (ratingEl) {
      ratingEl.textContent = activeTour.rating.toFixed(1) + " ★ • 4–12 Travelers";
    }
    if (headerPriceEl) {
      headerPriceEl.textContent = formatPKR(activeTour.price);
    }

    const itineraryContainer = document.getElementById("itinerary-list");
    const expandAllBtn = document.getElementById("toggle-all-days-btn");
    if (itineraryContainer) {
      itineraryContainer.innerHTML = ITINERARY_DAYS.slice(0, activeTour.days)
        .map(function (item, index) {
          const themeClass = index % 2 === 0 ? "theme-blue" : "theme-green";
          const isOpen = index === 0;
          return (
            '<div class="itinerary-item ' + themeClass + (isOpen ? " is-open" : "") + '">' +
            '<button type="button" class="itinerary-trigger" aria-expanded="' + String(isOpen) + '">' +
            '<div class="feature-num">' + item.day + "</div>" +
            '<div class="itinerary-trigger-content">' +
            '<div class="itinerary-trigger-top">' +
            "<h3>" + item.title + "</h3>" +
            '<span class="accordion-arrow">' + (isOpen ? "Hide ▲" : "Details ▼") + "</span>" +
            "</div>" +
            "<p>" + item.summary + "</p>" +
            "</div>" +
            "</button>" +
            '<div class="itinerary-extra">' + item.extra + "</div>" +
            "</div>"
          );
        })
        .join("");

      itineraryContainer.querySelectorAll(".itinerary-trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          const parent = trigger.closest(".itinerary-item");
          const nowOpen = parent.classList.toggle("is-open");
          trigger.setAttribute("aria-expanded", String(nowOpen));
          const arrow = trigger.querySelector(".accordion-arrow");
          if (arrow) {
            arrow.textContent = nowOpen ? "Hide ▲" : "Details ▼";
          }
        });
      });

      if (expandAllBtn) {
        let allExpanded = false;
        expandAllBtn.addEventListener("click", function () {
          allExpanded = !allExpanded;
          itineraryContainer.querySelectorAll(".itinerary-item").forEach(function (item) {
            item.classList.toggle("is-open", allExpanded);
            const trigger = item.querySelector(".itinerary-trigger");
            const arrow = item.querySelector(".accordion-arrow");
            if (trigger) trigger.setAttribute("aria-expanded", String(allExpanded));
            if (arrow) arrow.textContent = allExpanded ? "Hide ▲" : "Details ▼";
          });
          expandAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All Days";
        });
      }
    }

    const roomSelect = document.getElementById("room-type");
    const travelersInput = document.getElementById("traveler-count");
    const promoInput = document.getElementById("promo-code");
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoFeedback = document.getElementById("promo-feedback");

    const nameInput = document.getElementById("traveler-name");
    const phoneInput = document.getElementById("traveler-phone");
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");

    const baseRowEl = document.getElementById("summary-base");
    const upgradeRowEl = document.getElementById("summary-upgrade");
    const supportRowEl = document.getElementById("summary-support");
    const discountRowWrap = document.getElementById("summary-discount-row");
    const discountRowEl = document.getElementById("summary-discount");
    const totalRowEl = document.getElementById("summary-total");
    const savedBannerEl = document.getElementById("saved-booking-banner");

    const prefs = readStorage(STORAGE_KEYS.SEARCH_PREFS, null);
    if (prefs && prefs.group && travelersInput) {
      travelersInput.value = prefs.group;
    }

    let appliedDiscountRate = 0;

    function calculateQuote() {
      let count = parseInt(travelersInput ? travelersInput.value : "1", 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 15) count = 15;

      const supportPerPerson = 3500;
      const basePerPerson = activeTour.price - supportPerPerson;
      const isDeluxe = roomSelect && roomSelect.value === "deluxe";
      const upgradePerPerson = isDeluxe ? 8500 : 0;

      const baseTotal = basePerPerson * count;
      const upgradeTotal = upgradePerPerson * count;
      const supportTotal = supportPerPerson * count;
      const gross = baseTotal + upgradeTotal + supportTotal;
      const discountAmount = Math.round(gross * appliedDiscountRate);
      const netTotal = gross - discountAmount;

      if (baseRowEl) baseRowEl.textContent = formatPKR(baseTotal) + " (" + count + "x)";
      if (upgradeRowEl) upgradeRowEl.textContent = formatPKR(upgradeTotal);
      if (supportRowEl) supportRowEl.textContent = formatPKR(supportTotal);

      if (discountRowWrap && discountRowEl) {
        discountRowWrap.hidden = discountAmount <= 0;
        discountRowEl.textContent = "-" + formatPKR(discountAmount);
      }
      if (totalRowEl) totalRowEl.textContent = formatPKR(netTotal);

      return { count: count, netTotal: netTotal };
    }

    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener("click", function () {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) {
          appliedDiscountRate = 0;
          promoFeedback.textContent = "Enter a promo code (try STUDENT10 or FAMILY5).";
          promoFeedback.className = "promo-feedback is-error";
        } else if (code === "STUDENT10") {
          appliedDiscountRate = 0.1;
          promoFeedback.textContent = "STUDENT10 applied: 10% student discount!";
          promoFeedback.className = "promo-feedback is-success";
        } else if (code === "FAMILY5") {
          appliedDiscountRate = 0.05;
          promoFeedback.textContent = "FAMILY5 applied: 5% family discount!";
          promoFeedback.className = "promo-feedback is-success";
        } else {
          appliedDiscountRate = 0;
          promoFeedback.textContent = "Invalid code. Use STUDENT10 or FAMILY5.";
          promoFeedback.className = "promo-feedback is-error";
        }
        calculateQuote();
      });
    }

    function validateName() {
      const value = nameInput ? nameInput.value.trim() : "";
      const valid = /^[A-Za-z\s]{3,}$/.test(value);
      if (nameError && nameInput) {
        nameError.textContent = valid ? "" : "Please enter your full name (at least 3 letters).";
        nameInput.classList.toggle("input-error", !valid);
      }
      return valid;
    }

    function validatePhone() {
      const raw = phoneInput ? phoneInput.value.trim() : "";
      const digits = raw.replace(/[\s-]/g, "");
      const valid = /^(\+923\d{9}|03\d{9})$/.test(digits);
      if (phoneError && phoneInput) {
        phoneError.textContent = valid
          ? ""
          : "Enter a valid Pakistani number (e.g. +92 300 1234567 or 03001234567).";
        phoneInput.classList.toggle("input-error", !valid);
      }
      return valid;
    }

    if (roomSelect) roomSelect.addEventListener("change", calculateQuote);
    if (travelersInput) {
      travelersInput.addEventListener("input", calculateQuote);
      travelersInput.addEventListener("blur", function () {
        let count = parseInt(travelersInput.value, 10);
        if (isNaN(count) || count < 1) travelersInput.value = "1";
        if (count > 15) travelersInput.value = "15";
        calculateQuote();
      });
    }
    if (nameInput) nameInput.addEventListener("input", validateName);
    if (phoneInput) phoneInput.addEventListener("input", validatePhone);

    function renderLastSavedBooking() {
      if (!savedBannerEl) return;
      const last = readStorage(STORAGE_KEYS.LAST_BOOKING, null);
      if (last) {
        savedBannerEl.hidden = false;
        savedBannerEl.innerHTML =
          "<strong>Last Request Saved:</strong> " +
          last.ref +
          " (" +
          last.tourName +
          " &bull; " +
          last.total +
          ")";
      }
    }

    const confirmModal = document.getElementById("booking-confirm-modal");
    const confirmDetails = document.getElementById("booking-confirm-details");
    const closeConfirmBtn = document.getElementById("close-confirm-modal");

    if (closeConfirmBtn && confirmModal) {
      closeConfirmBtn.addEventListener("click", function () {
        confirmModal.classList.remove("is-open");
      });
      confirmModal.addEventListener("click", function (event) {
        if (event.target === confirmModal) confirmModal.classList.remove("is-open");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const okName = validateName();
      const okPhone = validatePhone();
      if (!okName || !okPhone) return;

      const quote = calculateQuote();
      const departure = document.getElementById("departure-date").value;
      const refCode = "NP-" + Math.floor(100000 + Math.random() * 900000);

      const bookingRecord = {
        ref: refCode,
        tourName: activeTour.name,
        traveler: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        departure: departure,
        travelers: quote.count,
        total: formatPKR(quote.netTotal),
      };

      writeStorage(STORAGE_KEYS.LAST_BOOKING, bookingRecord);
      renderLastSavedBooking();

      if (confirmDetails && confirmModal) {
        confirmDetails.innerHTML =
          "<p><strong>Reference ID:</strong> " + bookingRecord.ref + "</p>" +
          "<p><strong>Expedition:</strong> " + bookingRecord.tourName + "</p>" +
          "<p><strong>Lead Traveler:</strong> " + bookingRecord.traveler + " (" + bookingRecord.phone + ")</p>" +
          "<p><strong>Departure Batch:</strong> " + bookingRecord.departure + "</p>" +
          "<p><strong>Group Size:</strong> " + bookingRecord.travelers + " Traveler(s)</p>" +
          "<p><strong>Estimated Total:</strong> " + bookingRecord.total + "</p>";
        confirmModal.classList.add("is-open");
      }
    });

    calculateQuote();
    renderLastSavedBooking();
  }

  document.addEventListener("DOMContentLoaded", initTourDetailsPage);
})();
