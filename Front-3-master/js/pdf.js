async function abrirPDF(clienteId) {
  try {
    const response = await fetch(
      `https://urugestionhub.azurewebsites.net/cliente/verPdf?id=${clienteId}`,
      {
        method: "POST", // Agregar el método POST
      }
    );

    const pdfBlob = await response.blob();
    console.log(pdfBlob);
    console.log(pdfBlob.size == 0);
    if (pdfBlob.size == 0) {
      return alert("No tienes un estado de cuenta para descargar");
    }
    const pdfURL = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfURL, "_blank");

    if (!newWindow) {
      alert(
        "La ventana emergente fue bloqueada. Por favor, permita ventanas emergentes para ver el PDF."
      );
    }
  } catch (error) {
    console.error("Error al abrir el PDF:", error);
    alert(
      "Ocurrió un error al abrir el PDF. Consulta la consola para más detalles."
    );
  }
}

function generarPDF(pedidoId) {
  const pedido = buscarPedidoPorId(pedidoId);
  if (pedido) {
    const respuesta = prompt("¿Se retira en agencia? (si/no)").toLowerCase();
    let retiraEnAgencia = "";

    if (respuesta === "si") {
      retiraEnAgencia = "Sí";
    } else if (respuesta === "no") {
      retiraEnAgencia = "No";
    } else {
      alert("Respuesta inválida. Se asumirá 'No' para retiro en agencia.");
      retiraEnAgencia = "No";
    }

    let cliente = pedido.cliente;
    let content = [];
    // Definir la estructura del contenido del PDF
    if (retiraEnAgencia == "Sí") {
      content = [
        { text: "QUIEN ENVIA", style: "header", margin: [0, 0, 0, 10] },
        { text: "TEFELE SRL - Ururacer", style: "subheader" },
        {
          text: "Teléfono: 24094338",
          style: "subheader",
          margin: [0, 0, 0, 40],
        },

        { text: "QUIEN RECIBE", style: "header", margin: [0, 0, 0, 10] },
        {
          text: "Nombre: " + cliente.nombreCompleto,
          style: "subheader",
        },
        {
          text: "Local Comercial: " + cliente.nombreFantasia,
          style: "subheader",
        },

        { text: "EL CLIENTE RETIRA EN AGENCIA", style: "subheader" },
      ];
    } else {
      content = [
        { text: "QUIEN ENVIA", style: "header", margin: [0, 0, 0, 10] },
        { text: "TEFELE SRL - Ururacer", style: "subheader" },
        {
          text: "Teléfono: 24094338",
          style: "subheader",
          margin: [0, 0, 0, 40],
        },

        { text: "QUIEN RECIBE", style: "header", margin: [0, 0, 0, 10] },
        {
          text: "Nombre: " + cliente.nombreCompleto,
          style: "subheader",
        },
        {
          text: "Local Comercial: " + cliente.nombreFantasia,
          style: "subheader",
        },
        {
          text: "Direccion De Entrega: " + cliente.direccionDeEntrega,
          style: "subheader",
        },
      ];
    }

    const styles = {
      header: { fontSize: 34, bold: true },
      subheader: { fontSize: 28, bold: true },
      normalText: { fontSize: 18 },
    };

    // Configurar el documento PDF
    const docDefinition = {
      content: content,
      styles: styles, // Aquí se incluyen los estilos
    };

    // Generar el PDF utilizando pdfmake
    pdfMake.createPdf(docDefinition).download("detalle_pedido.pdf");
  }
}
// Función para buscar un pedido por su ID
function buscarPedidoPorId(id) {
  return pedidos.find((pedido) => pedido.id === id);
}

async function cargarPDF(cliente, pdf) {
  let pdfFile = pdf;
  let pdfByteArray = pdfFile ? await readFileAsByteArray(pdfFile) : null;
  cliente.pdfData = pdfByteArray;

  const request = await fetch(
    `https://urugestionhub.azurewebsites.net/cliente/registroCliente`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    }
  );

  const response = await request.json();
  if (request.ok) {
    if (response.cliente) {
      localStorage.setItem("clientes", JSON.stringify(response.clientes));
      alert(response.mensaje);
      localStorage.removeItem("clienteEditar");
      //window.location.href = "javascript:window.history.back()";
    } else {
      alert(response.mensaje);
    }
  } else {
    alert(request.status);
  }
}

// Función para convertir un archivo a un arreglo de bytes
async function readFileAsByteArray(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const byteArray = new Uint8Array(arrayBuffer);
      resolve(Array.from(byteArray));
    };
    reader.onerror = (event) => {
      reject(event.error);
    };
    reader.readAsArrayBuffer(file);
  });
}
