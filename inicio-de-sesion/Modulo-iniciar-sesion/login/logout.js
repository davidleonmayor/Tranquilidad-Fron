function logout() {
    fetch("http://127.0.0.1:8000/v1/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem("authToken");
                alert("Sesión cerrada exitosamente");
                window.location.href = "/inicio-de-sesion/Modulo-iniciar-sesion/login/login.html";
            } else {
                throw new Error("Error al cerrar sesión");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error al cerrar sesión: " + error.message);
        });
}