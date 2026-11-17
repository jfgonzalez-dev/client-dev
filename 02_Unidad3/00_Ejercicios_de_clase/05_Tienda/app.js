// =====================================================================
// EJERCICIOS · Tienda DAW con carrito
// Lo que ya funciona: el catálogo. Lo que tienes que programar: el carrito.
// Busca los comentarios DONE (ejercicios 1 a 4).
// =====================================================================

//const { createElement } = require("react"); //???

// ---------------------------------------------------------------------
// DADO: la clase Producto y el catálogo (igual que en el ejemplo de clase)
// ---------------------------------------------------------------------
class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;      // precio SIN IVA
    this.stock = stock;        // unidades disponibles en la tienda
    this.icono = icono;
  }
  conIVA() {
    return this.precio * 1.21;
  }
  html() {
    return "<div class='producto'>" +
      "<span class='icono'>" + this.icono + "</span>" +
      "<h3>" + this.nombre + "</h3>" +
      "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
      "<span class='stock'>Quedan " + this.stock + " unidades</span>" +
      "<button onclick='comprar(" + this.id + ")'>Añadir al carrito</button>" +
      "</div>";
  }
}

const productos = [
  new Producto(1, "Ratón inalámbrico", 19.90, 5, "🖱️"),
  new Producto(2, "Teclado mecánico", 49.90, 3, "⌨️"),
  new Producto(3, "Auriculares", 29.90, 4, "🎧"),
  new Producto(4, "Memoria USB 64 GB", 9.90, 10, "💾"),
  new Producto(5, "Webcam HD", 34.90, 2, "📷"),
  new Producto(6, "Alfombrilla XL", 12.50, 6, "🟩")
];

function pintarCatalogo() {
  let html = "";
  for (const producto of productos) {
    html += producto.html();
  }
  document.getElementById("catalogo").innerHTML = html;
}

function buscarProducto(id) {
  for (const producto of productos) {
    if (producto.id === id) return producto;
  }
  return null;
}

// Muestra un aviso que se borra solo a los 3 segundos
function aviso(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 3000);
}

// ---------------------------------------------------------------------
// DONE EJERCICIO 1 · La clase LineaCarrito
// Una línea del carrito guarda UN producto y CUÁNTAS unidades se compran.
//  - constructor(producto, cantidad): la cantidad vale 1 si no se indica
//  - subtotal(): precio con IVA del producto × cantidad
//  - html(): devuelve el HTML de la línea (mira la estructura en la diapositiva
//    y las clases .linea, .icono, .nombre, .cantidad y .subtotal en estilos.css).
//    El botón ✕ debe llamar a quitar(id del producto).
// ---------------------------------------------------------------------
const TIPO_IVA = Object.freeze({
  SUPERREDUCIDO: 0.04,
  REDUCIDO: 0.1,
  GENERAL: 0.21
});

class LineaCarrito {
  constructor(producto, cantidad, tipoIva) {
    this.producto = producto;
    this.cantidad = cantidad === undefined ? 1 : cantidad;
    this.tipoIva = tipoIva === undefined ? TIPO_IVA.GENERAL : tipoIva;
  }

  subtotal() {
    return this.producto.precio * this.cantidad * (1 + this.tipoIva)
  }

