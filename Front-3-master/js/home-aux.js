// Aca vemos que hacer con lo que trajimos del fetch del logib

var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var clientes = JSON.parse(localStorage.getItem("clientes"));
var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
console.log("pedido", pedidos);
console.log("Prueba de Clientes", clientes);
console.log("Prueba de Cadeterias", cadeterias);
var auxDep = JSON.parse(localStorage.getItem("auxDep"));
console.log(auxDep);

actualizarNombreAux();
actualizarTablaPedidos();

function actualizarNombreAux() {
  if (auxDep) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreAux"
    ).textContent = `Hola, ${auxDep.nombreCompleto}.`;
  }
}

// Funcion para actualizar tabla de pedidos
function actualizarTablaPedidos() {
  console.log("Prueba de Clientes", clientes);
  console.log("Prueba de Cadeterias", cadeterias);
  // let pedidos = JSON.parse(localStorage.getItem("pedidos"));

  let tbody = document.querySelector("#tablaPedidos tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";

  if (pedidos && Array.isArray(pedidos)) {
    let filtro = document.getElementById("estado").value;
    let pedidosFiltrados = pedidos;

    if (filtro == "Ingresado") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "INGRESADO");
    } else if (filtro === "Preparacion") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "PREPARACION");
    } else if (filtro === "ParaFacturar") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "FACTURACION");
    } else if (filtro === "Facturado") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "FACTURADO");
    } else if (filtro === "Listo") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "LISTO");
    } else if (filtro === "Entregado") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "ENTREGADO");
    }

    //EN AMBOS CASOS: 1 usar la variable anterior para aplicar el filter

    //SEGUNDO FILTRO
    let filtroFechaDesde = document.getElementById("filtroFechaDesde").value;
    let filtroFechaHasta = document.getElementById("filtroFechaHasta").value;
    let filtroCliente = document.getElementById("inputBuscarCliente").value;
    console.log("filtrofechaDESDE", filtroFechaDesde);
    console.log("filtroFechaHASTA", filtroFechaHasta);
    console.log("filtroCLIENTE", filtroCliente);
    if (filtroFechaDesde != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.fecha >= filtroFechaDesde
      );
    }

    if (filtroFechaHasta != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.fecha <= filtroFechaHasta
      );
    }

    if (filtroCliente != "") {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) =>
          p.cliente.nombreFantasia + " - " + p.cliente.razonSocial ==
          filtroCliente
      );
    }

    // Recorre los pedidos y agrega las filas a la tabla
    pedidosFiltrados.forEach(function (pedido, index) {
      // Formatear la fecha en formato de fecha
      let fecha = new Date(pedido.fecha);
      let fechaFormateada = fecha.toLocaleDateString("es-ES", {
        dateStyle: "medium",
      });

      // Formatear el estado con espacios
      let estadoFormateado = pedido.estado.replace(/_/g, " ");

      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = `          
        <td>${pedido.id}</td>
        <td>${estadoFormateado}</td>
        <td>${
          pedido.cliente.nombreFantasia + " -  " + pedido.cliente.razonSocial
        }</td>
        <td>${pedido.cadeteria.nombreCadeteria}</td>
        <td>${pedido.vendedor.nombreCompleto}</td>
        <td>${fechaFormateada}</td>

        <td>
        <a href="#" onclick="mostrarDetallePedido(${pedido.id})">
        <i class='bx bx-search-alt-2'></i>
            </a>
        </td>`;
      row.innerHTML += `<td>
        <a href="#" onclick="generarPDF(${pedido.id})">
        <i class='bx bxs-file-pdf'></i>
        </a>
      </td>`;
      if (pedido.estado == "INGRESADO") {
        row.innerHTML += `
        <td>
        <a href="#" onclick="iniciarArmado(${pedido.id})">
        <i class='bx bx-caret-right-circle'></i>
            </a>
        </td>
        <td>
        -
                </td>`;
      } else if (pedido.estado == "PREPARACION") {
        row.innerHTML += `
        <td>
        <a href="#" onclick="iniciarArmado(${pedido.id})">
        <i class='bx bx-rotate-right'></i>
            </a>
        </td>
        <td>
-
        </td>`;
      } else if (pedido.estado == "FACTURADO") {
        row.innerHTML += `
        <td>
        <a href="#" onclick="pedidoListo(${pedido.id})">
        <i class='bx bx-check-double'></i>
            </a>
        </td>
        <td>
        -
                </td>`;
      } else if (pedido.estado == "LISTO") {
        row.innerHTML += `
        <td>
          <a href="#" onclick="pedidoEntregado(${pedido.id})">
            <i class='bx bxs-truck option'></i>
          </a>
        </td>
        <td>
          <a href="#" onclick="enviarWP(${pedido.id})">
            <i class="bx bxl-whatsapp"></i>
          </a>
        </td>`;
      } else if (pedido.estado == "ENTREGADO") {
        row.innerHTML += `
              <td>
                <a href="#" onclick="modalNumeroEntrega(${pedido.id})"> 
                <i class='bx bx-task'></i>
                </a>
                </td>
                <td>
                <a href="#" onclick="modalNumeroRastreo(${pedido.id})"> 
                <i class='bx bxs-navigation'></i>
                </a>
              </td>`;
      } else {
        row.innerHTML += `
        <td>
-
        </td>
        <td>
-
        </td>`;
      }
      if (index % 2 != 0) {
        row.classList.add("fila-par");
      }
      tbody.appendChild(row);
    });
  }
}

