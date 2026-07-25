// Event Management System (EMS) - Dashboard & Reports Features

// --- MOCK DATA ---
const MOCK_DATA = {
  stats: {
    totalEvents: { value: 12, change: "+3 this month", isPositive: true },
    activeParticipants: { value: 1420, change: "+12% vs last week", isPositive: true },
    ticketSales: { value: 48250, change: "92% of target", isPositive: true },
    avgRating: { value: 4.8, stars: 5 }
  },
  
  upcomingEvents: [
    { id: 1, name: "Kenya Tech Summit 2026", date: "Oct 15, 2026", location: "Nairobi (Main Hall)", participants: 241, status: "Registration Open", statusClass: "success" },
    { id: 2, name: "DevFest Mombasa", date: "Nov 12, 2026", location: "PrideInn Mombasa", participants: 500, status: "Sold Out", statusClass: "danger" },
    { id: 3, name: "FinTech RoundTable", date: "Oct 28, 2026", location: "Virtual (Zoom)", participants: 85, status: "Registration Open", statusClass: "success" },
    { id: 4, name: "Product Design Seminar", date: "Dec 05, 2026", location: "Gearbox Hub Nairobi", participants: 120, status: "Registration Open", statusClass: "success" },
    { id: 5, name: "Youth Leadership Forum", date: "Dec 18, 2026", location: "KICC Room 4", participants: 350, status: "Drafting", statusClass: "warning" }
  ],

  recentActivities: [
    { id: 1, text: "<strong>Jane D.</strong> registered for Kenya Tech Summit 2026", time: "2 minutes ago", type: "success" },
    { id: 2, text: "Event <strong>DevFest Mombasa</strong> was marked as <strong>Sold Out</strong>", time: "1 hour ago", type: "info" },
    { id: 3, text: "Payout of <strong>$12,450</strong> processed for Ticket Sales", time: "4 hours ago", type: "success" },
    { id: 4, text: "New feedback of <strong>4.9 stars</strong> received for Tech Roundtable", time: "1 day ago", type: "warning" },
    { id: 5, text: "<strong>Enoch Arisa</strong> updated the Database schema migration config", time: "1 day ago", type: "info" }
  ],

  notifications: [
    { id: 1, desc: "New participant registration from Alice W.", time: "5 mins ago", unread: true },
    { id: 2, desc: "System backup was completed successfully", time: "1 hour ago", unread: true },
    { id: 3, desc: "Urgent: DevFest Mombasa reaches maximum capacity limit!", time: "2 hours ago", unread: false }
  ],

  charts: {
    registrations30Days: {
      labels: ["Jul 01", "Jul 05", "Jul 10", "Jul 15", "Jul 20", "Jul 25", "Jul 30"],
      values: [150, 280, 420, 590, 780, 1100, 1420]
    },
    demographics: {
      labels: ["Nairobi", "Mombasa", "Nakuru", "Virtual", "Other East Africa"],
      values: [550, 310, 120, 350, 90]
    }
  },

  reports: {
    participants: [
      { name: "Alice Wanjiku", email: "alice.w@example.com", event: "Kenya Tech Summit 2026", date: "Jul 20, 2026", attended: "Yes", statusClass: "success" },
      { name: "Brian Kiprop", email: "brian.k@example.com", event: "DevFest Mombasa", date: "Jul 18, 2026", attended: "Yes", statusClass: "success" },
      { name: "Charles Ochieng", email: "charles.o@example.com", event: "FinTech RoundTable", date: "Jul 22, 2026", attended: "No", statusClass: "danger" },
      { name: "David Ndwiga", email: "david.n@example.com", event: "Kenya Tech Summit 2026", date: "Jul 24, 2026", attended: "Yes", statusClass: "success" },
      { name: "Emily Chebet", email: "emily.c@example.com", event: "Product Design Seminar", date: "Jul 25, 2026", attended: "No", statusClass: "danger" },
      { name: "Fatma Salem", email: "fatma.s@example.com", event: "DevFest Mombasa", date: "Jul 19, 2026", attended: "Yes", statusClass: "success" },
      { name: "Geoffrey Mutua", email: "geoffrey.m@example.com", event: "Youth Leadership Forum", date: "Jul 21, 2026", attended: "No", statusClass: "danger" }
    ],
    events: [
      { event: "Kenya Tech Summit 2026", totalParticipants: 241, totalRevenue: 24100, rating: 4.8 },
      { event: "DevFest Mombasa", totalParticipants: 500, totalRevenue: 15000, rating: 4.9 },
      { event: "FinTech RoundTable", totalParticipants: 85, totalRevenue: 0, rating: 4.5 },
      { event: "Product Design Seminar", totalParticipants: 120, totalRevenue: 6000, rating: 4.6 },
      { event: "Youth Leadership Forum", totalParticipants: 350, totalRevenue: 3500, rating: 4.4 }
    ],
    attendance: [
      { event: "Kenya Tech Summit 2026", date: "Oct 15, 2026", expected: 250, actual: 241, percentage: 96 },
      { event: "DevFest Mombasa", date: "Nov 12, 2026", expected: 500, actual: 485, percentage: 97 },
      { event: "FinTech RoundTable", date: "Oct 28, 2026", expected: 100, actual: 85, percentage: 85 },
      { event: "Product Design Seminar", date: "Dec 05, 2026", expected: 120, actual: 110, percentage: 91 },
      { event: "Youth Leadership Forum", date: "Dec 18, 2026", expected: 400, actual: 350, percentage: 87 }
    ]
  }
};

