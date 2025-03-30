function register(event) {
    event.preventDefault(); // Prevent the default form submission

    // Obtener los valores de los campos de entrada
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirmation = document.getElementById("password_confirmation").value;
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const gender = document.querySelector('input[name="genero"]:checked')?.value || '';

    // Construir la fecha de nacimiento en formato YYYY-MM-DD
    const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Combinar nombre y apellidos
    const fullName = `${name} ${surname}`.trim();

    // Validar que todos los campos requeridos estén completos
    if (!fullName || !email || !password || !passwordConfirmation || !birthdate || !year || !month || !day) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    if (password !== passwordConfirmation) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Realizar la solicitud fetch
    fetch("http://127.0.0.1:8000/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: fullName,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            birthdate: birthdate,
            gender: gender // Opcional, si el backend lo soporta
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
            alert("Registro exitoso!");
            // Redirigir al usuario después del registro exitoso
            window.location.href = "/inicio-de-sesion/Modulo-iniciar-sesion/mensajes/bienvenida.html";
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Error al registrar: " + error.message);
        });
}

// Añadir el event listener al formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("registerForm");
    form.addEventListener('submit', register);
});