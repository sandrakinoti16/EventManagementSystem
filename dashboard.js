// Event Management System (EMS) - Dashboard & Reports Features


async function loadCurrentUser(){

    try {

        const response = await fetch("/auth/current-user", {
            credentials: "include"
        });

        const user = await response.json();

if (!response.ok) {
    console.error(user.message);
    return;
}


        const avatar = document.querySelector(".avatar");
        const username = document.querySelector(".dropdown-user-name");
        const email = document.querySelector(".dropdown-user-email");


        if(avatar){
            avatar.textContent = user.fullName
                .split(" ")
                .map(name => name[0])
                .join("")
                .toUpperCase();
        }


        if(username){
            username.textContent = user.fullName;
        }


        if(email){
            email.textContent = user.email;
        }


        const welcome = document.querySelector(".page-title-section p");

        if(welcome){
            welcome.textContent =
            `Welcome back, ${user.fullName.split(" ")[0]}! Here's a brief summary of how your events are performing.`;
        }


    } catch(error){

        console.error("Unable to load user:", error);

    }

}

async function fetchUpcomingEvents() {

    const response = await fetch("/api/dashboard/events", {
        credentials: "include"
    });

    return await response.json();

}

async function fetchRecentActivity() {

    const response = await fetch("/api/dashboard/activity", {
        credentials: "include"
    });

    return await response.json();

}

async function fetchNotifications() {
    return [];
}

async function fetchChartData() {

    const response = await fetch("/api/dashboard/charts", {
        credentials: "include"
    });
    

    return await response.json();

}

async function fetchReportsData(type) {

    const response = await fetch(`/api/reports/${type}`, {
        credentials: "include"
    });

    return await response.json();

}
// --- RENDERING ROUTINES ---



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
           <td style="font-weight: 600;">Ksh ${row.totalRevenue.toLocaleString()}</td>
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
  
  loadDashboardStats();
  initUpcomingEventsTable();
  initRecentActivityFeed();
  initNotifications();
  initCharts();
  loadCurrentUser();

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
// =======================================
// DASHBOARD DATABASE STATS
// =======================================

async function loadDashboardStats() {

    try {

        const response = await fetch("/api/dashboard");

        const stats = await response.json();

        const totalEvents = document.getElementById("stat-total-events");
        const participants = document.getElementById("stat-active-participants");
        const ticketSales = document.getElementById("stat-ticket-sales");
        const rating = document.getElementById("stat-avg-rating");

        if (totalEvents)
            totalEvents.textContent = stats.totalEvents;

        if (participants)
            participants.textContent = Number(stats.totalParticipants).toLocaleString();

        if (ticketSales)
            ticketSales.textContent = `Ksh ${Number(stats.totalTicketSales).toLocaleString()}`;

        if (rating)
            rating.textContent = Number(stats.averageRating).toFixed(1);

    } catch (error) {

        console.error("Dashboard loading error:", error);

    }
 // Initialize Outline Lucide vector icons
  if (window.lucide) {
    lucide.createIcons();
  }

}
// ======================
// LOGOUT
// ======================
const logoutBtn = document.querySelector(".logout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            await fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            window.location.href = "/auth/login.html";
        } catch (err) {
            console.error(err);
            alert("Logout failed.");
        }
    });
}

