// =====================================================================
// 1. LA CLASE: el molde de cada incidencia (3.5)
// =====================================================================
class Incidencia {
  constructor(autor, equipo, prioridad, descripcion) {
    this.id = Date.now();          // número único: ms desde 1970 (3.2)
    this.fecha = Date.now();       // cuándo se creó
    this.autor = autor;
    this.equipo = equipo;
    this.prioridad = prioridad;    // "alta", "media" o "baja"
    this.descripcion = descripcion;
    this.resuelta = false;
  }

  // Devuelve el HTML de la tarjeta de esta incidencia
  html() {
    let clases = "incidencia " + this.prioridad;
    if (this.resuelta) clases += "resuelta";
    if (this.esUrgente()) clases +=" urgente";
    const hora = new Date(this.fecha).toLocaleTimeString("es-ES");

    let html = "<article class='" + clases + "'>";
    html += "<h3>" + this.equipo + " · prioridad " + this.prioridad + "</h3>";
    html += "<p>" + this.descripcion + "</p>";
    html += "<p class='meta'>" + this.autor + " · " + hora + "</p>";
    // DONE RETO 3: añade "hace X min" con this.minutos()
    html += `<p>hace ${this.minutos()} minuto${this.minutos() === 1 ? "" : "s"}</p>`
    // DONE RETO 1: si NO está resuelta, añade el botón:
    if (!this.resuelta) {
      html += "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>";
    }
    html += "<button type='button' onclick='eliminar(" + this.id + ")'>Eliminar</button>";
    html += "</article>";
    return html;
  }

  // DONE RETO 3: devuelve los minutos que han pasado desde this.fecha
  minutos() {
    return Math.floor((Date.now() - this.fecha) / 60000);
  }

  // RETO 5
  esUrgente() {
    return !this.resuelta && this.prioridad === "alta" && this.minutos() > 30;
  }
}

// =====================================================================
// 2. LOS DATOS: un array que se guarda en localStorage (3.4)
// =====================================================================
let incidencias = [];

function guardar() {
  // localStorage solo guarda texto: JSON.stringify convierte el array en texto
  localStorage.setItem("incidencias", JSON.stringify(incidencias));
}

function cargar() {
  const texto = localStorage.getItem("incidencias");
  if (texto === null) return;              // la primera vez no hay nada
  const datos = JSON.parse(texto);         // texto -> array de objetos SIN métodos
  // Volvemos a crear cada Incidencia para recuperar el método html()
  for (const dato of datos) {
    const inc = new Incidencia(dato.autor, dato.equipo,
                               dato.prioridad, dato.descripcion);
    inc.id = dato.id;
    inc.fecha = dato.fecha;
    inc.resuelta = dato.resuelta;
    incidencias.push(inc);
  }
}

// =====================================================================
// 3. PINTAR la lista en la página
// =====================================================================
function pintar() {
  let html = "";
  let incidenciasPendientes = 0;
  for (const incidencia of incidencias) {
    html += incidencia.html();
    if (!incidencia.resuelta) incidenciasPendientes++;
  }
  if (html === "") html = "<p>No hay incidencias.</p>";
  document.getElementById("lista").innerHTML = html;

  document.getElementById("resumen").textContent = "Total: " + incidencias.length + "· Pendientes: " + incidenciasPendientes;
  // DONE RETO 2: cuenta las que NO están resueltas y muéstralo así:

  let incidenciasUrgentes = incidencias.filter(i => i.esUrgente()).length;
  
  document.title = (incidenciasUrgentes > 0 ? `(${incidenciasUrgentes}) ` : "") + "Incidencias del aula";
}

// Muestra un mensaje que desaparece a los 2 segundos (3.2)
function avisar(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 2000);
}

// =====================================================================
// 4. EVENTOS: qué pasa al pulsar el botón (2.6)
// =====================================================================
document.getElementById("enviar").addEventListener("click", () => {
  const autor = document.getElementById("autor").value.trim();
  const equipo = document.getElementById("equipo").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (autor === "" || equipo === "" || descripcion === "") {
    avisar("Rellena todos los campos.");
    return;
  }

  // Recordamos el nombre 30 días con una cookie (3.3)
  document.cookie = "autor=" + encodeURIComponent(autor) + "; max-age=" + (30 * 24 * 3600);

  incidencias.push(new Incidencia(autor, equipo, prioridad, descripcion));
  guardar();
  pintar();
  avisar("Incidencia guardada ✓");
  document.getElementById("equipo").value = "";
  document.getElementById("descripcion").value = "";
});

// DONE RETO 1: busca con un for la incidencia cuyo id coincide,
function resolver(id) {
  for (const incidencia of incidencias) {
    if (incidencia.id === id && !incidencia.resuelta) incidencia.resuelta = true;
  }
  guardar();
  pintar();
}

// DONE RETO 4
function eliminar(id) {
  if (window.confirm("¿Seguro que quieres eliminar esta incidencia?"))
    for (let i = 0; i < incidencias.length; i++)
      if (incidencias[i].id === id) incidencias.splice(i,1);
  guardar();
  pintar();
}

// =====================================================================
// 5. AL ABRIR LA PÁGINA
// =====================================================================
function leerCookie(nombre) {
  const pares = document.cookie.split("; ");
  for (const par of pares) {
    const [key,value] = par.split("=");
    if (key === nombre) return decodeURIComponent(value);
  }
  return null;
}

const autorGuardado = leerCookie("autor");
if (autorGuardado !== null) {
  document.getElementById("autor").value = autorGuardado;
  document.getElementById("saludo").textContent = "Hola de nuevo, " + autorGuardado;
}

// Reloj que se actualiza cada segundo (3.2)
setInterval(() => {
  document.getElementById("reloj").textContent = new Date().toLocaleTimeString("es-ES");
}, 1000);

cargar();
pintar();

setInterval(pintar, 60000);