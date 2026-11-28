// NorthPeak Tours — Transport Options, Interactive KKH Route Map & Quote Estimator

const ROUTE_NODES = {
  "stop-islamabad": {
    kind: "Stop Telemetry • Hub 01",
    title: "Islamabad (Zero Point / Tarnol Interchange)",
    description:
      "Primary southern departure gateway connecting onto the M-1 and M-15 Hazara Motorway toward Mansehra and the Karakoram Highway.",
    distance: "0 km (Origin)",
    time: "Departure Hub",
    altitude: "540 m (1,772 ft)",
    surface: "6-Lane Express Motorway (M-1 / M-15)",
    defaultRouteLeg: "isb-hunza"
  },
  "leg-isb-chillas": {
    kind: "Route Leg • Segment 01",
    title: "Islamabad → Chillas",
    description:
      "Crosses Hazara Motorway to Thakot and follows the Indus gorge via Besham and Dasu (or Babusar Top during Jun–Oct summer window).",
    distance: "460 km",
    time: "9–10 hours",
    altitude: "540 m → 1,265 m (4,173 m via Babusar)",
    surface: "Paved Motorway + Mountain Two-Lane KKH (N-35)",
    defaultRouteLeg: "isb-chillas"
  },
  "stop-chillas": {
    kind: "Stop Telemetry • Hub 02",
    title: "Chillas (Diamer KKH Junction)",
    description:
      "Warm Indus River valley transit stop with fuel stations, rest lodges, and the junction connecting Babusar Pass to the main KKH.",
    distance: "460 km from Islamabad",
    time: "9–10 hours from Islamabad",
    altitude: "1,265 m (4,150 ft)",
    surface: "Paved KKH N-35 & Babusar Approach Road",
    defaultRouteLeg: "isb-chillas"
  },
  "leg-chillas-hunza": {
    kind: "Route Leg • Segment 02",
    title: "Chillas → Hunza (Karimabad)",
    description:
      "Scenic stretch past Nanga Parbat Viewpoint, the 3-Mountain-Ranges Junction at Jaglot, Gilgit city, and Rakaposhi Viewpoint.",
    distance: "225 km",
    time: "4.5–5.5 hours",
    altitude: "1,265 m → 2,438 m",
    surface: "All-Weather Paved KKH (Watch rockfall near Thalichi)",
    defaultRouteLeg: "chillas-hunza"
  },
  "stop-hunza": {
    kind: "Stop Telemetry • Hub 03",
    title: "Hunza (Karimabad)",
    description:
      "High-mountain cultural hub along the Karakoram Highway overlooking Rakaposhi and Ultar Sar, gateway to Attabad Lake and Khunjerab.",
    distance: "685 km from Islamabad",
    time: "14–15 hours",
    altitude: "2,438 m (7,999 ft)",
    surface: "Paved Dual-Lane KKH (N-35)",
    defaultRouteLeg: "isb-hunza"
  },
  "leg-hunza-skardu": {
    kind: "Route Leg • Segment 03",
    title: "Hunza → Skardu (via Gilgit & Jaglot)",
    description:
      "Descends from Karimabad back to Jaglot and turns east along the upgraded S-1 Strategic Highway beside the Indus River into Baltistan.",
    distance: "285 km",
    time: "6–7 hours",
    altitude: "2,438 m → 2,228 m",
    surface: "Upgraded Paved S-1 Highway (Tight river gorge curves)",
    defaultRouteLeg: "hunza-skardu"
  },
  "stop-skardu": {
    kind: "Stop Telemetry • Hub 04",
    title: "Skardu (Baltistan Hub)",
    description:
      "Gateway to Upper Kachura, Shangrila, Shigar Fort, and Deosai Plains, accessible via the S-1 Jaglot–Skardu road.",
    distance: "650 km from Islamabad (via Jaglot)",
    time: "14–16 hours from Islamabad",
    altitude: "2,228 m (7,310 ft)",
    surface: "Upgraded Paved S-1 Highway (Local 4x4 needed for Deosai)",
    defaultRouteLeg: "isb-skardu"
  },
  "full-corridor": {
    kind: "Full KKH Corridor",
    title: "Full Corridor: Islamabad – Chillas – Hunza – Skardu",
    description:
      "Complete northern mountain loop linking the capital to Diamer, Hunza Valley, and Baltistan across the Karakoram and Himalayan ranges.",
    distance: "970 km (Combined Corridor)",
    time: "20–23 driving hours (2–3 day staging recommended)",
    altitude: "540 m to 2,438 m (4,173 m if via Babusar)",
    surface: "Motorway M-15 + Paved KKH N-35 + S-1 Skardu Highway",
    defaultRouteLeg: "full-circuit"
  }
};

