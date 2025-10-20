// -----------------------------------------------
//  RESERVAS
// -----------------------------------------------

//-----------------------------------------------------------------------------------------------
// funcion para AGREGAR reservas 
let reservas = [];
let idReserva = 0;

function agregarReserva() {
  let nombreHTML = document.getElementById("nombre").value;
  let personasHTML = document.getElementById("personas").value;
  let fechaHTML = document.getElementById("fecha").value;
  let horaHTML = document.getElementById("hora").value;
  let mailHTML = document.getElementById("mail").value;

  if (!nombreHTML || !personasHTML || !fechaHTML || !horaHTML || !mailHTML) {
    alert("Por favor completá todos los campos antes de reservar.");
    return;
  }
    // chequear disponibilidad antes de confirmar reserva
    let reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
    let totalComensales = 0;
  
    for (let i = 0; i < reservasGuardadas.length; i++) {
      if (reservasGuardadas[i].fecha === fechaHTML && reservasGuardadas[i].hora === horaHTML) {
        totalComensales += parseInt(reservasGuardadas[i].personas);
      }
    }
    if (totalComensales + parseInt(personasHTML) > maxComensales) {
      alert("Ese turno ya alcanzó el máximo de 20 comensales. Elegí otro horario.");
      return;
    }
  
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
  localStorage.setItem("reservas", JSON.stringify(reservas));
  console.log(reservas);


let resultados = document.getElementById("listaReservas");
if (resultados) {
  resultados.innerHTML = `<p class="mensaje-exito"> Reserva exitosa. Recibira un Email de comfirmacion! ${nombreHTML}!</p>`;
}  // Mostrar mensaje de reserva exitosa

//vacio placeholders para hacer una nueva reserva 
limpiarCamposReserva();
actualizarDisponibilidad();

//mando mail de confirmacion 
emailjs.send("service_48a6fof", "template_0vswfoj", {
    nombre: nombreHTML,
    id : objeto.id,
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


//-----------------------------------------------------------------------------------------------
// funcion para EDITAR una reserva 
function editarReserva() {
  let id2 = parseInt(document.getElementById("idEditar").value.trim());
  let nombre2 = document.getElementById("nombre2").value.trim();
  let personas2 = document.getElementById("personas2").value.trim();
  let fecha2 = document.getElementById("fecha2").value.trim();
  let hora2 = document.getElementById("hora2").value.trim();

  if (!id2 || !nombre2 || !personas2 || !fecha2 || !hora2) {
    alert("Por favor completá todos los campos para editar la reserva.");
    return;
  }

  for (let i = 0; i < reservas.length; i++) {
    if (id2 == reservas[i].id) {

    // Chequear disponibilidad antes de editar
    let reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
    let totalComensales = 0;

    for (let k = 0; k < reservasGuardadas.length; k++) {
      let r = reservasGuardadas[k];

      // Excluyo la reserva que estoy editando
      if (r.id != reservas[i].id && r.fecha === fecha2 && r.hora === hora2) {
        totalComensales += parseInt(r.personas);
      }
    }

    if (totalComensales + parseInt(personas2) > maxComensales) {
      alert("Con esos cambios se supera el máximo de 20 comensales para ese turno.");
      return;
    }

      reservas[i].nombre = nombre2;
      reservas[i].personas = personas2;
      reservas[i].fecha = fecha2;
      reservas[i].hora = hora2;
      
      guardarReservasLocal(); 
      // guardo después de editar

      emailjs.send("service_48a6fof", "template_0vswfoj", {
        nombre: reservas[i].nombre,
        mail: reservas[i].mail,
        personas: reservas[i].personas,
        fecha: reservas[i].fecha,
        hora: reservas[i].hora,
        id: reservas[i].id
      });
    }
  }
  guardarReservasLocal(); 
  actualizarDisponibilidad(); 
  // actualizar lugares disponibles

}

let botonEditar = document.getElementById("editar");
if (botonEditar) {
  botonEditar.addEventListener("click", editarReserva);
}



//-----------------------------------------------------------------------------------------------
// funcion para ELIMINAR una reserva
function eliminarReserva() {
  let idEliminar = parseInt(document.getElementById("idEliminar").value);

  for (let i = 0; i < reservas.length; i++) {
    if (idEliminar == reservas[i].id) {
      reservas.splice(i, 1);
    }
  }
  guardarReservasLocal();
  leerReservas();
  console.log(reservas);

  // recalcular lugares después de eliminar
  actualizarDisponibilidad(); 
}

let botonEliminar = document.getElementById("eliminar");
if (botonEliminar) {
  botonEliminar.addEventListener("click", eliminarReserva);
}



//-----------------------------------------------------------------------------------------------
// funcion para consultar/filtrar reservas segun mail
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
            <p><strong>Nombre:</strong> ${r.nombre}</p>
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
  


//-----------------------------------------------------------------------------------------------
// funcion para LIMPIAR campos despues de hacer una reserva
function limpiarCamposReserva() {
  document.getElementById("nombre").value = "";
  document.getElementById("personas").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("mail").value = "";
}

//-----------------------------------------------------------------------------------------------
//funcion para guardar datos en localstorage del usuario
function guardarReservasLocal() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }
  
  window.addEventListener("load", () => {
    let guardadas = localStorage.getItem("reservas");
    if (guardadas) {
      reservas = JSON.parse(guardadas);
      idReserva = reservas.length;
    }
    let horaSel = document.getElementById("hora");
    if (horaSel) { horaSel.disabled = true; }
    actualizarDisponibilidad();
  });


let turnos = ["19:00", "20:30", "22:00"];
let maxComensales = 20;

//-----------------------------------------------------------------------------------------------
// función para actualizar los horarios según disponibilidad
function actualizarDisponibilidad() {
  let fechaHTML = document.getElementById("fecha").value;
  let horaSelect = document.getElementById("hora");
  let textoDisponibilidad = document.getElementById("disponibilidad");

  if (!fechaHTML) {
    textoDisponibilidad.innerHTML = "Seleccioná una fecha para ver los horarios disponibles.";
    horaSelect.disabled = true;
    return;
  }

  horaSelect.disabled = false;
  textoDisponibilidad.innerHTML = "";

  // cargo reservas guardadas
  let reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];

  // recorro cada opción del select
  for (let i = 0; i < horaSelect.options.length; i++) {
    let horaOpcion = horaSelect.options[i].value;

    if (turnos.includes(horaOpcion)) {
      // cuento cuántos comensales hay en ese día y hora
      let totalComensales = 0;

      for (let j = 0; j < reservasGuardadas.length; j++) {
        if (reservasGuardadas[j].fecha === fechaHTML && reservasGuardadas[j].hora === horaOpcion) {
          totalComensales += parseInt(reservasGuardadas[j].personas);
        }
      }

      // si se completó el turno
      if (totalComensales >= maxComensales) {
        horaSelect.options[i].disabled = true;
        horaSelect.options[i].textContent = horaOpcion + " (completo)";
      } else {
        horaSelect.options[i].disabled = false;
        let lugaresRestantes = maxComensales - totalComensales;
        horaSelect.options[i].textContent = horaOpcion + " (" + lugaresRestantes + " lugares)";
      }
    }
  }
}

// evento al cambiar la fecha
let inputFecha = document.getElementById("fecha");
if (inputFecha) {
  inputFecha.addEventListener("change", actualizarDisponibilidad);
}




// -----------------------------------------------
//  RESEÑAS
// -----------------------------------------------

//-----------------------------------------------------------------------------------------------
let reseñas = [];
let idReseña = 0;

// ---- funcion para AGREGAR una reseña
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

//-----------------------------------------------------------------------------------------------
// ---- funcion MOSTRAR todas las reseñas
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

//-----------------------------------------------------------------------------------------------
// funcion para limpiar los campos de reseña

function limpiarCamposReseña() {
  document.getElementById("nombreReseña").value = "";
  document.getElementById("correoReseña").value = "";
  document.getElementById("textoReseña").value = "";
}


//-----------------------------------------------------------------------------------------------
// cargar las reseñas guardadas al inicio 
window.addEventListener("load", () => {
    let reseñasGuardadas = localStorage.getItem("reseñas");
    if (reseñasGuardadas) {
      reseñas = JSON.parse(reseñasGuardadas);
      idReseña = reseñas.length;
      mostrarReseñas(reseñas);
    }
  });
  
//-----------------------------------------------------------------------------------------------
  