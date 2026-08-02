// ================================
// EVENT MANAGEMENT SYSTEM
// events.js
// ================================

// ================================
// CREATE EVENT FORM
// ================================

const createForm = document.getElementById("createEventForm");

if (createForm) {

    createForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const event = {

            title: document.getElementById("eventName").value.trim(),

            description: document.getElementById("description").value.trim(),

            venue: document.getElementById("venue").value.trim(),

            event_date: document.getElementById("startDate").value,

            event_time: "09:00:00",

            capacity: parseInt(document.getElementById("capacity").value)

        };

        // Validation
        if (
            event.title === "" ||
            event.venue === "" ||
            event.event_date === ""
        ) {

            alert("Please fill in all required fields.");

            return;

        }

        try {

            const response = await fetch("/events", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(event)

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Failed to create event.");

                return;

            }

            alert(data.message);

            window.location.href = "events.html";

        } catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");

        }

    });

}



// ================================
// LOAD EVENTS FROM DATABASE
// ================================

async function loadEvents() {

    const table = document.getElementById("eventsTable");

    if (!table) return;

    table.innerHTML = "";

    try {

        const response = await fetch("/events");

        const events = await response.json();

        const search =
            document.getElementById("eventSearch")?.value.toLowerCase() || "";

        const category =
            document.getElementById("categoryFilter")?.value || "All Categories";

        events
            .filter(event => {

                const matchesSearch =
                    event.name.toLowerCase().includes(search);

                const matchesCategory =
                    category === "All Categories" ||
                    event.category === category;

                return matchesSearch && matchesCategory;

            })
            .forEach((event) => {

                table.innerHTML += `

                <tr>

                    <td>${event.name}</td>

                    <td>${event.category}</td>

                    <td>${event.venue}</td>

                    <td>${event.startDate}</td>

                    <td>${event.capacity}</td>

                    <td>
                        <span class="status upcoming">
                            ● ${event.status}
                        </span>
                    </td>

                    <td>

                        <button class="view-btn" onclick="viewEvent(${event.id})">
                            <i class="ri-eye-line"></i>
                        </button>

                        <button class="edit-btn" onclick="editEvent(${event.id})">
                            <i class="ri-edit-line"></i>
                        </button>

                        <button class="delete-btn" onclick="deleteEvent(${event.id})">
                            🗑
                        </button>

                    </td>

                </tr>

                `;

            });

    } catch (error) {

        console.error(error);

        alert("Unable to load events.");

    }

}

loadEvents();


// ================================
// DELETE EVENT
// ================================

async function deleteEvent(id) {

    if (!confirm("Delete this event?")) return;

    try {

        const response = await fetch(`/events/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        alert(data.message);

        loadEvents();

    } catch (error) {

        console.error(error);

        alert("Unable to delete event.");

    }

}


// ================================
// EDIT EVENT
// ================================

function editEvent(id) {

    window.location.href = `edit_event.html?id=${id}`;

}
// ================================
// LOAD EVENT INTO EDIT FORM
// ================================

const editForm = document.getElementById("editEventForm");

if (editForm) {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    fetch(`/events`)
        .then(res => res.json())
        .then(events => {

            const event = events.find(e => e.id == id);

            if (!event) {

                alert("Event not found.");

                window.location.href = "events.html";

                return;

            }

            document.getElementById("eventName").value = event.name;
            document.getElementById("venue").value = event.venue;
            document.getElementById("startDate").value = event.startDate;
            document.getElementById("endDate").value = event.endDate;
            document.getElementById("capacity").value = event.capacity;
            document.getElementById("description").value = event.description;

            editForm.addEventListener("submit", async function (e) {

                e.preventDefault();

                const updatedEvent = {

                    title: document.getElementById("eventName").value.trim(),
                    description: document.getElementById("description").value.trim(),
                    venue: document.getElementById("venue").value.trim(),
                    event_date: document.getElementById("startDate").value,
                    event_time: "09:00:00",
                    capacity: parseInt(document.getElementById("capacity").value)

                };

                const response = await fetch(`/events/${id}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updatedEvent)

                });

                const data = await response.json();

                alert(data.message);

                if (response.ok) {

                    window.location.href = "events.html";

                }

            });

        });

}
// ================================
// VIEW EVENT
// ================================

function viewEvent(id){

    const events = JSON.parse(localStorage.getItem("events")) || [];

    const event = events.find(e => e.id === id);

    if(!event) return;

    document.getElementById("eventDetails").innerHTML = `

        <p><strong>Event:</strong> ${event.name}</p>

        <p><strong>Category:</strong> ${event.category}</p>

        <p><strong>Venue:</strong> ${event.venue}</p>

        <p><strong>Organizer:</strong> ${event.organizer}</p>

        <p><strong>Start Date:</strong> ${event.startDate}</p>

        <p><strong>End Date:</strong> ${event.endDate}</p>

        <p><strong>Capacity:</strong> ${event.capacity}</p>

        <p><strong>Ticket Price:</strong> Ksh ${event.price}</p>

        <p><strong>Status:</strong> ${event.status}</p>

        <p><strong>Description:</strong><br>${event.description}</p>

    `;

    document.getElementById("viewModal").style.display = "flex";

}

document.getElementById("closeViewModal")?.addEventListener("click", function(){

    document.getElementById("viewModal").style.display = "none";

});
// ================================
// LIVE SEARCH
// ================================

const searchInput = document.getElementById("eventSearch");

if (searchInput) {

    searchInput.addEventListener("keyup", loadEvents);

}
// ================================
// CATEGORY FILTER
// ================================

const categoryFilter = document.getElementById("categoryFilter");

if (categoryFilter) {

    categoryFilter.addEventListener("change", loadEvents);

}