const VEHICLES = {
  "private-jeep": {
    id: "private-jeep",
    name: "Private Jeep",
    timing: "12-14 hours",
    unitRate: 35000,
    rateLabel: "Rs. 35,000 (one-way)",
    qtyLabel: "One-Way Trips / Jeeps",
    unitNoun: "one-way trip"
  },
  "tourist-coach": {
    id: "tourist-coach",
    name: "Tourist Coach",
    timing: "16-18 hours",
    unitRate: 6500,
    rateLabel: "Rs. 6,500 per seat",
    qtyLabel: "Number of Seats",
    unitNoun: "seat"
  },
  "self-drive": {
    id: "self-drive",
    name: "Self-drive rental",
    timing: "Flexible timing",
    unitRate: 12000,
    rateLabel: "Rs. 12,000/day",
    qtyLabel: "Rental Duration (Days)",
    unitNoun: "day"
  }
};

const ROUTE_LEGS = {
  "isb-chillas": { label: "Islamabad → Chillas (460 km)", stopId: "leg-isb-chillas" },
  "chillas-hunza": { label: "Chillas → Hunza (225 km)", stopId: "leg-chillas-hunza" },
  "hunza-skardu": { label: "Hunza → Skardu (285 km)", stopId: "leg-hunza-skardu" },
  "isb-hunza": { label: "Islamabad → Hunza (685 km)", stopId: "stop-hunza" },
  "isb-skardu": { label: "Islamabad → Skardu (650 km)", stopId: "stop-skardu" },
  "full-circuit": { label: "Full Circuit: Islamabad – Chillas – Hunza – Skardu (970 km)", stopId: "full-corridor" }
};

const SAVED_QUOTES_KEY = "northpeak_saved_quotes_v1";

// DOM references
const navToggleBtn = document.getElementById("nav-toggle-btn");
const navMenu = document.getElementById("nav-menu");
const navGetQuoteBtn = document.getElementById("nav-get-quote-btn");
const openSavedModalBtn = document.getElementById("open-saved-modal");
const closeSavedModalBtn = document.getElementById("close-saved-modal");
const savedQuotesModal = document.getElementById("saved-quotes-modal");
const savedQuotesList = document.getElementById("saved-quotes-list");
const savedCountBadge = document.getElementById("saved-count-badge");

const plannerForm = document.getElementById("route-planner-form");
const plannerDeparture = document.getElementById("planner-departure");
const plannerDestination = document.getElementById("planner-destination");
const plannerDate = document.getElementById("planner-date");
const plannerParty = document.getElementById("planner-party");
const resetRouteBtn = document.getElementById("reset-route-btn");
const routeFeedback = document.getElementById("route-feedback");
const activeRoutePill = document.getElementById("active-route-pill");
const transportMeta = document.getElementById("transport-meta");

const routeMapNodes = document.querySelectorAll("[data-node-id]");
const viewFullCorridorBtn = document.getElementById("view-full-corridor-btn");
const telemetryKind = document.getElementById("telemetry-kind");
const telemetryTitle = document.getElementById("telemetry-title");
const telemetryDesc = document.getElementById("telemetry-desc");
const telemetryDistance = document.getElementById("telemetry-distance");
const telemetryTime = document.getElementById("telemetry-time");
const telemetryAltitude = document.getElementById("telemetry-altitude");
const telemetrySurface = document.getElementById("telemetry-surface");
const telemetryQuoteBtn = document.getElementById("telemetry-quote-btn");

const toggleChecklistBtn = document.getElementById("toggle-safety-checklist");
const checklistPanel = document.getElementById("safety-checklist-panel");
const checklistArrow = document.getElementById("checklist-toggle-arrow");
const checklistInputs = document.querySelectorAll(".safety-check-input");
const checklistProgress = document.getElementById("checklist-progress");