// --- DATA ACCESS LAYER (MOCK ASYNC) ---
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchStatsCardsData() {
  await delay(120);
  return MOCK_DATA.stats;
}

async function fetchUpcomingEvents() {
  await delay(150);
  return MOCK_DATA.upcomingEvents;
}

async function fetchRecentActivity() {
  await delay(100);
  return MOCK_DATA.recentActivities;
}

async function fetchNotifications() {
  await delay(80);
  return MOCK_DATA.notifications;
}

async function fetchChartData() {
  await delay(200);
  return MOCK_DATA.charts;
}

async function fetchReportsData(type) {
  await delay(180);
  return MOCK_DATA.reports[type];
}

// --- RENDERING ROUTINES ---

// Populate Stats Cards
async function initStatsCards() {
  try {
    const stats = await fetchStatsCardsData();
    const totalEventsElement = document.getElementById("stat-total-events");
    const activeParticipantsElement = document.getElementById("stat-active-participants");
    const ticketSalesElement = document.getElementById("stat-ticket-sales");
    const avgRatingElement = document.getElementById("stat-avg-rating");

    if (totalEventsElement) totalEventsElement.innerText = stats.totalEvents.value;
    if (activeParticipantsElement) activeParticipantsElement.innerText = stats.activeParticipants.value.toLocaleString();
    if (ticketSalesElement) ticketSalesElement.innerText = `$${stats.ticketSales.value.toLocaleString()}`;
    if (avgRatingElement) avgRatingElement.innerText = stats.avgRating.value.toFixed(1);
  } catch (error) {
    console.error("Error loading stats cards:", error);
  }
}

// Populate Upcoming Events Table
async function initUpcomingEventsTable(filterText = "") {
  const tbody = document.getElementById("upcoming-events-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">Loading events...</td></tr>`;

  try {
    const events = await fetchUpcomingEvents();
    const filtered = events.filter(evt => 
      evt.name.toLowerCase().includes(filterText.toLowerCase()) ||
      evt.location.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">No upcoming events match your search.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(evt => `
      <tr>
        <td style="font-weight: 600; color: var(--primary-blue);">${evt.name}</td>
        <td class="date-cell">${evt.date}</td>
        <td>${evt.location}</td>
        <td>${evt.participants}</td>
        <td><span class="badge ${evt.statusClass}">${evt.status}</span></td>
      </tr>
    `).join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--color-error);">Failed to load events.</td></tr>`;
  }
}

