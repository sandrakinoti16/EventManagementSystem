// ===============================
// Event Management System
// events.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("eventSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const rows = document.querySelectorAll("#eventsTable tr");

    // ===============================
    // SEARCH & FILTER
    // ===============================

    function filterEvents() {

        const search = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const status = statusFilter.value;

        rows.forEach(row => {

            const eventName =
                row.cells[0].textContent.toLowerCase();

            const rowCategory =
                row.cells[1].textContent;

            const rowStatus =
                row.cells[5].textContent.trim();

            const matchesSearch =
                eventName.includes(search);

            const matchesCategory =
                category === "All Categories" ||
                rowCategory === category;

            const matchesStatus =
                status === "All Status" ||
                rowStatus === status;

            if (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    }

    searchInput.addEventListener("keyup", filterEvents);
    categoryFilter.addEventListener("change", filterEvents);
    statusFilter.addEventListener("change", filterEvents);

    // ===============================
    // DELETE MODAL
    // ===============================

    const modal = document.getElementById("deleteModal");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");

    let selectedRow = null;

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", function () {

            selectedRow = this.closest("tr");

            modal.style.display = "flex";

        });

    });

    cancelDelete.addEventListener("click", () => {

        modal.style.display = "none";

    });

    confirmDelete.addEventListener("click", () => {

        if (selectedRow) {

            selectedRow.remove();

        }

        modal.style.display = "none";

    });

    // ===============================
    // CLOSE MODAL WHEN CLICKING OUTSIDE
    // ===============================

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

    // ===============================
    // VIEW BUTTON
    // ===============================

    document.querySelectorAll(".view-btn").forEach(button => {

        button.addEventListener("click", () => {

            alert("View Event page coming soon.");

        });

    });

});