const quoteModal = document.getElementById("quote-modal");
const closeQuoteModalBtn = document.getElementById("close-quote-modal");
const quoteForm = document.getElementById("quote-form");
const quoteVehicleSelect = document.getElementById("quote-vehicle");
const quoteRouteSelect = document.getElementById("quote-route");
const quoteDateInput = document.getElementById("quote-date");
const quoteQtyLabel = document.getElementById("quote-qty-label");
const quoteQtyInput = document.getElementById("quote-qty");
const quoteNameInput = document.getElementById("quote-name");
const quotePhoneInput = document.getElementById("quote-phone");
const quoteBreakdownTitle = document.getElementById("quote-breakdown-title");
const quoteBreakdownDetail = document.getElementById("quote-breakdown-detail");
const quoteTotalPkr = document.getElementById("quote-total-pkr");
const quoteFormFeedback = document.getElementById("quote-form-feedback");
const saveQuoteBtn = document.getElementById("save-quote-btn");

const quoteConfirmationView = document.getElementById("quote-confirmation-view");
const confirmRefId = document.getElementById("confirm-ref-id");
const confirmSummaryCard = document.getElementById("confirm-summary-card");
const newQuoteBtn = document.getElementById("new-quote-btn");
const doneQuoteBtn = document.getElementById("done-quote-btn");

let activeNodeId = "stop-hunza";

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
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultDate = addDays(today, 3);
  const isoToday = toISODate(today);
  const isoDefault = toISODate(defaultDate);

  plannerDate.min = isoToday;
  plannerDate.value = isoDefault;
  quoteDateInput.min = isoToday;
  quoteDateInput.value = isoDefault;
}

function getPlannerPartyValues() {
  const selectedOption = plannerParty.options[plannerParty.selectedIndex];
  return {
    seats: Number(selectedOption?.dataset.seats) || 4,
    days: Number(selectedOption?.dataset.days) || 3
  };
}

function resolveRouteLegKey(dep, dest) {
  if (dep === "islamabad" && dest === "chillas") return "isb-chillas";
  if (dep === "chillas" && dest === "hunza") return "chillas-hunza";
  if (dep === "hunza" && dest === "skardu") return "hunza-skardu";
  if (dep === "islamabad" && dest === "skardu") return "isb-skardu";
  if (dep === "islamabad" && dest === "hunza") return "isb-hunza";
  if (dep === dest) return "full-circuit";
  return "isb-hunza";
}

function selectRouteMapNode(nodeId) {
  const data = ROUTE_NODES[nodeId] || ROUTE_NODES["stop-hunza"];
  activeNodeId = nodeId in ROUTE_NODES ? nodeId : "stop-hunza";

  routeMapNodes.forEach((btn) => {
    const isMatch = btn.dataset.nodeId === activeNodeId;
    btn.classList.toggle("is-active", isMatch);
    btn.setAttribute("aria-pressed", String(isMatch));
  });

  viewFullCorridorBtn.classList.toggle("active", activeNodeId === "full-corridor");

  telemetryKind.textContent = data.kind;
  telemetryTitle.textContent = data.title;
  telemetryDesc.textContent = data.description;
  telemetryDistance.textContent = data.distance;
  telemetryTime.textContent = data.time;
  telemetryAltitude.textContent = data.altitude;
  telemetrySurface.textContent = data.surface;
}

function updateCardEstimates() {
  const { seats, days } = getPlannerPartyValues();
  const jeepEl = document.querySelector('[data-estimate-for="private-jeep"]');
  const coachEl = document.querySelector('[data-estimate-for="tourist-coach"]');
  const selfEl = document.querySelector('[data-estimate-for="self-drive"]');

  const jeepsNeeded = Math.max(1, Math.ceil(seats / 6));
  if (jeepEl) {
    jeepEl.textContent = `Est. ${jeepsNeeded} jeep${jeepsNeeded > 1 ? "s" : ""} (one-way): ${formatPKR(jeepsNeeded * VEHICLES["private-jeep"].unitRate)}`;
  }
  if (coachEl) {
    coachEl.textContent = `Est. ${seats} seat${seats > 1 ? "s" : ""}: ${formatPKR(seats * VEHICLES["tourist-coach"].unitRate)}`;
  }
  if (selfEl) {
    selfEl.textContent = `Est. ${days} day${days > 1 ? "s" : ""}: ${formatPKR(days * VEHICLES["self-drive"].unitRate)}`;
  }
}

