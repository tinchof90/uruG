var usuario = JSON.parse(localStorage.getItem("usuario")) ?? {};
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo

cargarModoActual();

// Modo oscuro
function cargarModoActual() {
  if (modoOscuroGuardado === "true") {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.add("dark");
  } else {
    console.log("Estoy en modo = ", modoOscuroGuardado);
    body.classList.remove("dark");
  }
}

async function cambiarPassword() {
  let passViejo = document.getElementById("passwordViejo").value;
  let passNuevo = document.getElementById("passwordNuevo").value;
  let passNuevoRepetir = document.getElementById("passwordNuevoConfirm").value;

  console.log(passViejo);
  console.log(passNuevoRepetir);
  console.log(passNuevo);

  if (passNuevo == passViejo) {
    return alert("La nueva contraseña tiene que ser distinta de la actual");
  }

  if (passNuevo != "" && passViejo != "" && passNuevo == passNuevoRepetir) {
    console.log(usuario);
    const request = await fetch(
      `https://urugestionhub.azurewebsites.net/login/modificarPass?id=${usuario.id}&passwordviejo=${passViejo}&passwordnuevo=${passNuevo}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const response = await request.json();

    if (request.ok) {
      if (response.pedidos) {
        alert(response.mensaje);
        window.location.href = "javascript:window.history.back()";
      } else {
        alert(response.mensaje);
      }
    } else {
      alert(request.status);
    }
  } else {
    alert(
      "Nigun campo puede estar vacio, y La constraseña nueva y la confirmacion deben coincidir"
    );
  }
}

// const togglePasswordIcons = document.querySelectorAll(".toggle-password");
// togglePasswordIcons.forEach((icon) => {
//   icon.addEventListener("click", () => {
//     //const passwordInput = icon.previousElementSibling;
//     const passwordInput = icon.previousElementSibling;

//     if (passwordInput.type === "password") {
//       passwordInput.type = "text";
//       icon.classList.remove("bx-hide");
//       icon.classList.add("bx-show");
//     } else {
//       passwordInput.type = "password";
//       icon.classList.remove("bx-show");
//       icon.classList.add("bx-hide");
//     }
//   });
// });

const togglePasswordIcons = document.querySelectorAll(".toggle-password");

togglePasswordIcons.forEach((icon) => {
  const passwordInput = icon.previousElementSibling;

  // Agrega un evento de escucha al evento 'input' en el campo de contraseña
  passwordInput.addEventListener("input", () => {
    // Verifica si el campo de contraseña contiene caracteres
    if (passwordInput.value.trim() !== "") {
      icon.style.display = "inline-block"; // Muestra el icono
    } else {
      icon.style.display = "none"; // Oculta el icono
    }
  });

  icon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("bx-hide");
      icon.classList.add("bx-show");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("bx-show");
      icon.classList.add("bx-hide");
    }
  });
});
