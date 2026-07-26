// ================================
// EVENT MANAGEMENT SYSTEM
// events.js
// ================================

// Create Event Form
const createForm = document.getElementById("createEventForm");

if (createForm) {

    createForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const event = {

            id: Date.now(),

            name: document.getElementById("eventName").value.trim(),

            category: document.getElementById("category").value,

            venue: document.getElementById("venue").value.trim(),

            organizer: document.getElementById("organizer").value.trim(),

            startDate: document.getElementById("startDate").value,

            endDate: document.getElementById("endDate").value,

            capacity: document.getElementById("capacity").value,

            price: document.getElementById("ticketPrice").value,

            description: document.getElementById("description").value.trim(),

            status: "Upcoming"

        };

        // Validation

        if (
            event.name === "" ||
            event.venue === "" ||
            event.organizer === "" ||
            event.startDate === "" ||
            event.endDate === ""
        ) {

            alert("Please fill in all required fields.");

            return;

        }

        let events = JSON.parse(localStorage.getItem("events")) || [];

        events.push(event);

        localStorage.setItem("events", JSON.stringify(events));

        alert("Event created successfully!");

        window.location.href = "events.html";

    });

}



// ================================
// LOAD EVENTS
// ================================

function loadEvents() {

    const table = document.getElementById("eventsTable");

    if (!table) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];

    table.innerHTML = "";

    const search = document.getElementById("eventSearch")?.value.toLowerCase() || "";

const category = document.getElementById("categoryFilter")?.value || "All Categories";

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

                <button class="delete-btn" onclick="deleteEvent(${event.id})">🗑</button>

            </td>

        </tr>

        `;

    });

}

loadEvents();


// ================================
// DELETE EVENT
// ================================

function deleteEvent(id){

    if(!confirm("Delete this event?")) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];

    events = events.filter(event => event.id !== id);

    localStorage.setItem("events", JSON.stringify(events));

    loadEvents();

}


// ================================
// EDIT EVENT
// ================================

function editEvent(id){

    localStorage.setItem("editEventID", id);

    window.location.href = "edit_event.html";

}
// ================================
// LOAD EVENT INTO EDIT FORM
// ================================

const editForm = document.getElementById("editEventForm");

if (editForm) {

    const editID = Number(localStorage.getItem("editEventID"));

    let events = JSON.parse(localStorage.getItem("events")) || [];

    const event = events.find(e => e.id === editID);

    if (event) {

        document.getElementById("eventName").value = event.name;
        document.getElementById("category").value = event.category;
        document.getElementById("venue").value = event.venue;
        document.getElementById("organizer").value = event.organizer;
        document.getElementById("startDate").value = event.startDate;
        document.getElementById("endDate").value = event.endDate;
        document.getElementById("capacity").value = event.capacity;
        document.getElementById("ticketPrice").value = event.price;
        document.getElementById("description").value = event.description;

    }

    editForm.addEventListener("submit", function(e){

        e.preventDefault();

        event.name = document.getElementById("eventName").value.trim();
        event.category = document.getElementById("category").value;
        event.venue = document.getElementById("venue").value.trim();
        event.organizer = document.getElementById("organizer").value.trim();
        event.startDate = document.getElementById("startDate").value;
        event.endDate = document.getElementById("endDate").value;
        event.capacity = document.getElementById("capacity").value;
        event.price = document.getElementById("ticketPrice").value;
        event.description = document.getElementById("description").value.trim();

        localStorage.setItem("events", JSON.stringify(events));

        alert("Event updated successfully!");

        window.location.href = "events.html";

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
