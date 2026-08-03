document
    .getElementById("registrationForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const eventName = document.getElementById("eventName").value.trim();

        // Get logged-in user
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id) {
    alert("Please login first.");
    window.location.href = "../login.html";
    return;
}

        try {

            // Get all events
            const eventsResponse = await fetch("http://localhost:3000/events");

            const events = await eventsResponse.json();

console.log(events);
            // Find selected event
const selectedEvent = events.find(
    event =>
        event.name &&
        event.name.toLowerCase() === eventName.toLowerCase()
);


            if (!selectedEvent) {
                alert("Event not found. Please enter a valid event name.");
                return;
            }


            // Register user
            const registrationResponse = await fetch(
    "http://localhost:3000/api/registrations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                   body: JSON.stringify({
    user_id: user.id,
    event_id: selectedEvent.id
})
                }
            );


            const result = await registrationResponse.json();

console.log("Registration response:", result);
console.log("Status:", registrationResponse.status);


if (registrationResponse.ok) {

    alert("Registration successful!");

    window.location.href = "ticket.html";

} else {

    alert(result.message || "Registration failed");

}


        } catch (error) {

            console.error(error);
            alert("Something went wrong. Please try again.");

        }

    });