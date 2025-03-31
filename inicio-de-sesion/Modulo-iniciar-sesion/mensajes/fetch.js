function forgotPassword(event) {
    event.preventDefault(); // Prevent the default form submission

    // Obtener el valor del campo de entrada
    const email = document.getElementById("email").value;

    // Validar que el campo no esté vacío
    if (!email) {
        alert("Por favor, ingresa tu correo electrónico.");
        return;
    }

    // Realizar la solicitud fetch
    fetch("http://127.0.0.1:8000/v1/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || "Error en la solicitud: " + response.statusText);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("Respuesta del servidor:", data);
            alert("Se ha enviado un enlace de restablecimiento a tu correo electrónico.");
            // Redirigir al usuario a la página de recuperación (o a donde desees)
            window.location.href = "/inicio-de-sesion/Modulo-iniciar-sesion/mensajes/recuperarContraseña.html";
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Error al enviar el enlace de restablecimiento: " + error.message);
        });
}

// Añadir el event listener al formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("forgotPasswordForm");
    if (form) {
        form.addEventListener('submit', forgotPassword);
    }
});