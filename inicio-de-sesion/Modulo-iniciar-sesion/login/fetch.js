function login(event) {
    event.preventDefault(); // Prevent the default form submission

    // Obtener los valores de los campos de entrada
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Realizar la solicitud fetch
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
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Respuesta del servidor:", data);
            // Asumiendo que el backend devuelve un token en data.token
            if (data.token) {
                // Guardar el token en localStorage
                localStorage.setItem("authToken", data.token);
                alert("Inicio de sesión exitoso!");
                // Redirigir al usuario después del login exitoso
                window.location.href = "/inicio-de-sesion/Modulo-iniciar-sesion/home/home.html";
            } else {
                throw new Error("No se recibió un token de autenticación");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Error al iniciar sesión: " + error.message);
        });
}

// Añadir el event listener al formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    form.addEventListener('submit', login);
});