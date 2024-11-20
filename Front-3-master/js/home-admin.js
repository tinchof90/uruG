var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var clientes = JSON.parse(localStorage.getItem("clientes"));
var cadeterias = JSON.parse(localStorage.getItem("cadeterias"));
let admin = JSON.parse(localStorage.getItem("admin"));
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo
localStorage.removeItem("cadeteriaEditar");
localStorage.removeItem("clienteEditar");
console.log(pedidos);
console.log("Prueba de Clientes", clientes);
console.log("Prueba de Cadeterias", cadeterias);

actualizarNombreAdmin();
actualizarTablaPedidos();
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

function actualizarTablaPedidos() {
  let tbody = document.querySelector("#tablaPedidos tbody");
  console.log("Prueba de Clientes", clientes);
  console.log("Prueba de Cadeterias", cadeterias);
  // Limpiar la tabla actual
  tbody.innerHTML = "";
  if (pedidos && Array.isArray(pedidos)) {
    let filtro = document.getElementById("estado").value;
    let pedidosFiltrados = pedidos;

    if (filtro == "Facturados") {
      pedidosFiltrados = pedidos.filter(
        (p) =>
          p.estado == "FACTURADO" ||
          p.estado == "ENTREGADO" ||
          p.estado == "LISTO"
      );
    } else if (filtro == "Pendientes") {
      pedidosFiltrados = pedidos.filter((p) => p.estado == "FACTURACION");
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
          <td>${fechaFormateada}</td>
          <td>${estadoFormateado}</td>
          <td>${pedido.vendedor.nombreCompleto}</td>
          <td>${
            pedido.cliente.nombreFantasia + " -  " + pedido.cliente.razonSocial
          }</td>
          <td>${pedido.cadeteria.nombreCadeteria}</td>
          <td>${pedido.marcadoEntregadoPorCLiente ? "SI" : "NO"}</td>  

          <td>
        <a href="#" onclick="mostrarDetallePedido(${pedido.id})">
        <i class='bx bx-search-alt-2'></i>
            </a>
        </td>`;
      if (pedido.estado == "FACTURACION") {
        row.innerHTML += `
        <td>
        <a href="#" onclick="pedidoFacturado(${pedido.id})">
        <i class='bx bx-spreadsheet'></i>
            </a>
        </td>`;
      } else {
        row.innerHTML += `
        <td>-</td>`;
      }
      // if (pedido.pdfData != null) {
      row.innerHTML += `<td>
              <a href="#" onclick="generarPDF(${pedido.id})">
              <i class='bx bxs-file-pdf'></i>
              </a>
            </td>`;
      //     } else {
      //       row.innerHTML += `<td>
      // -
      //         </td>`;
      //     }

      if (index % 2 != 0) {
        row.classList.add("fila-par");
      }
      tbody.appendChild(row);
    });
  }
}

// Función para mostrar los detalles del pedido en el modal
function mostrarDetallePedido(idPedido) {
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
    const tablaArticulos = document.getElementById("tablaArticulos");
    tablaArticulos.innerHTML = "";

    // pedido.articulos.forEach((articulo) => {
    //   if (articulo.eliminado == false) {
    //     const fila = document.createElement("tr");
    //     fila.innerHTML = `
    //     <td>${articulo.nombre}</td>
    //     <td>${articulo.cantidad}</td>
    //   `;
    //     tablaArticulos.appendChild(fila);
    //   }
    // });
    pedido.articulos.forEach((articulo) => {
      if (articulo.eliminado == false) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${articulo.nombre}</td>
        <td>${articulo.cantidad}</td>
      `;
        if (!articulo.stock) {
          fila.classList.add("fila-sin-stock");
        }
        tablaArticulos.appendChild(fila);
      }
    });

    // Mostrar el modal
    let modal = document.getElementById("pedidoModal");
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  } else {
    // Si no se encuentra el pedido, mostrar un mensaje de error
    alert("El pedido no existe.");
  }
}

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

async function pedidoFacturado(idPedido) {
  const request = await fetch(
    //HAY QUE AGREGAR EL ADMINISTRATIVO EN EL FETCH (EL ID)
    `https://urugestionhub.azurewebsites.net/admin/pedidoFacturado?pedidoId=${idPedido}&admin=${admin.id}`,
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

function actualizarNombreAdmin() {
  if (admin) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreAdmin"
    ).textContent = `Hola, ${admin.nombreCompleto}.`;
  }
}

async function actualizarPedidos() {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/admin/actualizar`,
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
