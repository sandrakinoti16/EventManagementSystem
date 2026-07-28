document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const registration = {
            ticketNumber: "EMS-" + Math.floor(100000 + Math.random() * 900000),
            eventName: document.getElementById("eventName").value,
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            studentId: document.getElementById("studentId").value.trim(),
            tickets: document.getElementById("tickets").value,
            registrationDate: new Date().toLocaleDateString()
        };

        if (
            registration.fullName === "" ||
            registration.email === "" ||
            registration.phone === "" ||
            registration.studentId === ""
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        localStorage.setItem(
            "eventRegistration",
            JSON.stringify(registration)
        );

        window.location.href = "ticket.html";

    });

});