  html() {
    return `
      <div class='linea'>
        <div class='icono'>${this.producto.icono}</div>
        <div class='nombre'>${this.producto.nombre}</div>
        <div class='cantidad'>${this.cantidad}</div>
        <div class='subtotal'>${this.subtotal().toFixed(2)} €</div>
        <button class='icono' onclick='quitar(${this.producto.id})'>✕</button>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------
// El objeto carrito
// ---------------------------------------------------------------------
const carrito = {
  lineas: [],
  descuento: 0,      // 0.10 significará un 10 % (ejercicio 4)

  // DONE EJERCICIO 2 · buscarLinea(id): la línea de ese producto, o null
  buscarLinea(id) {
    return this.lineas.length > 0 ? this.lineas.find(l => l.producto.id === id) : null;
  },

  // DONE EJERCICIO 2 · agregar(producto)
  // Ahora mismo crea una línea nueva cada vez (como en el ejemplo).
  // Cámbialo: si el producto ya está en el carrito, suma 1 a su cantidad.
  // No se puede pasar del stock del producto: en ese caso devuelve false.
  // Si se ha podido añadir, devuelve true.
  agregar(producto) {
    if (producto.stock < 1) return false;

    const linea = this.buscarLinea(producto.id);

    if (linea) {
      linea.cantidad++;
    } else {
      this.lineas.push(new LineaCarrito(producto, 1));
    }

    producto.stock--;
    return true;
  },

  // DONE EJERCICIO 3 · quitar(id): quita del array la línea de ese producto
  quitar(id) {
    const index = this.lineas.findIndex(l => l.producto.id === id);
    if (index !== -1) {
      const linea = this.lineas[index];
      linea.producto.stock += linea.cantidad;
      this.lineas.splice(index, 1);
    }
  },

  // DONE EJERCICIO 3 · vaciar(): deja el carrito sin líneas y sin descuento
  vaciar() {
    this.lineas.forEach(l => l.producto.stock += l.cantidad);
    this.lineas = [];
    this.descuento = 0;
  },

  // DONE EJERCICIO 3 · unidades(): suma de las cantidades de todas las líneas
  unidades() {
    return this.lineas.reduce((sum, l) => sum + l.cantidad, 0);
  },

  // DONE EJERCICIO 3 · total(): suma de los subtotales de todas las líneas
  total() {
    return this.lineas.reduce((sum,l) => sum + l.subtotal(), 0);
  },

  // DONE EJERCICIO 4 · aplicarCodigo(codigo): si el código es "DAW10"
  // (da igual mayúsculas o espacios), pon descuento a 0.10 y devuelve true.
  // Si no, devuelve false.
  aplicarCodigo(codigo) {
    if (codigo.trim().toUpperCase() !== 'DAW10') return false;
    this.descuento = 0.1;
    return true;
  },

  // DADO: rebaja y total final, redondeados a céntimos para que las cuentas cuadren
  rebaja() {
    return Number((Number(this.total().toFixed(2)) * this.descuento).toFixed(2));
  },
  totalFinal() {
    return Number(this.total().toFixed(2)) - this.rebaja();
  }
};

// ---------------------------------------------------------------------
// DONE EJERCICIO 3 · pintarCarrito()
//  - En #carrito-lineas: el html() de cada línea, o «Tu carrito está vacío»
//  - En #carrito-resumen: las unidades y el total (mira la diapositiva)
//  - Ejercicio 4: si hay descuento, muestra también el subtotal y la rebaja
// ---------------------------------------------------------------------
function pintarCarrito() {
  const lineas = document.getElementById("carrito-lineas");
  const resumen = document.getElementById("carrito-resumen");
  const unidades = carrito.unidades();

  lineas.innerHTML = carrito.lineas.length === 0
    ? "<p class='vacio'>Tu carrito está vacío</p>"
    : carrito.lineas.map(l => l.html()).join("");

  if (carrito.descuento > 0) {
    resumen.innerHTML = `
      <p>${unidades} unidades</p>
      <p>Subtotal: ${carrito.total().toFixed(2)} €</p>
      <p class='descuento'>Descuento: -${carrito.rebaja().toFixed(2)} €</p>
      <p class='total'>Total: ${carrito.totalFinal().toFixed(2)} €</p>
    `;
  } else {
    resumen.innerHTML = `
      <p>${unidades} unidades</p>
      <p class='total'>Total: ${carrito.total().toFixed(2)} €</p>
    `;
  }

  guardar();
}

// ---------------------------------------------------------------------
// DONE EJERCICIO 4 · Guardar y recuperar el carrito en localStorage
// Pista: guarda solo el id y la cantidad de cada línea (y el descuento).
// Al cargar, busca cada producto por su id y vuelve a crear la LineaCarrito.
// ---------------------------------------------------------------------
function guardar() {
  const datos = {
    lineas: carrito.lineas.map(l => ({
      id: l.producto.id,
      cantidad: l.cantidad
    })),
    descuento: carrito.descuento
  };

  localStorage.setItem("carrito", JSON.stringify(datos));
}

function cargar() {
  const datos = JSON.parse(localStorage.getItem("carrito"));
  if (!datos) return;

  carrito.lineas = [];
  for (const l of datos.lineas) {
    const producto = buscarProducto(l.id);
    if (!producto) continue;
    producto.stock -= l.cantidad;
    carrito.lineas.push(new LineaCarrito(producto, l.cantidad));
  }
  carrito.descuento = datos.descuento || 0;
}

// ---------------------------------------------------------------------
// DADO: los eventos (ya llaman a los métodos que vas a programar)
// ---------------------------------------------------------------------
function comprar(id) {
  const producto = buscarProducto(id);
  if (!carrito.agregar(producto)) {
    aviso("No quedan más unidades de " + producto.nombre);
  }
  pintarCarrito();
  pintarCatalogo();
}

function quitar(id) {
  carrito.quitar(id);
  pintarCarrito();
  pintarCatalogo();
}

document.getElementById("vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
  pintarCatalogo();
});

document.getElementById("aplicar").addEventListener("click", () => {
  const campo = document.getElementById("codigo");
  if (carrito.descuento > 0) {
    aviso("Ya has aplicado un código de descuento");
  } else if (!carrito.aplicarCodigo(campo.value)) {
    aviso("Código no válido");
  } else {
    campo.value = "";
    pintarCarrito();
  }
});

// ---------------------------------------------------------------------
// AL ABRIR LA PÁGINA
// ---------------------------------------------------------------------
cargar();
pintarCatalogo();
pintarCarrito();
