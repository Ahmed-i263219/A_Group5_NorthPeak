// NorthPeak Tours — Stays Catalog & Interactive Filters

const HOTELS = [
  {
    id: "hunza-karimabad-lodge",
    name: "Karimabad Heritage Lodge",
    destination: "hunza",
    destinationLabel: "Hunza",
    location: "Karimabad, Hunza Valley • 2,438m",
    pricePerNight: 18000,
    rating: 4.8,
    reviews: 120,
    maxGuests: 6,
    image: "khunjerab-pass.png",
    summary:
      "Stone-and-timber valley lodge overlooking Rakaposhi Peak, minutes from Baltit Fort and Karimabad Bazaar.",
    amenities: ["Free Wi-Fi", "Breakfast Included", "Free Parking", "Rakaposhi View"],
    winterOpen: true,
    accessNote: "All-season paved KKH access"
  },
  {
    id: "naltar-pine-chalets",
    name: "Naltar Pine Chalets",
    destination: "naltar",
    destinationLabel: "Naltar",
    location: "Naltar Bala, Gilgit • 2,950m",
    pricePerNight: 9500,
    rating: 4.6,
    reviews: 84,
    maxGuests: 4,
    image: "kumrat.png",
    summary:
      "Cozy cedar cabins nestled inside Naltar's alpine forest with guided access to Bashkiri & Satrangi Lakes.",
    amenities: ["Breakfast Included", "Wood Heating", "4x4 Jeep Support", "Bonfire Lawn"],
    winterOpen: false,
    accessNote: "Best May–Oct • 4x4 jeep transfer from Nomal"
  },
  {
    id: "duikar-horizon-hotel",
    name: "Duikar Horizon Ridge Hotel",
    destination: "duikar",
    destinationLabel: "Duikar",
    location: "Duikar (Eagle's Nest), Hunza • 2,850m",
    pricePerNight: 22000,
    rating: 4.9,
    reviews: 148,
    maxGuests: 6,
    image: "deosai.png",
    summary:
      "Panoramic high-ridge stay perched above Hunza Valley with 360-degree sunrise views of Ultar Sar and Ladyfinger.",
    amenities: ["Free Wi-Fi", "Breakfast Included", "Sunrise Terrace", "Central Heating"],
    winterOpen: true,
    accessNote: "Mountain climb road • snow chains in Jan–Feb"
  },
  {
    id: "skardu-kachura-resort",
    name: "Kachura Lakeside Pavilion",
    destination: "skardu",
    destinationLabel: "Skardu",
    location: "Upper Kachura, Skardu • 2,500m",
    pricePerNight: 24500,
    rating: 4.9,
    reviews: 112,
    maxGuests: 6,
    image: "saif-ul-malook.png",
    summary:
      "Tranquil apricot-orchard suites steps from Upper Kachura Lake with private family dining and Skardu airport transfers.",
    amenities: ["Free Wi-Fi", "Breakfast Included", "Lakefront Lawn", "Airport Shuttle"],
    winterOpen: true,
    accessNote: "All-season paved Skardu Highway access"
  },
  {
    id: "kalam-ushu-inn",
    name: "Ushu Forest Riverside Inn",
    destination: "kalam",
    destinationLabel: "Kalam",
    location: "Ushu Road, Kalam, Swat • 2,000m",
    pricePerNight: 12500,
    rating: 4.7,
    reviews: 96,
    maxGuests: 4,
    image: "kalam.png",
    summary:
      "Family-friendly riverside property along the Swat River offering heated rooms, trout dinners, and Mahodand jeep desks.",
    amenities: ["Free Wi-Fi", "Breakfast Included", "River Terrace", "Backup Generator"],
    winterOpen: true,
    accessNote: "Sedan-friendly road to Kalam Bazaar"
  },
  {
    id: "naran-kunhar-lodge",
    name: "Kunhar Alpine Lodge",
    destination: "naran",
    destinationLabel: "Naran",
    location: "Riverfront Bypass, Naran • 2,409m",
    pricePerNight: 14000,
    rating: 4.5,
    reviews: 73,
    maxGuests: 5,
    image: "swat.png",
    summary:
      "Spacious basecamp stay near Kunhar River designed for families heading to Saif-ul-Malook Lake and Babusar Top.",
    amenities: ["Free Parking", "Breakfast Included", "Hot Water 24/7", "Family Suites"],
    winterOpen: false,
    accessNote: "Peak access May–Oct (Babusar seasonal closure)"
  }
];

const SAVED_STORAGE_KEY = "northpeak_saved_stays_v1";

// DOM references
const navToggleBtn = document.getElementById("nav-toggle-btn");
const navMenu = document.getElementById("nav-menu");
const filterForm = document.getElementById("stays-filter-form");
const destinationSelect = document.getElementById("filter-destination");
const checkinInput = document.getElementById("filter-checkin");
const checkoutInput = document.getElementById("filter-checkout");
const guestsSelect = document.getElementById("filter-guests");
const resetFiltersBtn = document.getElementById("reset-filters-btn");
const emptyResetBtn = document.getElementById("empty-reset-btn");
const sortSelect = document.getElementById("sort-stays");
const filterFeedback = document.getElementById("filter-feedback");
const resultsMeta = document.getElementById("results-meta");
const hotelsGrid = document.getElementById("hotels-grid");
const emptyState = document.getElementById("empty-stays-state");
const quickPills = document.querySelectorAll(".pill-btn");

