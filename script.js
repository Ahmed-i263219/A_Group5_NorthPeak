/* ==========================================================================
   NorthPeak Northern Travel Tours — Interactive Scripts
   Handles:
   1. dining.html: Speciality category filtering
   2. snacks.html: Road Snack Pack Builder with live PKR total & reset
   3. meal-planner.html: Daily Meal & Snack Cost Calculator in PKR
   ========================================================================== */

(function () {
  "use strict";

  function formatPKR(amount) {
    var safeAmount = Math.max(0, Math.round(Number(amount) || 0));
    return "PKR " + safeAmount.toLocaleString("en-PK");
  }

  /* ------------------------------------------------------------------------
     1. Local Cuisine & Northern Dining Guide (dining.html)
     ------------------------------------------------------------------------ */
  function initDiningFilter() {
    var filterButtons = document.querySelectorAll("[data-filter]");
    var dishCards = document.querySelectorAll(".dish-card[data-categories]");
    var countBadge = document.getElementById("dining-result-count");
    var emptyNotice = document.getElementById("dining-empty-state");

    if (!filterButtons.length || !dishCards.length) {
      return;
    }

    function applyFilter(category) {
      var visibleCount = 0;

      dishCards.forEach(function (card) {
        var categories = (card.getAttribute("data-categories") || "")
          .split(",")
          .map(function (item) {
            return item.trim().toLowerCase();
          });

        var isMatch = category === "all" || categories.indexOf(category) !== -1;
        card.hidden = !isMatch;
        if (isMatch) {
          visibleCount += 1;
        }
      });

      filterButtons.forEach(function (btn) {
        var active = btn.getAttribute("data-filter") === category;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });

      if (countBadge) {
        countBadge.textContent =
          visibleCount + (visibleCount === 1 ? " speciality shown" : " specialities shown");
      }

      if (emptyNotice) {
        emptyNotice.hidden = visibleCount > 0;
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var category = btn.getAttribute("data-filter") || "all";
        applyFilter(category);
      });
    });

    applyFilter("all");
  }

  /* ------------------------------------------------------------------------
     2. Highway Chai & Road Snack Stopovers (snacks.html)
     ------------------------------------------------------------------------ */
  function initSnackPackBuilder() {
    var addButtons = document.querySelectorAll("[data-add-snack]");
    var packList = document.getElementById("snack-pack-list");
    var packEmpty = document.getElementById("snack-pack-empty");
    var packTotal = document.getElementById("snack-pack-total");
    var packCount = document.getElementById("snack-pack-count");
    var resetButton = document.getElementById("reset-snack-pack");
    var statusText = document.getElementById("snack-pack-status");

    if (!addButtons.length || !packList || !packTotal || !resetButton) {
      return;
    }

    var snackPack = [];

    function findSnackIndex(id) {
      for (var i = 0; i < snackPack.length; i += 1) {
        if (snackPack[i].id === id) {
          return i;
        }
      }
      return -1;
    }

    function renderSnackPack() {
      packList.innerHTML = "";

      var totalPKR = 0;
      var totalItems = 0;

      snackPack.forEach(function (item) {
        totalPKR += item.price * item.qty;
        totalItems += item.qty;

        var li = document.createElement("li");
        li.className = "pack-item";

        var topRow = document.createElement("div");
        topRow.className = "pack-item-top";

        var nameSpan = document.createElement("span");
        nameSpan.className = "pack-item-name";
        nameSpan.textContent = item.name;

        var priceSpan = document.createElement("span");
        priceSpan.className = "pack-item-price";
        priceSpan.textContent = formatPKR(item.price * item.qty);

        topRow.appendChild(nameSpan);
        topRow.appendChild(priceSpan);

        var controlsRow = document.createElement("div");
        controlsRow.className = "pack-item-controls";

        var qtyGroup = document.createElement("div");
        qtyGroup.className = "qty-group";

        var decBtn = document.createElement("button");
        decBtn.type = "button";
        decBtn.className = "qty-btn";
        decBtn.setAttribute("aria-label", "Decrease quantity of " + item.name);
        decBtn.textContent = "−";
        decBtn.addEventListener("click", function () {
          updateQty(item.id, -1);
        });

        var qtyVal = document.createElement("span");
        qtyVal.className = "qty-val";
        qtyVal.textContent = String(item.qty);

        var incBtn = document.createElement("button");
        incBtn.type = "button";
        incBtn.className = "qty-btn";
        incBtn.setAttribute("aria-label", "Increase quantity of " + item.name);
        incBtn.textContent = "+";
        incBtn.addEventListener("click", function () {
          updateQty(item.id, 1);
        });

        qtyGroup.appendChild(decBtn);
        qtyGroup.appendChild(qtyVal);
        qtyGroup.appendChild(incBtn);

        var removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function () {
          removeSnack(item.id);
        });

        controlsRow.appendChild(qtyGroup);
        controlsRow.appendChild(removeBtn);

        li.appendChild(topRow);
        li.appendChild(controlsRow);
        packList.appendChild(li);
      });

      if (packEmpty) {
        packEmpty.hidden = snackPack.length > 0;
      }

      packTotal.textContent = formatPKR(totalPKR);
      if (packCount) {
        packCount.textContent = totalItems + (totalItems === 1 ? " item" : " items");
      }
      resetButton.disabled = snackPack.length === 0;
    }

    function addSnack(id, name, price) {
      var idx = findSnackIndex(id);
      if (idx !== -1) {
        snackPack[idx].qty += 1;
      } else {
        snackPack.push({
          id: id,
          name: name,
          price: price,
          qty: 1
        });
      }
      if (statusText) {
        statusText.textContent = "Added " + name + " to your Road Snack Pack.";
      }
      renderSnackPack();
    }

    function updateQty(id, delta) {
      var idx = findSnackIndex(id);
      if (idx === -1) {
        return;
      }
      snackPack[idx].qty += delta;
      if (snackPack[idx].qty <= 0) {
        snackPack.splice(idx, 1);
      }
      renderSnackPack();
    }

    function removeSnack(id) {
      var idx = findSnackIndex(id);
      if (idx === -1) {
        return;
      }
      var removedName = snackPack[idx].name;
      snackPack.splice(idx, 1);
      if (statusText) {
        statusText.textContent = "Removed " + removedName + " from your Road Snack Pack.";
      }
      renderSnackPack();
    }

    addButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id") || "";
        var name = btn.getAttribute("data-name") || "KKH Snack";
        var price = Number(btn.getAttribute("data-price")) || 0;
        addSnack(id, name, price);
      });
    });

    resetButton.addEventListener("click", function () {
      snackPack = [];
      if (statusText) {
        statusText.textContent = "Road Snack Pack reset to PKR 0.";
      }
      renderSnackPack();
    });

    renderSnackPack();
  }

  /* ------------------------------------------------------------------------
     3. Daily Meal & Snack Cost Calculator (meal-planner.html)
     ------------------------------------------------------------------------ */
  function initMealPlanner() {
    var form = document.getElementById("meal-planner-form");
    var travelersInput = document.getElementById("travelers-input");
    var daysInput = document.getElementById("days-input");
    var tierSelect = document.getElementById("meal-tier-select");
    var dietSelect = document.getElementById("dietary-select");
    var highwaySnackCheck = document.getElementById("include-snacks-check");
    var resetDefaultsBtn = document.getElementById("reset-planner-btn");

    var totalBudgetEl = document.getElementById("planner-total-budget");
    var travelerDaysEl = document.getElementById("summary-traveler-days");
    var tierRateEl = document.getElementById("summary-tier-rate");
    var dietAdjustEl = document.getElementById("summary-diet-adjust");
    var snackAllowanceEl = document.getElementById("summary-snack-allowance");
    var perPersonEl = document.getElementById("summary-per-person");
    var dailyGroupEl = document.getElementById("summary-daily-group");
    var pairingNoteEl = document.getElementById("summary-pairing-note");

    if (!form || !travelersInput || !daysInput || !tierSelect || !dietSelect || !totalBudgetEl) {
      return;
    }

    var TIER_CONFIG = {
      standard: {
        label: "Standard Trail",
        rate: 1800,
        note: "Covers hearty local breakfasts such as Diram Fitti (PKR 550) and classic highway dhaba dinners."
      },
      explorer: {
        label: "Explorer Comfort",
        rate: 2800,
        note: "Balanced daily dining featuring Diram Fitti, Chapshuro (PKR 750), Balti Mantu (PKR 950), and hot valley teas."
      },
      alpine: {
        label: "Alpine Signature",
        rate: 4200,
        note: "Full northern culinary trail including Grilled Swat Trout (PKR 1,450), Balti platters, and artisan valley cafés."
      }
    };

    var DIET_CONFIG = {
      standard: {
        label: "Standard (All Local Dishes)",
        delta: 0,
        note: "Full access to regional meat and vegetarian mountain specialities."
      },
      vegetarian: {
        label: "Vegetarian Friendly (-PKR 250/day)",
        delta: -250,
        note: "Focused on apricot-oil Diram Fitti, herb flatbreads, lentil stews, walnut loaves, and fresh valley produce."
      },
      halal_premium: {
        label: "Chef-Sourced Fresh Trout & Grill (+PKR 450/day)",
        delta: 450,
        note: "Prioritizes fresh river Swat trout, hand-minced Chapshuro, and bespoke campsite hot grills."
      },
      gluten_conscious: {
        label: "Custom Mountain Prep (+PKR 300/day)",
        delta: 300,
        note: "Includes dedicated rice, grilled trout, slow-cooked stews, and separate kitchen preparation."
      }
    };

    var SNACK_DAILY_RATE = 450;

    function clampInt(value, min, max, fallback) {
      var parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        return fallback;
      }
      return Math.min(max, Math.max(min, parsed));
    }

    function calculateBudget() {
      var travelers = clampInt(travelersInput.value, 1, 50, 2);
      var days = clampInt(daysInput.value, 1, 30, 5);
      var tierKey = tierSelect.value in TIER_CONFIG ? tierSelect.value : "explorer";
      var dietKey = dietSelect.value in DIET_CONFIG ? dietSelect.value : "standard";
      var includeSnacks = highwaySnackCheck ? highwaySnackCheck.checked : true;

      var tier = TIER_CONFIG[tierKey];
      var diet = DIET_CONFIG[dietKey];
      var snackDaily = includeSnacks ? SNACK_DAILY_RATE : 0;

      var perPersonPerDay = Math.max(0, tier.rate + diet.delta + snackDaily);
      var travelerDays = travelers * days;
      var totalBudget = perPersonPerDay * travelerDays;
      var perPersonTrip = perPersonPerDay * days;
      var dailyGroupCost = perPersonPerDay * travelers;

      totalBudgetEl.textContent = formatPKR(totalBudget);

      if (travelerDaysEl) {
        travelerDaysEl.textContent = travelers + " × " + days + " (" + travelerDays + " traveler-days)";
      }
      if (tierRateEl) {
        tierRateEl.textContent = tier.label + " (" + formatPKR(tier.rate) + "/day)";
      }
      if (dietAdjustEl) {
        var deltaPrefix = diet.delta > 0 ? "+" : diet.delta < 0 ? "−" : "";
        var deltaText =
          diet.delta === 0 ? "PKR 0/day" : deltaPrefix + formatPKR(Math.abs(diet.delta)) + "/day";
        dietAdjustEl.textContent = diet.label.split("(")[0].trim() + " (" + deltaText + ")";
      }
      if (snackAllowanceEl) {
        snackAllowanceEl.textContent = includeSnacks
          ? formatPKR(SNACK_DAILY_RATE) + "/person/day"
          : "Not included (PKR 0)";
      }
      if (perPersonEl) {
        perPersonEl.textContent = formatPKR(perPersonTrip);
      }
      if (dailyGroupEl) {
        dailyGroupEl.textContent = formatPKR(dailyGroupCost);
      }
      if (pairingNoteEl) {
        pairingNoteEl.textContent = tier.note + " " + diet.note;
      }
    }

    form.addEventListener("input", calculateBudget);
    form.addEventListener("change", calculateBudget);

    travelersInput.addEventListener("blur", function () {
      travelersInput.value = String(clampInt(travelersInput.value, 1, 50, 2));
      calculateBudget();
    });

    daysInput.addEventListener("blur", function () {
      daysInput.value = String(clampInt(daysInput.value, 1, 30, 5));
      calculateBudget();
    });

    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener("click", function () {
        travelersInput.value = "2";
        daysInput.value = "5";
        tierSelect.value = "explorer";
        dietSelect.value = "standard";
        if (highwaySnackCheck) {
          highwaySnackCheck.checked = true;
        }
        calculateBudget();
      });
    }

    calculateBudget();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDiningFilter();
    initSnackPackBuilder();
    initMealPlanner();
  });
})();
