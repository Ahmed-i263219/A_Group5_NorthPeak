/* ==========================================================================
   NorthPeak Tours — Destination page interactions
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    SAVED_TRIPS: "northpeak_saved_trips",
    SEARCH_PREFS: "northpeak_search_prefs",
  };
  const DESTINATIONS = [
    { id: "hunza", name: "Hunza & Khunjerab Pass", region: "gb", regionLabel: "Gilgit-Baltistan", rating: 4.9, elevation: "2,438m – 4,693m", seasonLabel: "May – Oct", seasons: ["summer", "autumn", "spring"], days: 7, price: 68500, driveTime: "12 – 14 Hours (KKH / Babusar)", bestWindow: "March – October", difficulty: "Easy (Family Friendly)", visualClass: "", btnClass: "btn-blue", imageMarkup: '<img src="khunjerab-pass.png" alt="Khunjerab Pass border crossing surrounded by snowy mountains" />', description: "Iconic Karakoram views of Rakaposhi, Baltit & Altit Forts, Attabad Lake boating, and Passu Cones along the KKH.", svgMarkup: "" },
    { id: "skardu", name: "Skardu & Deosai Plains", region: "gb", regionLabel: "Baltistan", rating: 4.9, elevation: "2,228m – 4,114m", seasonLabel: "Jun – Sep", seasons: ["summer"], days: 6, price: 64000, driveTime: "14 – 16 Hours (or 1h Flight)", bestWindow: "June – September", difficulty: "Moderate (4x4 for Deosai)", visualClass: "alt-green", btnClass: "btn-green", imageMarkup: '<img src="deosai.png" alt="Green mountain valley in Deosai National Park" />', description: "Home to Shangrila Resort, Upper Kachura Lake, Cold Desert Sarfaranga, and wildflower plateaus of Deosai National Park.", svgMarkup: "" },
    { id: "fairy-meadows", name: "Fairy Meadows & Nanga Parbat", region: "gb", regionLabel: "Diamer", rating: 4.8, elevation: "3,300m Altitude", seasonLabel: "May – Sep", seasons: ["summer"], days: 5, price: 52000, driveTime: "10 Hours + Jeep & Trek", bestWindow: "May – September", difficulty: "Active (3-Hour Hike)", visualClass: "", btnClass: "btn-blue", imageMarkup: "", description: "Thrilling Raikot jeep track and pine forest trek leading directly to the Basecamp reflection pond facing Nanga Parbat.", svgMarkup: "" },
    { id: "swat", name: "Swat, Kalam & Mahodand Lake", region: "kpk", regionLabel: "Khyber Pakhtunkhwa", rating: 4.8, elevation: "2,000m – 2,865m", seasonLabel: "Year-Round", seasons: ["summer", "autumn", "spring", "winter"], days: 4, price: 34500, driveTime: "4.5 – 6 Hours (M-16 Swat Expy)", bestWindow: "All Year", difficulty: "Easy (Family Friendly)", visualClass: "alt-green", btnClass: "btn-green", imageMarkup: '<div class="dest-visual-image-pair"><img src="swat.png" alt="Swat Valley river flowing through a mountain town" /><img src="kalam.png" alt="Kalam Valley meadow surrounded by mountains" /></div>', description: "Family-friendly green meadows, Malam Jabba chairlift, Usho cedar forests, and emerald waters of Mahodand Lake.", svgMarkup: "" },
    { id: "naran", name: "Naran & Saif-ul-Malook", region: "kpk", regionLabel: "Khyber Pakhtunkhwa", rating: 4.7, elevation: "2,409m – 3,224m", seasonLabel: "May – Oct", seasons: ["summer", "autumn"], days: 3, price: 27000, driveTime: "6 – 7 Hours (Hazara Expy)", bestWindow: "May – October", difficulty: "Easy (Family Friendly)", visualClass: "", btnClass: "btn-blue", imageMarkup: '<img src="saif-ul-malook.png" alt="Saif-ul-Malook Lake surrounded by mountain peaks" />', description: "Accessible glacier lakes, Kunhar River trout dining, Lulusar Lake, and scenic Babusar Top crossover route.", svgMarkup: "" },
    { id: "kumrat", name: "Kumrat & Jahaz Banda", region: "kpk", regionLabel: "Upper Dir", rating: 4.8, elevation: "2,470m – 3,100m", seasonLabel: "Jun – Sep", seasons: ["summer"], days: 4, price: 32000, driveTime: "8 – 9 Hours", bestWindow: "June – September", difficulty: "Moderate (Student Groups)", visualClass: "alt-green", btnClass: "btn-green", imageMarkup: '<img src="kumrat.png" alt="Kumrat Valley with a clear river and pine forest" />', description: "Dense riverside pine woods along Panjkora River, Dojanga waterfalls, and alpine meadows ideal for student camping groups.", svgMarkup: "" },
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
        return '<div class="saved-list-item"><div><strong>' + item.name + '</strong><small>' + item.days + '-Day Package &bull; ' + formatPKR(item.price) + '</small></div><div class="saved-item-actions"><a href="' + getTourUrl(item.id) + '" class="btn btn-blue btn-sm">View</a><button type="button" class="btn btn-outline btn-sm remove-saved-btn" data-id="' + item.id + '">Remove</button></div></div>';
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
      if (event.key === "Escape" && modal) modal.classList.remove("is-open");
    });
    document.addEventListener("northpeak:savedUpdated", updateSavedCounter);
    updateSavedCounter();
  }

  document.addEventListener("DOMContentLoaded", initNavigationAndSavedModal);

  function initDestinationsPage() {
    const gridEl = document.getElementById("all-valleys");
    if (!gridEl) return;

    const matrixBody = document.getElementById("matrix-table-body");
    const searchInput = document.getElementById("dest-search-input");
    const sortSelect = document.getElementById("dest-sort-select");
    const seasonSelect = document.getElementById("dest-season-filter");
    const metaEl = document.getElementById("results-meta");
    const filterButtons = document.querySelectorAll(".filter-pills .pill-link");

    const params = new URLSearchParams(window.location.search);
    const savedPrefs = readStorage(STORAGE_KEYS.SEARCH_PREFS, {});

    const state = {
      region: "all",
      query: params.get("valley") && params.get("valley") !== "all" ? params.get("valley") : "",
      season: params.get("season") || "all",
      sort: "default",
    };

    if (searchInput && state.query) {
      searchInput.value = state.query;
    }
    if (seasonSelect && params.get("season")) {
      seasonSelect.value = params.get("season");
    } else if (seasonSelect && savedPrefs.season && !params.has("season")) {
      seasonSelect.value = "all";
    }

    function toggleSaveTrip(id) {
      const saved = readStorage(STORAGE_KEYS.SAVED_TRIPS, []);
      const exists = saved.indexOf(id) !== -1;
      const updated = exists
        ? saved.filter(function (item) {
            return item !== id;
          })
        : saved.concat(id);

      writeStorage(STORAGE_KEYS.SAVED_TRIPS, updated);
      document.dispatchEvent(new CustomEvent("northpeak:savedUpdated"));
      renderCards();
    }

    function renderMatrixTable(items) {
      if (!matrixBody) return;
      if (items.length === 0) {
        matrixBody.innerHTML =
          '<tr><td colspan="5">No routes match your current filter selection.</td></tr>';
        return;
      }

      matrixBody.innerHTML = items
        .map(function (destination) {
          return (
            "<tr>" +
            "<td><strong>" + destination.name + "</strong></td>" +
            "<td>" + destination.regionLabel + "</td>" +
            "<td>" + destination.driveTime + "</td>" +
            "<td>" + destination.bestWindow + "</td>" +
            "<td>" + destination.difficulty + "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    function renderCards() {
      const savedIds = readStorage(STORAGE_KEYS.SAVED_TRIPS, []);
      const query = state.query.trim().toLowerCase();

      let filtered = DESTINATIONS.filter(function (destination) {
        const matchesRegion = state.region === "all" || destination.region === state.region;
        const matchesSeason =
          state.season === "all" || destination.seasons.indexOf(state.season) !== -1;
        const matchesQuery =
          !query ||
          destination.name.toLowerCase().indexOf(query) !== -1 ||
          destination.id.toLowerCase().indexOf(query) !== -1 ||
          destination.regionLabel.toLowerCase().indexOf(query) !== -1 ||
          destination.description.toLowerCase().indexOf(query) !== -1;
        return matchesRegion && matchesSeason && matchesQuery;
      });

      if (state.sort === "price-asc") {
        filtered = filtered.slice().sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (state.sort === "price-desc") {
        filtered = filtered.slice().sort(function (a, b) {
          return b.price - a.price;
        });
      } else if (state.sort === "rating") {
        filtered = filtered.slice().sort(function (a, b) {
          return b.rating - a.rating;
        });
      }

      if (metaEl) {
        metaEl.textContent =
          "Showing " + filtered.length + " of " + DESTINATIONS.length + " northern valleys";
      }

      renderMatrixTable(filtered);

      if (filtered.length === 0) {
        gridEl.innerHTML =
          '<div class="empty-state">' +
          "<h3>No matching destinations found</h3>" +
          "<p>Try clearing your search keyword or selecting \"All Seasons\" to see every valley.</p>" +
          '<button type="button" id="reset-filters-btn" class="btn btn-blue">Reset All Filters</button>' +
          "</div>";

        const resetBtn = document.getElementById("reset-filters-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", function () {
            state.region = "all";
            state.query = "";
            state.season = "all";
            state.sort = "default";
            if (searchInput) searchInput.value = "";
            if (seasonSelect) seasonSelect.value = "all";
            if (sortSelect) sortSelect.value = "default";
            filterButtons.forEach(function (button) {
              button.classList.toggle("active", button.getAttribute("data-region") === "all");
            });
            renderCards();
          });
        }
        return;
      }

      gridEl.innerHTML = filtered
        .map(function (destination) {
          const isSaved = savedIds.indexOf(destination.id) !== -1;
          return (
            '<article id="' + destination.id + '" class="dest-card">' +
            '<div class="dest-visual ' + destination.visualClass + '">' +
            (destination.imageMarkup ||
              '<svg viewBox="0 0 400 180" preserveAspectRatio="none" aria-hidden="true">' +
              destination.svgMarkup +
              "</svg>") +
            '<div class="dest-badges">' +
            '<span class="dest-tag">' + destination.regionLabel + "</span>" +
            '<span class="dest-rating">' + destination.rating.toFixed(1) + " &#9733;</span>" +
            "</div>" +
            '<button type="button" class="save-trip-btn ' + (isSaved ? "is-saved" : "") + '" data-save-id="' + destination.id + '">' +
            (isSaved ? "&#9829; Saved" : "&#9825; Save") +
            "</button>" +
            "</div>" +
            '<div class="dest-content">' +
            "<h3>" + destination.name + "</h3>" +
            '<div class="dest-meta">' +
            '<span class="badge badge-blue">' + destination.elevation + "</span>" +
            '<span class="badge badge-green">' + destination.seasonLabel + "</span>" +
            "</div>" +
            "<p>" + destination.description + "</p>" +
            '<div class="dest-footer">' +
            '<div class="dest-price">' +
            "<small>" + destination.days + "-Day Package from</small>" +
            "<strong>" + formatPKR(destination.price) + "</strong>" +
            "</div>" +
            '<a href="' + getTourUrl(destination.id) + '" class="btn ' + destination.btnClass + '">Tour Details &rarr;</a>' +
            "</div>" +
            "</div>" +
            "</article>"
          );
        })
        .join("");

      gridEl.querySelectorAll(".save-trip-btn").forEach(function (button) {
        button.addEventListener("click", function () {
          toggleSaveTrip(button.getAttribute("data-save-id"));
        });
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const region = button.getAttribute("data-region");
        if (!region) return;
        state.region = region;
        filterButtons.forEach(function (filterButton) {
          if (filterButton.getAttribute("data-region")) {
            filterButton.classList.toggle("active", filterButton === button);
          }
        });
        renderCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value;
        renderCards();
      });
    }

    if (seasonSelect) {
      seasonSelect.addEventListener("change", function () {
        state.season = seasonSelect.value;
        renderCards();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        renderCards();
      });
    }

    document.addEventListener("northpeak:savedUpdated", renderCards);
    renderCards();
  }

  document.addEventListener("DOMContentLoaded", initDestinationsPage);
})();
