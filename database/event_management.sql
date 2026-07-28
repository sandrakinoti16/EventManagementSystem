CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(30) NOT NULL,
    number_of_tickets INT NOT NULL DEFAULT 1,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (registration_id)
        REFERENCES registrations(registration_id)
        ON DELETE CASCADE
);