// Populate Recent Activity Feed
async function initRecentActivityFeed() {
  const feedContainer = document.getElementById("recent-activity-feed");
  if (!feedContainer) return;

  feedContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">Loading feed...</p>`;

  try {
    const activities = await fetchRecentActivity();
    feedContainer.innerHTML = activities.map(act => {
      let icon = "activity";
      if (act.type === "success") icon = "check-circle";
      if (act.type === "info") icon = "info";
      if (act.type === "warning") icon = "award";

      return `
        <div class="activity-item">
          <div class="activity-icon-wrapper ${act.type}">
            <i data-lucide="${icon}" style="width: 16px; height: 16px;"></i>
          </div>
          <div class="activity-details">
            <span class="activity-text">${act.text}</span>
            <span class="activity-time">${act.time}</span>
          </div>
        </div>
      `;
    }).join("");
    
    // Refresh lucide icons nested inside new activity elements
    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    feedContainer.innerHTML = `<p style="color: var(--color-error); font-size: 13px;">Failed to load activities.</p>`;
  }
}

// Populate Notifications Dropdown
async function initNotifications() {
  const notiList = document.getElementById("notifications-list");
  const badge = document.querySelector(".icon-button .notification-badge");
  if (!notiList) return;

  try {
    const list = await fetchNotifications();
    const unreadCount = list.filter(n => n.unread).length;

    if (badge) {
      badge.style.display = unreadCount > 0 ? "block" : "none";
    }

    notiList.innerHTML = list.map(n => `
      <div class="noti-item ${n.unread ? "unread" : ""}">
        <div class="noti-icon-wrapper">
          <i data-lucide="${n.unread ? "bell-ring" : "bell"}" style="width: 14px; height: 14px;"></i>
        </div>
        <div class="noti-content">
          <span class="noti-desc">${n.desc}</span>
          <span class="noti-time">${n.time}</span>
        </div>
      </div>
    `).join("");

    if (window.lucide) lucide.createIcons();
  } catch (err) {
    notiList.innerHTML = `<div style="padding: 16px; color: var(--color-error); font-size: 12px;">Error loading notifications.</div>`;
  }
}

// --- RENDER VISUAL CHARTS (CHART.JS) ---
let regChartInstance = null;
let demoChartInstance = null;

async function initCharts() {
  const ctxReg = document.getElementById("registrationsChart");
  const ctxDemo = document.getElementById("demographicsChart");

  if (!ctxReg && !ctxDemo) return; // Not on the page containing charts
  
  try {
    const chartData = await fetchChartData();

    const isMobile = window.innerWidth <= 600;

    // 1. Registrations Line Chart
    if (ctxReg) {
      if (regChartInstance) regChartInstance.destroy();
      
      regChartInstance = new Chart(ctxReg.getContext("2d"), {
        type: "line",
        data: {
          labels: chartData.registrations30Days.labels,
          datasets: [{
            label: "Registrations",
            data: chartData.registrations30Days.values,
            borderColor: "#0D2E57", // Primary Deep Blue
            backgroundColor: "rgba(13, 46, 87, 0.05)",
            borderWidth: isMobile ? 2.5 : 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#FDB022", // Accent Gold
            pointBorderColor: "#FFFFFF",
            pointHoverRadius: 6,
            pointRadius: isMobile ? 3 : 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              grid: { color: "#F1F5F9" },
              ticks: { color: "#667085", font: { family: "Inter", size: isMobile ? 10 : 11 } }
            },
            x: {
              grid: { display: false },
              ticks: { 
                color: "#667085", 
                font: { family: "Inter", size: isMobile ? 10 : 11 },
                maxTicksLimit: isMobile ? 5 : 7,
                maxRotation: 0
              }
            }
          }
        }
      });
    }

    // 2. Demographics Donut Chart
    if (ctxDemo) {
      if (demoChartInstance) demoChartInstance.destroy();

      demoChartInstance = new Chart(ctxDemo.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: chartData.demographics.labels,
          datasets: [{
            data: chartData.demographics.values,
            backgroundColor: [
              "#0D2E57", // Deep Blue
              "#2563EB", // Royal Blue
              "#38BDF8", // Sky Blue
              "#FDB022", // Brand Gold
              "#94A3B8"  // Slate Light
            ],
            hoverOffset: 6,
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: isMobile ? 10 : 12,
                font: { family: "Inter", size: isMobile ? 10 : 11 },
                color: "#1F1F1F",
                padding: isMobile ? 8 : 14
              }
            }
          },
          cutout: isMobile ? "65%" : "70%"
        }
      });
    }
  } catch (error) {
    console.error("Error building charts:", error);
  }
}

