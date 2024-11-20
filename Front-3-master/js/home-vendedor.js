// Aca vemos que hacer con lo que trajimos del fetch del logib
var pedidos = JSON.parse(localStorage.getItem("pedidos"));
var vendedor = JSON.parse(localStorage.getItem("vendedor"));
var clientes = JSON.parse(localStorage.getItem("clientes")); // Lista de clientes
var modoOscuroGuardado = localStorage.getItem("modoOscuro"); // Modo
console.log("Que modo trae = ", modoOscuroGuardado);

console.log("Local Storage de Pedidos", pedidos);
console.log(vendedor);
console.log(typeof jsPDF);

actualizarNombreVendedor();
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

// Funcion para actualizar tabla de pedidos
function actualizarTablaPedidos() {
  let pedidos = JSON.parse(localStorage.getItem("pedidos"));
  console.log("Funcion actualizarTablaPedidos", pedidos); // Agrega este console.log para verificar los datos

  let tbody = document.querySelector("#tablaPedidos tbody");
  // Limpiar la tabla actual
  tbody.innerHTML = "";

  if (pedidos && Array.isArray(pedidos)) {
    //PRIMER FILTRO
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
    let filtroCliente = document.getElementById("inputBuscarCliente").value; //cambiar esta

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
    } //ESTA ES LA OTRA

    // Recorre los pedidos y agrega las filas a la tabla
    pedidosFiltrados.forEach(function (pedido, index) {
      // Formatear la fecha en formato de fecha
      let fecha = new Date(pedido.fecha);
      fecha.setDate(fecha.getDate() + 1);

      console.log("fecha antes de formatear", fecha);
      let fechaFormateada = fecha.toLocaleDateString("es-ES", {
        dateStyle: "medium",
      });
      console.log("Fecha formateada:", fechaFormateada);

      // Formatear el estado con espacios
      let estadoFormateado = pedido.estado.replace(/_/g, " ");

      // Crear la fila y agregar las celdas
      let row = document.createElement("tr");
      row.innerHTML = `          
        <td>${pedido.id}</td>
        <td>${fechaFormateada}</td>
        <td>${
          pedido.cliente.nombreFantasia + " -  " + pedido.cliente.razonSocial
        }</td>
        <td>${pedido.cadeteria.nombreCadeteria}</td>
        <td>${estadoFormateado}</td>

        <td>
        <a href="#" onclick="mostrarDetallePedido(${pedido.id})">
        <i class='bx bx-search-alt-2'></i>
            </a>
        </td>

        <td>
        <a href="#" onclick="editarPedido(${pedido.id})">
        <i class='bx bx-edit-alt' ></i>
            </a>
        </td>`;

      row.innerHTML += `<td>
              <a href="#" onclick="generarPDF(${pedido.id})">
              <i class='bx bxs-file-pdf'></i>
              </a>
            </td>`;

      if (pedido.cliente.pdfData != null) {
        row.innerHTML += `<td>
      <a href="#" onclick="abrirPDF(${pedido.cliente.id})">
      <i class='bx bx-download'></i>
          </a>
      </td>`;
      } else {
        row.innerHTML += `<td>-</td>`;
      }
      row.innerHTML += `<td>
        <a href="#" onclick="eliminarPedido(${pedido.id})">
        <i class='bx bx-message-square-x'></i>
            </a>
        </td>`;

      if (pedido.sinStock) {
        row.classList.add("fila-sin-stock");
      } else {
        if (index % 2 != 0) {
          row.classList.add("fila-par");
        }
      }

      tbody.appendChild(row);
    });
  }
}

//MODAL
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
    const tablaArticulos = document.getElementById("tablaArticulos");
    tablaArticulos.innerHTML = "";

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

// Función para cerrar el modal de pedido //////////
function cerrarModal() {
  let modal = document.getElementById("pedidoModal");
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}
document
  .getElementById("btnCerrarModal")
  .addEventListener("click", cerrarModal);

//////////////////////////////////////////////////////

async function eliminarPedido(idPedido) {
  let confirmacion = confirm(
    "¿Estás seguro de que quieres eliminar este elemento?"
  );
  if (confirmacion) {
    // Código para eliminar el elemento
    const request = await fetch(
      `https://urugestionhub.azurewebsites.net/eliminarPedido?pedidoId=${idPedido}&idVendedor=${vendedor.id}`,
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
        actualizarTablaPedidos();
        alert(response.mensaje);
      } else {
        alert(response.mensaje);
      }
    } else {
      alert(request.status);
    }
  } else {
    // Código para cancelar la acción
  }
}

async function editarPedido(idPedido) {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/editarPedido?idPedido=${idPedido}&idVendedor=${vendedor.id}`,
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
      localStorage.setItem("pedidoAEditar", JSON.stringify(response.pedido));
      localStorage.setItem("pedidos", JSON.stringify(response.pedidos));
      window.location.href = "editar-pedido-Vendedor.html";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

function actualizarNombreVendedor() {
  if (vendedor) {
    // Actualizar el contenido del elemento <h1> con el nombre del cliente
    document.getElementById(
      "nombreVendedor"
    ).textContent = `Hola, ${vendedor.nombreCompleto}.`;
  }
}

async function actualizarPedidos() {
  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/actualizar?idVendedor=${vendedor.id}`,
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
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      localStorage.setItem("cadeterias", JSON.stringify(response.cadeterias));
      pedidos = JSON.parse(localStorage.getItem("pedidos"));
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
