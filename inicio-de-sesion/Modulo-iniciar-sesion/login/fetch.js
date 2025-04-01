function login(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("message");

    // Clear previous messages
    messageDiv.textContent = "";

    // Validate inputs
    if (!email || !password) {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Por favor, completa todos los campos.";
        return;
    }

    // Show loading state
    messageDiv.textContent = "Iniciando sesión...";

    fetch("http://127.0.0.1:8000/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || "Error en la solicitud: " + response.statusText);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("Respuesta del servidor:", data);
            if (data.token) {
                // Store token as "authToken"
                localStorage.setItem("authToken", data.token);
                messageDiv.style.color = "green";
                messageDiv.textContent = "Inicio de sesión exitoso. Redirigiendo...";
                // Redirect after a short delay for user feedback
                setTimeout(() => {
                    window.location.href = "/musicoterapia/Vistas1.1/PLAYLIST/playList.html"; // Adjusted to match your app flow
                }, 1000);
            } else {
                throw new Error("No se recibió un token de autenticación");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            messageDiv.style.color = "red";
            messageDiv.textContent = error.message || "Error al iniciar sesión. Verifica tus credenciales.";
        });
}

// Add event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener('submit', login);
    } else {
        console.error("Formulario con ID 'loginForm' no encontrado.");
    }
});