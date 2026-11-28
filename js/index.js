/* ==========================================================================
   NorthPeak Tours — Homepage interactions
   ========================================================================== */

(function () {
  "use strict";

       const STORAGE_KEYS = {
    SAVED_TRIPS: "northpeak_saved_trips",
    SEARCH_PREFS: "northpeak_search_prefs",
  };   
  const DESTINATIONS = [
    { id: "hunza", name: "Hunza & Khunjerab Pass", days: 7, price: 68500 },
        { id: "skardu", name: "Skardu & Deosai Plains", days: 6, price: 64000 },
    { id: "fairy-meadows", name: "Fairy Meadows & Nanga Parbat", days: 5, price: 52000 },
    { id: "swat", name: "Swat, Kalam & Mahodand Lake", days: 4, price: 34500 },
    { id: "naran", name: "Naran & Saif-ul-Malook", days: 3, price: 27000 },
    { id: "kumrat", name: "Kumrat & Jahaz Banda", days: 4, price: 32000 },
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

  function getTourUrl(id) {
    return "tour-details.html?tour=" + encodeURIComponent(id);
  }

  function initNavigationAndSavedModal() {
    const navToggleBtn = document.getElementById("nav-toggle-btn");
    const navMenu = document.getElementById("nav-menu");
    if (navToggleBtn && navMenu) {
      navToggleBtn.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("is-open");
        navToggleBtn.setAttribute("aria-expanded", String(isOpen));
      });
    }

    const savedBtn = document.getElementById("open-saved-modal");
    const modal = document.getElementById("saved-trips-modal");
    const closeBtn = document.getElementById("close-saved-modal");
    const countEl = document.getElementById("saved-count-badge");
    const listEl = document.getElementById("saved-trips-list");

    function renderSavedTrips() {
      if (!listEl) return;
      const saved = readStorage(STORAGE_KEYS.SAVED_TRIPS, []);
      if (saved.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><h3>No Saved Valleys Yet</h3><p>Click "Save" on any destination card to keep it in your trip shortlist.</p></div>';
        return;
      }
      listEl.innerHTML = saved.map(function (id) {
        const item = DESTINATIONS.find(function (destination) {
          return destination.id === id;
        });
        if (!item) return "";
        return '<div class="saved-list-item"><div><strong>' + item.name + '</strong><small>' + item.days + '-Day Package &bull; ' + formatPKR(item.price) + '</small></div><div class="saved-item-actions"><a href="' + getTourUrl(item.id) + '" class="btn btn-blue btn-sm">View</a><button type="button" class="btn btn-outline btn-sm remove-saved-btn" data-id="' + item.id + '">Remove</button></div></div>';
      }).join("");
      listEl.querySelectorAll(".remove-saved-btn").forEach(function (button) {
        button.addEventListener("click", function () {
          const next = readStorage(STORAGE_KEYS.SAVED_TRIPS, []).filter(function (id) {
            return id !== button.getAttribute("data-id");
          });
          writeStorage(STORAGE_KEYS.SAVED_TRIPS, next);
          updateSavedCounter();
          renderSavedTrips();
          document.dispatchEvent(new CustomEvent("northpeak:savedUpdated"));
        });
      });
    }

    function updateSavedCounter() {
      if (countEl) countEl.textContent = String(readStorage(STORAGE_KEYS.SAVED_TRIPS, []).length);
    }

    if (savedBtn && modal) savedBtn.addEventListener("click", function () {
      renderSavedTrips();
      modal.classList.add("is-open");
    });
    if (closeBtn && modal) closeBtn.addEventListener("click", function () {
      modal.classList.remove("is-open");
    });
    if (modal) modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.classList.remove("is-open");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal) modal.classList.remove("is-open");
    });
    document.addEventListener("northpeak:savedUpdated", updateSavedCounter);
    updateSavedCounter();
  }

  document.addEventListener("DOMContentLoaded", initNavigationAndSavedModal);

  function initHomePage() {
    const searchForm = document.getElementById("home-search-form");
    if (!searchForm) return;

    const valleySelect = document.getElementById("valley");
    const seasonSelect = document.getElementById("season");
    const groupSelect = document.getElementById("group");

    const prefs = readStorage(STORAGE_KEYS.SEARCH_PREFS, null);
    if (prefs) {
      if (valleySelect && prefs.valley) valleySelect.value = prefs.valley;
      if (seasonSelect && prefs.season) seasonSelect.value = prefs.season;
      if (groupSelect && prefs.group) groupSelect.value = prefs.group;
    }

    searchForm.addEventListener("submit", function () {
      writeStorage(STORAGE_KEYS.SEARCH_PREFS, {
        valley: valleySelect ? valleySelect.value : "all",
        season: seasonSelect ? seasonSelect.value : "summer",
        group: groupSelect ? groupSelect.value : "4",
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initHomePage);
})();