// --- REPORTS RENDERING & SEARCH ---
let currentReportType = "participants";

async function renderReportTable(filterText = "", dateFilterVal = "") {
  const tbody = document.getElementById("reports-tbody");
  const thead = document.getElementById("reports-thead");
  const tableTitle = document.getElementById("report-visual-title");
  
  if (!tbody || !thead) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">Loading selected report...</td></tr>`;

  try {
    const data = await fetchReportsData(currentReportType);
    let filtered = [...data];

    // Filter by text search
    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      if (currentReportType === "participants") {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.email.toLowerCase().includes(q) ||
          item.event.toLowerCase().includes(q)
        );
      } else if (currentReportType === "events") {
        filtered = filtered.filter(item => 
          item.event.toLowerCase().includes(q)
        );
      } else if (currentReportType === "attendance") {
        filtered = filtered.filter(item => 
          item.event.toLowerCase().includes(q)
        );
      }
    }

    // Filter by Date (simple match or contains)
    if (dateFilterVal) {
      // In a real app we'd compare dates, here we just mock compare against the date string
      // Let's format the date input (YYYY-MM-DD vs Oct 15, 2026) or keep it simple.
      // We will skip strict date matching if it's empty, or do a simple parsing match.
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">No reports found matching criteria.</td></tr>`;
      return;
    }

    // Setup headers and bodies dynamically
    if (currentReportType === "participants") {
      tableTitle.innerText = "Detailed Participants Report";
      thead.innerHTML = `
        <tr>
          <th>Attendee Name</th>
          <th>Email Address</th>
          <th>Registered Event</th>
          <th>Registration Date</th>
          <th>Attended Status</th>
        </tr>
      `;
      tbody.innerHTML = filtered.map(row => `
        <tr>
          <td style="font-weight: 600;">${row.name}</td>
          <td>${row.email}</td>
          <td style="color: var(--primary-blue); font-weight: 550;">${row.event}</td>
          <td>${row.date}</td>
          <td><span class="badge ${row.statusClass}">${row.attended}</span></td>
        </tr>
      `).join("");
    } else if (currentReportType === "events") {
      tableTitle.innerText = "Events Financial & Rating Summary";
      thead.innerHTML = `
        <tr>
          <th>Event Name</th>
          <th>Total Attending</th>
          <th>Expected Revenue</th>
          <th>Avg. Rating Indicator</th>
        </tr>
      `;
      tbody.innerHTML = filtered.map(row => {
        let stars = "";
        const fullStars = Math.floor(row.rating);
        for(let i=0; i<5; i++) {
          stars += `<i data-lucide="star" style="width: 14px; height: 14px; fill: ${i < fullStars ? 'var(--accent-gold)' : 'none'}; color: var(--accent-gold);"></i>`;
        }
        return `
          <tr>
            <td style="font-weight: 600; color: var(--primary-blue);">${row.event}</td>
            <td>${row.totalParticipants} Participants</td>
            <td style="font-weight: 600;">$${row.totalRevenue.toLocaleString()}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600;">${row.rating.toFixed(1)}</span>
                <span style="display: inline-flex; align-items: center;">${stars}</span>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    } else if (currentReportType === "attendance") {
      tableTitle.innerText = "Cross-Event Attendance Analytics";
      thead.innerHTML = `
        <tr>
          <th>Event Name</th>
          <th>Incident Date</th>
          <th>Expected Attendance</th>
          <th>Actual Attendees</th>
          <th>Attendance KPI %</th>
        </tr>
      `;
      tbody.innerHTML = filtered.map(row => `
        <tr>
          <td style="font-weight: 600; color: var(--primary-blue);">${row.event}</td>
          <td>${row.date}</td>
          <td>${row.expected}</td>
          <td>${row.actual}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 12px; min-width: 160px;">
              <span class="progress-percent" style="width: 32px;">${row.percentage}%</span>
              <div class="progress-bar-container" style="flex: 1;">
                <div class="progress-bar-fill" style="width: ${row.percentage}%; background-color: ${row.percentage >= 90 ? 'var(--color-success)' : 'var(--color-warning)'}"></div>
              </div>
            </div>
          </td>
        </tr>
      `).join("");
    }

    if (window.lucide) lucide.createIcons();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--color-error);">Failed to load report data.</td></tr>`;
  }
}

// Switch Active Reports
function selectReportType(type, buttonEl) {
  currentReportType = type;
  
  // Update Buttons CSS
  document.querySelectorAll(".report-selector-item").forEach(btn => {
    btn.classList.remove("active");
  });
  if (buttonEl) {
    buttonEl.classList.add("active");
  }

  // Clear filters
  const textInput = document.getElementById("reports-search-input");
  const dateInput = document.getElementById("reports-date-input");
  if(textInput) textInput.value = "";
  if(dateInput) dateInput.value = "";

  renderReportTable();
}

// --- SETUP EVENT LISTENERS & DOM CARING ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Render all Dashboard details
  initStatsCards();
  initUpcomingEventsTable();
  initRecentActivityFeed();
  initNotifications();
  initCharts();

  // 2. If we are on reports.html page, initialize default table
  if (document.getElementById("reports-tbody")) {
    renderReportTable();
  }

  // 3. Dropdowns logic
  const profileTrigger = document.getElementById("avatarDropdownTrigger");
  const profileMenu = document.getElementById("profileDropdownMenu");
  const notiTrigger = document.getElementById("notiDropdownTrigger");
  const notiMenu = document.getElementById("notiDropdownMenu");

  if(profileTrigger && profileMenu) {
    profileTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("show");
      if(notiMenu) notiMenu.classList.remove("show");
    });
  }

  if(notiTrigger && notiMenu) {
    notiTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      notiMenu.classList.toggle("show");
      if(profileMenu) profileMenu.classList.remove("show");
    });
  }

  // Close dropdowns on outside clicks
  document.addEventListener("click", () => {
    if(profileMenu) profileMenu.classList.remove("show");
    if(notiMenu) notiMenu.classList.remove("show");
  });

  // 4. Search and Filter bar logic
  // Dashboard Table Search
  const dashboardSearch = document.getElementById("dashboard-search-input");
  if (dashboardSearch) {
    dashboardSearch.addEventListener("input", (e) => {
      initUpcomingEventsTable(e.target.value);
    });
  }

  // Global Header Search (Fallback to filter whatever page we are on)
  const globalHeaderSearch = document.getElementById("global-search-input");
  if (globalHeaderSearch) {
    globalHeaderSearch.addEventListener("input", (e) => {
      const q = e.target.value;
      if (document.getElementById("upcoming-events-tbody")) {
        initUpcomingEventsTable(q);
      } else if (document.getElementById("reports-tbody")) {
        const localSearch = document.getElementById("reports-search-input");
        if(localSearch) localSearch.value = q;
        renderReportTable(q);
      }
    });
  }

  // Reports Table Search & Date
  const reportsSearch = document.getElementById("reports-search-input");
  const reportsDate = document.getElementById("reports-date-input");
  
  if (reportsSearch) {
    reportsSearch.addEventListener("input", () => {
      const q = reportsSearch.value;
      const d = reportsDate ? reportsDate.value : "";
      renderReportTable(q, d);
    });
  }
  
  if (reportsDate) {
    reportsDate.addEventListener("change", () => {
      const q = reportsSearch ? reportsSearch.value : "";
      const d = reportsDate.value;
      renderReportTable(q, d);
    });
  }

  // Initialize Outline Lucide vector icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