const openSavedModalBtn = document.getElementById("open-saved-modal");
const closeSavedModalBtn = document.getElementById("close-saved-modal");
const savedModal = document.getElementById("saved-trips-modal");
const savedTripsList = document.getElementById("saved-trips-list");
const savedCountBadge = document.getElementById("saved-count-badge");

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatPKR(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

function getSavedStayIds() {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSavedStayIds(ids) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
}

function updateSavedBadge() {
  const savedIds = getSavedStayIds();
  savedCountBadge.textContent = String(savedIds.length);
}

function toggleSaveStay(hotelId) {
  const savedIds = getSavedStayIds();
  const index = savedIds.indexOf(hotelId);
  if (index >= 0) {
    savedIds.splice(index, 1);
  } else {
    savedIds.push(hotelId);
  }
  setSavedStayIds(savedIds);
  updateSavedBadge();
  renderHotels();
  if (savedModal.classList.contains("is-open")) {
    renderSavedModal();
  }
}

function renderSavedModal() {
  const savedIds = getSavedStayIds();
  if (savedIds.length === 0) {
    savedTripsList.innerHTML =
      '<p class="text-muted mb-0">No saved stays yet. Tap the heart icon on any hotel card to bookmark it for your trip.</p>';
    return;
  }

  const savedHotels = HOTELS.filter((hotel) => savedIds.includes(hotel.id));
  savedTripsList.innerHTML = savedHotels
    .map(
      (hotel) => `
      <div class="saved-item-row">
        <div class="saved-item-info">
          <strong>${hotel.name}</strong>
          <span>${hotel.destinationLabel} &bull; ${formatPKR(hotel.pricePerNight)}/night</span>
        </div>
        <div class="saved-item-actions">
          <a href="hotel-details.html?id=${encodeURIComponent(hotel.id)}" class="btn-view-details">View</a>
          <button type="button" class="btn-remove-saved" data-remove-id="${hotel.id}">Remove</button>
        </div>
      </div>
    `
    )
    .join("");
}

function initDefaultDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultCheckin = addDays(today, 3);
  const defaultCheckout = addDays(today, 5);

  checkinInput.min = toISODate(today);
  checkinInput.value = toISODate(defaultCheckin);
  checkoutInput.min = toISODate(addDays(defaultCheckin, 1));
  checkoutInput.value = toISODate(defaultCheckout);
}

function getValidatedDateRange() {
  const checkinVal = checkinInput.value;
  const checkoutVal = checkoutInput.value;

  if (!checkinVal || !checkoutVal) {
    return { valid: false, nights: 0, message: "Please select both check-in and check-out dates." };
  }

  const checkinDate = new Date(`${checkinVal}T00:00:00`);
  const checkoutDate = new Date(`${checkoutVal}T00:00:00`);
  const diffMs = checkoutDate.getTime() - checkinDate.getTime();
  const nights = Math.round(diffMs / 86400000);

  if (nights <= 0) {
    return {
      valid: false,
      nights: 0,
      message: "Check-out date must be at least 1 night after your check-in date."
    };
  }

  const checkinMonth = checkinDate.getMonth(); // 0 = Jan, 10 = Nov, 11 = Dec
  const isWinterWindow = checkinMonth === 11 || checkinMonth === 0 || checkinMonth === 1;

  return {
    valid: true,
    nights,
    isWinterWindow,
    checkinVal,
    checkoutVal,
    message: `Showing availability for ${nights} night${nights > 1 ? "s" : ""} (${checkinVal} to ${checkoutVal}).`
  };
}

function syncQuickPills(selectedDest) {
  quickPills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.dest === selectedDest);
  });
}

function sortHotels(list, sortBy) {
  const sorted = [...list];
  if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === "rating-desc") {
    sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
}