///////////// MODAL VER MAS  //////////////////////////

// Función para mostrar los detalles del pedido en el modal
function mostrarDetallePedido(idPedido) {
  // Buscar el pedido por su ID en el arreglo de pedidos
  var pedido = pedidos.find((p) => p.id === idPedido);
  if (pedido) {
    // Actualizar el contenido del modal con los detalles del pedido
    document.getElementById("detalleIdPedido").innerHTML = pedido.id;
    document.getElementById("detalleEstadoPedido").innerHTML =
      pedido.estado.replace(/_/g, " ");
    document.getElementById("detalleClientePedido").innerHTML =
      pedido.cliente.nombreFantasia + " - " + pedido.cliente.razonSocial;
    document.getElementById("detalleCadeteriaPedido").innerHTML =
      pedido.cadeteria.nombreCadeteria;
    document.getElementById("observacionesPedido").innerHTML =
      pedido.observaciones;
    document.getElementById("detalleFechaPedido").innerHTML = pedido.fecha;
    document.getElementById("valoracion").innerHTML = pedido.valoracion;
    document.getElementById("numeroEntrega").innerHTML = pedido.numeroEntrega;
    document.getElementById("numeroRastreo").innerHTML = pedido.numeroRastreo;
    pedido.marcadoEntregadoPorCLiente
      ? (document.getElementById("detalleRecibido").innerHTML = "SI")
      : (document.getElementById("detalleRecibido").innerHTML = "NO");

    // Llenar la tabla con los artículos del pedido
    // Llenar la tabla con los artículos del pedido
    const tablaArticulos = document.getElementById("tablaArticulos");
    tablaArticulos.innerHTML = "";

    pedido.articulos.forEach((articulo, index) => {
      const fila = document.createElement("tr");
      fila.className = articulo.eliminado
        ? "fila-eliminada"
        : articulo.agregado
        ? "fila-agregada"
        : "";
      fila.innerHTML = `
    <td>${index + 1}</td>
    <td>${articulo.nombre}</td>
    <td>${articulo.cantidad}</td>
  `;
      tablaArticulos.appendChild(fila);
    });

    // Mostrar el modal utilizando las clases de Bootstrap
    let modal = document.getElementById("pedidoModal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  } else {
    // Si no se encuentra el pedido, mostrar un mensaje de error
    alert("El pedido no existe.");
  }
}

//MODAL

// Función para cerrar el modal

function cerrarModal() {
  let modal = document.getElementById("pedidoModal");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}
document
  .getElementById("btnCerrarModal")
  .addEventListener("click", cerrarModal);

async function iniciarArmado(idPedido) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/iniciarArmado?pedidoId=${idPedido}`,
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
    if (response.pedido) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("pedidoParaArmar", JSON.stringify(response.pedido));
      window.location.href = "armar-pedido.html";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

async function pedidoListo(idPedido) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/pedidoListo?pedidoId=${idPedido}`,
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
      localStorage.setItem("pedidoParaArmar", JSON.stringify(response.pedido));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      actualizarTablaPedidos();
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

async function pedidoEntregado(idPedido) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/pedidoEntregado?pedidoId=${idPedido}`,
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
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      actualizarTablaPedidos();
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

async function enviarWP(idPedido) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/enviarWP?pedidoId=${idPedido}`,
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
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      actualizarTablaPedidos();
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

async function actualizarPedidos() {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/actualizar`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const response = await request.json();

  if (request.ok) {
    if (response.pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      clientes = JSON.parse(localStorage.getItem("clientes"));
      cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
      alert("La tabla se ha actualizado con exito");
      actualizarTablaPedidos();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function modalNumeroEntrega(idPedido) {
  let pedido = pedidos.find((p) => p.id === idPedido);

  if (pedido) {
    // Mostrar el modal
    let modalNumeroEntrega = document.getElementById("modalNumeroEntrega");
    modalNumeroEntrega.classList.add("show");
    modalNumeroEntrega.style.display = "block";
    document.getElementById("numeroDeEntrega").value = pedido.numeroEntrega;

    const btnNumeroEntrega = document.getElementById("btnNumeroEntrega");

    // Define la función de manejo de clic por separado
    function clickHandler() {
      let numeroDeEntrega = document.getElementById("numeroDeEntrega").value;
      if (numeroDeEntrega != "") {
        agregarNumeroEntrega(pedido, numeroDeEntrega);
        modalNumeroEntrega.style.display = "none";

        // Remueve el event listener después de ejecutarlo una vez
        btnNumeroEntrega.removeEventListener("click", clickHandler);
      } else {
        alert("El ticket con el número de Entrega no puede estar vacío");
      }
    }

    // Agregar el event listener al botón
    btnNumeroEntrega.addEventListener("click", clickHandler);

    // Agregar evento al botón de cerrar
    const cerrarModal = document.getElementById("cerrarModal");
    cerrarModal.addEventListener("click", function () {
      modalNumeroEntrega.style.display = "none";
    });
  } else {
    alert("Pedido No Encontrado");
  }
}

async function agregarNumeroEntrega(pedido, numeroDeEntrega) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/numeroEntrega?idPedido=${pedido.id}&numeroEntrega=${numeroDeEntrega}`,
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
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      actualizarTablaPedidos();
      alert(response.mensaje);
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function modalNumeroRastreo(idPedido) {
  let pedido = pedidos.find((p) => p.id === idPedido);

  if (pedido) {
    // Mostrar el modal
    let modalNumeroRastreo = document.getElementById("modalNumeroRastreo");
    modalNumeroRastreo.classList.add("show");
    modalNumeroRastreo.style.display = "block";
    document.getElementById("numeroDeRastreo").value = pedido.numeroRastreo;

    const btnNumeroRastreo = document.getElementById("btnNumeroDeRastreo");

    // Define la función de manejo de clic por separado
    function clickHandler() {
      let numeroDeRastreo = document.getElementById("numeroDeRastreo").value;
      if (numeroDeRastreo != "") {
        agregarNumeroRastreo(pedido, numeroDeRastreo);
        modalNumeroRastreo.style.display = "none";

        // Remueve el event listener después de ejecutarlo una vez
        btnNumeroRastreo.removeEventListener("click", clickHandler);
      } else {
        alert("El ticket con el número de Rastreo no puede estar vacío");
      }
    }

    // Agregar el event listener al botón
    btnNumeroRastreo.addEventListener("click", clickHandler);

    // Agregar evento al botón de cerrar
    const cerrarModal = document.getElementById("cerrarModalRastreo");
    cerrarModal.addEventListener("click", function () {
      modalNumeroRastreo.style.display = "none";
    });
  } else {
    alert("Pedido No Encontrado");
  }
}

async function agregarNumeroRastreo(pedido, numeroRastreo) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/auxdepo/numeroRastreo?idPedido=${pedido.id}&numeroRastreo=${numeroRastreo}`,
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
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
      alert(response.mensaje);
      actualizarTablaPedidos();
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

//COPIAR TODO ESTO
function buscarClientes() {
  const textoBusqueda = inputBuscarCliente.value.trim().toLowerCase();
  const clientesCoincidentes = clientes.filter(
    (cliente) =>
      cliente.nombreFantasia.toLowerCase().includes(textoBusqueda) ||
      cliente.razonSocial.toLowerCase().includes(textoBusqueda)
  );

  if (clientesCoincidentes.length === 1) {
    console.log("un solo cliente coincide", clientesCoincidentes);
    inputBuscarCliente.value =
      clientesCoincidentes[0].nombreFantasia +
      " - " +
      clientesCoincidentes[0].razonSocial;
  } else if (clientesCoincidentes.length > 1) {
    // Mostrar el modal con los clientes coincidentes
    console.log("varios coinciden", clientesCoincidentes);
    mostrarModalSeleccionCliente(clientesCoincidentes);
  }
}

// Función para mostrar el modal con los clientes coincidentes
function mostrarModalSeleccionCliente(clientesCoincidentes) {
  const listaClientesElement = document.getElementById("clientes");
  listaClientesElement.innerHTML = "";

  clientesCoincidentes.forEach((cliente) => {
    const li = document.createElement("li");
    li.textContent = `${cliente.nombreFantasia} - ${cliente.razonSocial}`;
    li.onclick = function () {
      inputBuscarCliente.value =
        cliente.nombreFantasia + " - " + cliente.razonSocial;
      cerrarModalSeleccionCliente();
    };
    listaClientesElement.appendChild(li);
  });

  modalSeleccionCliente.style.display = "block";
}

// Función para cerrar el modal de selección de cliente
function cerrarModalSeleccionCliente() {
  modalSeleccionCliente.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function (event) {
  if (event.target == modalSeleccionCliente) {
    cerrarModalSeleccionCliente();
  }
};
