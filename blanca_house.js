// -----------------------------------------------
//  RESERVAS
// -----------------------------------------------

let reservas = [];
let idReserva = 0;

// FUNCION AGREGAR
function agregarReserva() {
  let nombreHTML = document.getElementById("nombre").value;
  let personasHTML = document.getElementById("personas").value;
  let fechaHTML = document.getElementById("fecha").value;
  let horaHTML = document.getElementById("hora").value;
  let mailHTML = document.getElementById("mail").value;

  let objeto = {
    id: idReserva,
    nombre: nombreHTML,
    personas: personasHTML,
    fecha: fechaHTML,
    hora: horaHTML,
    mail: mailHTML
  };

  idReserva += 1;
  reservas.push(objeto);
  // Mostrar solo mensaje de éxito
let resultados = document.getElementById("listaReservas");
if (resultados) {
  resultados.innerHTML = `<p class="mensaje-exito"> Reserva exitosa. ¡Gracias ${nombreHTML}!</p>`;
}
//vacio para hacer una nueva reserva 
  limpiarCamposReserva();

//mando mail
  emailjs.send("service_48a6fof", "template_0vswfoj", {
    nombre: nombreHTML,
    id : idReserva,
    mail: mailHTML,
    personas: personasHTML,
    fecha: fechaHTML,
    hora: horaHTML
  });
  
}

let botonAgregar = document.getElementById("agregar");
if (botonAgregar) {
  botonAgregar.addEventListener("click", agregarReserva);
}

// FUNCION EDITAR
function editarReserva() {
  let id2 = document.getElementById("idEditar").value;

  for (let i = 0; i < reservas.length; i++) {
    if (id2 == reservas[i].id) {
      reservas[i].nombre = document.getElementById("nombre2").value;
      reservas[i].personas = document.getElementById("personas2").value;
      reservas[i].fecha = document.getElementById("fecha2").value;
      reservas[i].hora = document.getElementById("hora2").value;
    }
  }

  mostrarReservas(reservas);
  console.log(reservas);
}

let botonEditar = document.getElementById("editar");
if (botonEditar) {
  botonEditar.addEventListener("click", editarReserva);
}

// FUNCION ELIMINAR
function eliminarReserva() {
  let idEliminar = document.getElementById("idEliminar").value;

  for (let i = 0; i < reservas.length; i++) {
    if (idEliminar == reservas[i].id) {
      reservas.splice(i, 1);
    }
  }

  mostrarReservas(reservas);
  console.log(reservas);
}

let botonEliminar = document.getElementById("eliminar");
if (botonEliminar) {
  botonEliminar.addEventListener("click", eliminarReserva);
}


// FUNCION CONSULTAR RESERVAS POR MAIL
function leerReservas() {
    let mailConsulta = document.getElementById("mailConsulta").value.trim(); //trim elimina espacios adel y atr
    let resultado = document.getElementById("resultadoConsulta");
    resultado.innerHTML = "";
  
    if (mailConsulta === "") {
      resultado.innerHTML = "<p>Por favor ingresá tu correo.</p>";
      return;
    }
  
    let encontradas = reservas.filter(r => r.mail === mailConsulta);
  
    if (encontradas.length === 0) {
      resultado.innerHTML = "<p>No tenés reservas activas o el mail no coincide.</p>";
    } else {
      resultado.innerHTML = "<h4>Reservas activas:</h4>";
      for (const r of encontradas) {
        resultado.innerHTML += `
          <div class="reserva">
            <p><strong>ID:</strong> ${r.id}</p>
            <p><strong>Fecha:</strong> ${r.fecha}</p>
            <p><strong>Hora:</strong> ${r.hora}</p>
            <p><strong>Personas:</strong> ${r.personas}</p>
          </div>`;
      }
    }
  }
  
  let botonConsultar = document.getElementById("consultar");
  if (botonConsultar) {
    botonConsultar.addEventListener("click", leerReservas);
  }
  

// FUNCION LIMPIAR CAMPOS
function limpiarCamposReserva() {
  document.getElementById("nombre").value = "";
  document.getElementById("personas").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("mail").value = "";
}


// -----------------------------------------------
//  RESEÑAS
// -----------------------------------------------

let reseñas = [];
let idReseña = 0;

// ---- AGREGAR una reseña
function agregarReseña() {
  let nombreHTML = document.getElementById("nombreReseña").value;
  let correoHTML = document.getElementById("correoReseña").value;
  let textoHTML = document.getElementById("textoReseña").value;

  if (nombreHTML == "" || correoHTML == "" || textoHTML == "") {
    alert("Por favor completá todos los campos.");
    return;
  }

  let objeto = {
    id: idReseña,
    nombre: nombreHTML,
    correo: correoHTML,
    texto: textoHTML
  };

  idReseña += 1;
  reseñas.push(objeto);
  localStorage.setItem("reseñas", JSON.stringify(reseñas)); // --> Guardar en localStorage
  mostrarReseñas(reseñas);
  limpiarCamposReseña();

  
  emailjs.send("service_48a6fof", "template_yvegw5j", {
   nombre: nombreHTML,
   correo: correoHTML,
   texto: textoHTML
   });
}

let botonEnviarReseña = document.getElementById("enviarReseña");
if (botonEnviarReseña) {
  botonEnviarReseña.addEventListener("click", agregarReseña);
}

// ---- MOSTRAR todas las reseñas
function mostrarReseñas(lista) {
  let contenedor = document.getElementById("listaReseñas");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  for (const r of lista) {
    contenedor.innerHTML += `<div class="reseña">
      <h3>${r.nombre}</h3>
      <p>"${r.texto}"</p>
    </div>`;
  }
}

// ---- LIMPIAR CAMPOS
function limpiarCamposReseña() {
  document.getElementById("nombreReseña").value = "";
  document.getElementById("correoReseña").value = "";
  document.getElementById("textoReseña").value = "";
}


// CARGAR RESEÑAS GUARDADAS AL INICIO
window.addEventListener("load", () => {
    let reseñasGuardadas = localStorage.getItem("reseñas");
    if (reseñasGuardadas) {
      reseñas = JSON.parse(reseñasGuardadas);
      idReseña = reseñas.length;
      mostrarReseñas(reseñas);
    }
  });
  