function renderHotels() {
  const selectedDest = destinationSelect.value;
  const guestCount = Number(guestsSelect.value) || 1;
  const sortBy = sortSelect.value;
  const dateState = getValidatedDateRange();

  syncQuickPills(selectedDest);

  if (!dateState.valid) {
    filterFeedback.textContent = dateState.message;
    filterFeedback.classList.add("is-error");
  } else {
    filterFeedback.textContent = `${dateState.message} • ${guestCount} guest${guestCount > 1 ? "s" : ""}`;
    filterFeedback.classList.remove("is-error");
  }

  const filtered = HOTELS.filter((hotel) => {
    const matchesDest = selectedDest === "all" || hotel.destination === selectedDest;
    const matchesGuests = hotel.maxGuests >= guestCount;
    return matchesDest && matchesGuests;
  });

  const ordered = sortHotels(filtered, sortBy);
  const savedIds = getSavedStayIds();

  if (ordered.length === 0) {
    hotelsGrid.innerHTML = "";
    emptyState.hidden = false;
    resultsMeta.textContent = "0 stays match your filters";
    return;
  }

  emptyState.hidden = true;
  const nightsLabel = dateState.valid
    ? ` • ${dateState.nights} night${dateState.nights > 1 ? "s" : ""}`
    : "";
  resultsMeta.textContent = `Showing ${ordered.length} of ${HOTELS.length} verified stays${nightsLabel} • Up to ${guestCount}+ guests`;

  hotelsGrid.innerHTML = ordered
    .map((hotel) => {
      const isSaved = savedIds.includes(hotel.id);
      const totalStayLine = dateState.valid
        ? `<span class="stay-total-line">${formatPKR(hotel.pricePerNight * dateState.nights)} for ${dateState.nights} night${dateState.nights > 1 ? "s" : ""}</span>`
        : "";
      const winterCaution = dateState.valid && dateState.isWinterWindow && !hotel.winterOpen;
      const accessText = winterCaution
        ? `Winter advisory: ${hotel.accessNote}`
        : hotel.accessNote;

      return `
        <div class="col-12 col-md-6 col-lg-4">
          <article class="hotel-card">
            <div class="hotel-media">
              <img src="${hotel.image}" alt="${hotel.name} in ${hotel.destinationLabel}" loading="lazy" />
              <span class="hotel-dest-badge">${hotel.destinationLabel} &bull; Up to ${hotel.maxGuests} guests</span>
              <button
                type="button"
                class="hotel-save-btn ${isSaved ? "is-saved" : ""}"
                data-save-id="${hotel.id}"
                aria-label="${isSaved ? "Remove from saved stays" : "Save stay"}"
                title="${isSaved ? "Saved" : "Save stay"}"
              >
                ${isSaved ? "&#9829;" : "&#9825;"}
              </button>
            </div>

            <div class="hotel-body">
              <div class="hotel-meta-top">
                <span class="hotel-location">${hotel.location}</span>
                <span class="hotel-rating">${hotel.rating.toFixed(1)} &#9733; (${hotel.reviews})</span>
              </div>

              <h3 class="hotel-title">${hotel.name}</h3>
              <p class="hotel-summary">${hotel.summary}</p>

              <div class="hotel-tags">
                ${hotel.amenities.map((item) => `<span class="hotel-tag">${item}</span>`).join("")}
              </div>

              <div class="hotel-access-note ${winterCaution ? "is-caution" : ""}">
                ${accessText}
              </div>

              <div class="hotel-footer">
                <div class="hotel-price">
                  <strong>${formatPKR(hotel.pricePerNight)}</strong>
                  <span>per night</span>
                  ${totalStayLine}
                </div>
                <a href="hotel-details.html?id=${encodeURIComponent(hotel.id)}" class="btn-view-details">
                  View Details &rarr;
                </a>
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

function resetAllFilters() {
  destinationSelect.value = "all";
  guestsSelect.value = "2";
  sortSelect.value = "recommended";
  initDefaultDates();
  renderHotels();
}

// Event Listeners
navToggleBtn.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggleBtn.setAttribute("aria-expanded", String(isOpen));
});

checkinInput.addEventListener("change", () => {
  if (checkinInput.value) {
    const selected = new Date(`${checkinInput.value}T00:00:00`);
    const nextDay = toISODate(addDays(selected, 1));
    checkoutInput.min = nextDay;
    if (!checkoutInput.value || checkoutInput.value <= checkinInput.value) {
      checkoutInput.value = nextDay;
    }
  }
  renderHotels();
});

checkoutInput.addEventListener("change", renderHotels);
destinationSelect.addEventListener("change", renderHotels);
guestsSelect.addEventListener("change", renderHotels);
sortSelect.addEventListener("change", renderHotels);

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderHotels();
  const catalogSection = document.getElementById("stays-catalog");
  if (getValidatedDateRange().valid && catalogSection) {
    catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

resetFiltersBtn.addEventListener("click", resetAllFilters);
emptyResetBtn.addEventListener("click", resetAllFilters);

quickPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    destinationSelect.value = pill.dataset.dest;
    renderHotels();
  });
});

hotelsGrid.addEventListener("click", (event) => {
  const saveBtn = event.target.closest("[data-save-id]");
  if (saveBtn) {
    toggleSaveStay(saveBtn.dataset.saveId);
  }
});

openSavedModalBtn.addEventListener("click", () => {
  renderSavedModal();
  savedModal.classList.add("is-open");
});

closeSavedModalBtn.addEventListener("click", () => {
  savedModal.classList.remove("is-open");
});

savedModal.addEventListener("click", (event) => {
  if (event.target === savedModal) {
    savedModal.classList.remove("is-open");
  }
});

savedTripsList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-id]");
  if (removeBtn) {
    toggleSaveStay(removeBtn.dataset.removeId);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && savedModal.classList.contains("is-open")) {
    savedModal.classList.remove("is-open");
  }
});

// Initialize page
initDefaultDates();
updateSavedBadge();
renderHotels();