function applyRoutePlannerUpdate(shouldScroll = false) {
  const dep = plannerDeparture.value;
  const dest = plannerDestination.value;
  const travelDate = plannerDate.value;
  const { seats, days } = getPlannerPartyValues();

  if (!travelDate) {
    routeFeedback.textContent = "Please choose a travel date to update route estimates.";
    routeFeedback.classList.add("is-error");
    return;
  }

  if (dep === dest) {
    routeFeedback.textContent =
      "Departure hub and destination match — switched telemetry to Full KKH Corridor overview.";
    routeFeedback.classList.remove("is-error");
    selectRouteMapNode("full-corridor");
  } else {
    routeFeedback.classList.remove("is-error");
    const legKey = resolveRouteLegKey(dep, dest);
    const legMeta = ROUTE_LEGS[legKey];
    if (legMeta) {
      selectRouteMapNode(legMeta.stopId);
    }
    const depLabel = plannerDeparture.options[plannerDeparture.selectedIndex].text.split(" (")[0];
    const destLabel = plannerDestination.options[plannerDestination.selectedIndex].text.replace(" Valley", "");
    activeRoutePill.textContent = `Active Corridor: ${depLabel} → ${destLabel}`;
    routeFeedback.textContent = `Route updated: ${depLabel} to ${destLabel} on ${travelDate} • ${seats} passengers (${days} days).`;
  }

  transportMeta.textContent = `Showing 3 verified mountain transport tiers • ${seats} passengers / ${days} days`;
  updateCardEstimates();

  if (shouldScroll) {
    document.getElementById("route-map-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resetRoutePlanner() {
  plannerDeparture.value = "islamabad";
  plannerDestination.value = "hunza";
  plannerParty.value = "4-3";
  initDates();
  activeRoutePill.textContent = "Active Corridor: Islamabad → Hunza";
  selectRouteMapNode("stop-hunza");
  applyRoutePlannerUpdate(false);
}

// Saved Quotes Storage Helpers
function getSavedQuotes() {
  try {
    const raw = localStorage.getItem(SAVED_QUOTES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSavedQuotes(quotes) {
  try {
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(quotes));
  } catch {
    // Ignore storage quota restrictions
  }
}

function updateSavedBadge() {
  const quotes = getSavedQuotes();
  savedCountBadge.textContent = String(quotes.length);
}

function renderSavedQuotesModal() {
  const quotes = getSavedQuotes();
  if (quotes.length === 0) {
    savedQuotesList.innerHTML =
      '<p class="text-muted mb-0">No saved transport quotes yet. Click <strong>Get quote</strong> on any vehicle card to calculate and save your fare.</p>';
    return;
  }

  savedQuotesList.innerHTML = quotes
    .map(
      (q) => `
      <div class="saved-item-row">
        <div class="saved-item-info">
          <strong>${escapeHtml(q.vehicleName)} &bull; ${formatPKR(q.totalPkr)}</strong>
          <span>${escapeHtml(q.routeLabel)} &bull; ${escapeHtml(q.date)} &bull; ${q.qty} ${escapeHtml(q.unitNoun)}${q.qty > 1 ? "s" : ""}</span>
          ${
            q.referenceId
              ? `<span class="saved-ref-pill">Confirmed &bull; Ref: ${escapeHtml(q.referenceId)}</span>`
              : ""
          }
        </div>
        <div class="saved-item-actions">
          <button type="button" class="btn-load-saved" data-load-quote="${escapeHtml(q.id)}">Load</button>
          <button type="button" class="btn-remove-saved" data-remove-quote="${escapeHtml(q.id)}">Remove</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Quote Modal Logic
function syncQuotePricingUI() {
  const vehicle = VEHICLES[quoteVehicleSelect.value] || VEHICLES["private-jeep"];
  const routeMeta = ROUTE_LEGS[quoteRouteSelect.value] || ROUTE_LEGS["isb-hunza"];
  const qty = Math.max(1, Math.min(24, Number(quoteQtyInput.value) || 1));

  quoteQtyLabel.textContent = vehicle.qtyLabel;
  const total = vehicle.unitRate * qty;

  quoteBreakdownTitle.textContent = `${vehicle.name} (${vehicle.timing})`;
  quoteBreakdownDetail.textContent = `${formatPKR(vehicle.unitRate)} × ${qty} ${vehicle.unitNoun}${qty > 1 ? "s" : ""} • ${routeMeta.label}`;
  quoteTotalPkr.textContent = formatPKR(total);

  return { vehicle, routeMeta, qty, total };
}

function getDefaultQtyForVehicle(vehicleId) {
  const { seats, days } = getPlannerPartyValues();
  if (vehicleId === "tourist-coach") return seats;
  if (vehicleId === "self-drive") return days;
  return Math.max(1, Math.ceil(seats / 6));
}

function openQuoteModal(vehicleId = "private-jeep", routeKey = null) {
  const resolvedVehicle = vehicleId in VEHICLES ? vehicleId : "private-jeep";
  const resolvedRoute =
    routeKey && routeKey in ROUTE_LEGS
      ? routeKey
      : resolveRouteLegKey(plannerDeparture.value, plannerDestination.value);

  quoteVehicleSelect.value = resolvedVehicle;
  quoteRouteSelect.value = resolvedRoute;
  quoteDateInput.value = plannerDate.value || quoteDateInput.value;
  quoteQtyInput.value = String(getDefaultQtyForVehicle(resolvedVehicle));
  quoteFormFeedback.textContent = "";
  quoteFormFeedback.classList.remove("is-error");

  quoteForm.hidden = false;
  quoteConfirmationView.hidden = true;

  syncQuotePricingUI();
  quoteModal.classList.add("is-open");
}

function closeQuoteModal() {
  quoteModal.classList.remove("is-open");
}

function buildCurrentQuoteRecord(referenceId = null) {
  const { vehicle, routeMeta, qty, total } = syncQuotePricingUI();
  return {
    id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    routeKey: quoteRouteSelect.value,
    routeLabel: routeMeta.label,
    date: quoteDateInput.value,
    qty,
    unitNoun: vehicle.unitNoun,
    totalPkr: total,
    travelerName: quoteNameInput.value.trim() || "Guest Traveler",
    travelerPhone: quotePhoneInput.value.trim() || "Not provided",
    referenceId
  };
}

function generateReferenceId() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `NP-TRN-${digits}`;
}

function updateChecklistProgress() {
  const total = checklistInputs.length;
  const checked = Array.from(checklistInputs).filter((input) => input.checked).length;
  checklistProgress.textContent = `${checked} of ${total} completed`;
}

// Event Listeners
navToggleBtn.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggleBtn.setAttribute("aria-expanded", String(isOpen));
});

navGetQuoteBtn.addEventListener("click", (event) => {
  event.preventDefault();
  navMenu.classList.remove("is-open");
  navToggleBtn.setAttribute("aria-expanded", "false");
  openQuoteModal("private-jeep");
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyRoutePlannerUpdate(true);
});

plannerDeparture.addEventListener("change", () => applyRoutePlannerUpdate(false));
plannerDestination.addEventListener("change", () => applyRoutePlannerUpdate(false));
plannerDate.addEventListener("change", () => applyRoutePlannerUpdate(false));
plannerParty.addEventListener("change", () => applyRoutePlannerUpdate(false));
resetRouteBtn.addEventListener("click", resetRoutePlanner);

routeMapNodes.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectRouteMapNode(btn.dataset.nodeId);
  });
});

viewFullCorridorBtn.addEventListener("click", () => {
  selectRouteMapNode("full-corridor");
});

telemetryQuoteBtn.addEventListener("click", () => {
  const nodeData = ROUTE_NODES[activeNodeId] || ROUTE_NODES["stop-hunza"];
  openQuoteModal("private-jeep", nodeData.defaultRouteLeg);
});

document.querySelectorAll("[data-open-quote]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openQuoteModal(btn.dataset.openQuote);
  });
});

quoteVehicleSelect.addEventListener("change", () => {
  quoteQtyInput.value = String(getDefaultQtyForVehicle(quoteVehicleSelect.value));
  syncQuotePricingUI();
});

quoteRouteSelect.addEventListener("change", syncQuotePricingUI);
quoteQtyInput.addEventListener("input", syncQuotePricingUI);

saveQuoteBtn.addEventListener("click", () => {
  if (!quoteDateInput.value) {
    quoteFormFeedback.textContent = "Please select a departure date before saving.";
    quoteFormFeedback.classList.add("is-error");
    return;
  }

  const record = buildCurrentQuoteRecord(null);
  const existing = getSavedQuotes();
  existing.unshift(record);
  setSavedQuotes(existing);
  updateSavedBadge();

  quoteFormFeedback.classList.remove("is-error");
  quoteFormFeedback.textContent = `Quote saved to your list (${formatPKR(record.totalPkr)}).`;
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = quoteNameInput.value.trim();
  const phone = quotePhoneInput.value.trim();

  if (!quoteDateInput.value) {
    quoteFormFeedback.textContent = "Please select a departure date.";
    quoteFormFeedback.classList.add("is-error");
    return;
  }
  if (name.length < 2) {
    quoteFormFeedback.textContent = "Please enter the lead traveler's full name.";
    quoteFormFeedback.classList.add("is-error");
    quoteNameInput.focus();
    return;
  }
  if (phone.length < 7) {
    quoteFormFeedback.textContent = "Please enter a valid contact phone or WhatsApp number.";
    quoteFormFeedback.classList.add("is-error");
    quotePhoneInput.focus();
    return;
  }

  const refId = generateReferenceId();
  const record = buildCurrentQuoteRecord(refId);
  const existing = getSavedQuotes();
  existing.unshift(record);
  setSavedQuotes(existing);
  updateSavedBadge();

  confirmRefId.textContent = refId;
  confirmSummaryCard.innerHTML = `
    <div><span>Vehicle</span><strong>${escapeHtml(record.vehicleName)}</strong></div>
    <div><span>Route</span><strong>${escapeHtml(record.routeLabel)}</strong></div>
    <div><span>Travel Date</span><strong>${escapeHtml(record.date)}</strong></div>
    <div><span>Quantity</span><strong>${record.qty} ${escapeHtml(record.unitNoun)}${record.qty > 1 ? "s" : ""}</strong></div>
    <div><span>Traveler</span><strong>${escapeHtml(record.travelerName)} (${escapeHtml(record.travelerPhone)})</strong></div>
    <div><span>Total Fare</span><strong>${formatPKR(record.totalPkr)}</strong></div>
  `;

  quoteForm.hidden = true;
  quoteConfirmationView.hidden = false;
});

newQuoteBtn.addEventListener("click", () => {
  quoteForm.hidden = false;
  quoteConfirmationView.hidden = true;
  quoteFormFeedback.textContent = "";
});

doneQuoteBtn.addEventListener("click", closeQuoteModal);
closeQuoteModalBtn.addEventListener("click", closeQuoteModal);
quoteModal.addEventListener("click", (event) => {
  if (event.target === quoteModal) {
    closeQuoteModal();
  }
});

openSavedModalBtn.addEventListener("click", () => {
  renderSavedQuotesModal();
  savedQuotesModal.classList.add("is-open");
});

closeSavedModalBtn.addEventListener("click", () => {
  savedQuotesModal.classList.remove("is-open");
});

savedQuotesModal.addEventListener("click", (event) => {
  if (event.target === savedQuotesModal) {
    savedQuotesModal.classList.remove("is-open");
  }
});

savedQuotesList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-quote]");
  if (removeBtn) {
    const targetId = removeBtn.dataset.removeQuote;
    const filtered = getSavedQuotes().filter((q) => q.id !== targetId);
    setSavedQuotes(filtered);
    updateSavedBadge();
    renderSavedQuotesModal();
    return;
  }

  const loadBtn = event.target.closest("[data-load-quote]");
  if (loadBtn) {
    const targetId = loadBtn.dataset.loadQuote;
    const found = getSavedQuotes().find((q) => q.id === targetId);
    if (found) {
      savedQuotesModal.classList.remove("is-open");
      openQuoteModal(found.vehicleId, found.routeKey);
      quoteDateInput.value = found.date;
      quoteQtyInput.value = String(found.qty);
      if (found.travelerName && found.travelerName !== "Guest Traveler") {
        quoteNameInput.value = found.travelerName;
      }
      if (found.travelerPhone && found.travelerPhone !== "Not provided") {
        quotePhoneInput.value = found.travelerPhone;
      }
      syncQuotePricingUI();
    }
  }
});

toggleChecklistBtn.addEventListener("click", () => {
  const isHidden = checklistPanel.hidden;
  checklistPanel.hidden = !isHidden;
  toggleChecklistBtn.setAttribute("aria-expanded", String(isHidden));
  checklistArrow.innerHTML = isHidden ? "&#9652;" : "&#9662;";
});

checklistInputs.forEach((input) => {
  input.addEventListener("change", updateChecklistProgress);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (quoteModal.classList.contains("is-open")) {
      closeQuoteModal();
    }
    if (savedQuotesModal.classList.contains("is-open")) {
      savedQuotesModal.classList.remove("is-open");
    }
  }
});

// Initialize page
initDates();
selectRouteMapNode("stop-hunza");
applyRoutePlannerUpdate(false);
updateSavedBadge();
updateChecklistProgress();
