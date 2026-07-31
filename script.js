/* ==========================================================
   Study Clock — logic
   ========================================================== */

(function () {
  "use strict";

  var TIME_ZONE = "Asia/Tokyo";

  var WEEKDAY_JP = {
    Sun: "日",
    Mon: "月",
    Tue: "火",
    Wed: "水",
    Thu: "木",
    Fri: "金",
    Sat: "土"
  };

  var timeEl = document.getElementById("time");
  var dateEl = document.getElementById("date");

  // Formatter that extracts Tokyo-local date/time parts regardless
  // of the visitor's own device timezone.
  var formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function getParts(now) {
    var parts = formatter.formatToParts(now);
    var map = {};
    for (var i = 0; i < parts.length; i++) {
      map[parts[i].type] = parts[i].value;
    }
    return map;
  }

  function render() {
    var now = new Date();
    var p = getParts(now);

    // Some locales report "24" for midnight hour; normalize to 00.
    var hour = p.hour === "24" ? "00" : pad2(p.hour);

    timeEl.textContent = hour + ":" + pad2(p.minute) + ":" + pad2(p.second);

    var weekdayJp = WEEKDAY_JP[p.weekday] || p.weekday;
    dateEl.textContent =
      p.year + "年" + p.month + "月" + p.day + "日（" + weekdayJp + "）";
  }

  // Align updates to the start of each real second for smooth ticking.
  function scheduleNextTick() {
    render();
    var msIntoSecond = Date.now() % 1000;
    var delay = 1000 - msIntoSecond;
    setTimeout(function () {
      scheduleNextTick();
    }, delay);
  }

  scheduleNextTick();

  // ---------------- bottom runner walk-cycle ----------------

  var frameA = document.getElementById("frameA");
  var frameB = document.getElementById("frameB");
  var frames = [frameA, frameB];
  var current = 0;

  function stepWalkCycle() {
    frames[current].classList.remove("active");
    current = (current + 1) % frames.length;
    frames[current].classList.add("active");
  }

  if (frameA && frameB) {
    frameA.classList.add("active");
    setInterval(stepWalkCycle, 160);
  }
})();
