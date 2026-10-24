
const API_URL = "http://localhost:8080/courses";


// 1. DISPLAY AVAILABLE COURSES
async function showCourses() {
    const table = document.getElementById("coursetable");
    const message = document.getElementById("message");

    if (!table) return;

    table.innerHTML = "";

    if (message) {
        message.textContent = "Loading courses...";
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        const courses = await response.json();

        if (courses.length === 0) {
            if (message) message.textContent = "No courses available.";
            return;
        }

        courses.forEach(course => {
            const row = document.createElement("tr");

            [
                course.courseId,
                course.courseName,
                course.trainer,
                course.durationInWeeks
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        if (message) message.textContent = "";

    } catch (error) {
        if (message) {
            message.textContent = "Unable to load courses. Check backend and CORS.";
        }

        console.error("Available Courses Error:", error);
    }
}


// 2. DISPLAY ENROLLED STUDENTS
async function showEnrolledStudents() {
    const table = document.getElementById("enrolledtable");
    const message = document.getElementById("message");

    if (!table) return;

    table.innerHTML = "";

    if (message) {
        message.textContent = "Loading enrolled students...";
    }

    try {
        const response = await fetch(API_URL + "/enrolled");

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        const students = await response.json();

        if (students.length === 0) {
            if (message) message.textContent = "No students enrolled yet.";
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            [
                student.name,
                student.emailId,
                student.courseName
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        if (message) message.textContent = "";

    } catch (error) {
        if (message) {
            message.textContent =
                "Unable to load students. Check backend and CORS.";
        }

        console.error("Enrolled Students Error:", error);
    }
}


// 3. REGISTER A STUDENT
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");

    // Run this part only on register.html
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("message");
        const button = form.querySelector('button[type="submit"]');

        // Prevent another submission while the first is processing
        if (button.disabled) return;

        button.disabled = true;
        message.textContent = "Submitting registration...";

        try {
            // Collect name, emailId and courseName from the form
            const formData = new FormData(form);
            const params = new URLSearchParams(formData);

            // Send form data to the Spring Boot controller
            const response = await fetch(API_URL + "/register", {
                method: "POST",

                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },

                body: params.toString()
            });

            // Your controller returns a String
            const result = await response.text();

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status + ": " + result
                );
            }

            // Display the message returned by Spring Boot
            message.textContent = result;

            // Clear the form after successful registration
            form.reset();

        } catch (error) {
            message.textContent =
                "Registration failed: " + error.message;

            console.error("Registration Error:", error);

        } finally {
            // Allow another submission
            button.disabled = false;
        }
    });
});
