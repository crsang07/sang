// Variables
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Cargar eventos
cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarProducto);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

// Agrega el producto al carrito
function comprarElementoProducto() {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement;
        leerDatosProducto(producto);
    }
}

// Lee los datos del producto
function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id')
    };

    insertarCarrito(infoProducto);
}

// Inserta el producto en el carrito
function insertarCarrito(producto) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${producto.imagen}" width="100"></td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td><a href="#" class="borrar" data-id="${producto.id}">X</a></td>
    `;

    contenedorCarrito.appendChild(row);
}

// Elimina un producto del carrito
function eliminarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        e.target.closest('tr').remove();
    }
}

// Vacía todo el carrito
function vaciarCarrito(e) {
    e.preventDefault();
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
document.getElementById('form-busqueda').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('buscar-nombre').value;
  const categoria = document.getElementById('buscar-categoria').value;

  fetch(`buscar.php?busqueda=${encodeURIComponent(nombre)}&categoria=${encodeURIComponent(categoria)}`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('resultado-productos').innerHTML = html;
    })
    .catch(error => {
      console.error("Error en la búsqueda:", error);
    });
});

const productosHombre = [
  { nombre: "Nike Air Max", caracteristicas: "Deportivos, transpirables", numero: "40-44", color: "Negro", precio: 1200, img: "img/h1.jpg" },
  { nombre: "Nike Zoom", caracteristicas: "Alta velocidad", numero: "39-43", color: "Blanco", precio: 980, img: "img/h2.jpg" },
  // ... Agrega 6 más
];

const productosMujer = [
  { nombre: "Nike Court", caracteristicas: "Elegantes, cómodos", numero: "36-40", color: "Rosa", precio: 1100, img: "img/m1.jpg" },
  { nombre: "Nike Air Bella", caracteristicas: "Diseño moderno", numero: "35-39", color: "Blanco", precio: 1150, img: "img/m2.jpg" },
  // ... Agrega 6 más
];

function renderProductos(lista, contenedor) {
  contenedor.innerHTML = '';
  lista.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h4>${producto.nombre}</h4>
      <p>${producto.caracteristicas}</p>
      <p>Número: ${producto.numero}</p>
      <p>Color: ${producto.color}</p>
      <p>Precio: $${producto.precio}</p>
      <button class="btn-carrito" onclick='agregarCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

const listaCarrito = [];
function agregarCarrito(producto) {
  listaCarrito.push(producto);
  mostrarCarrito();
}

function mostrarCarrito() {
  const ul = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  ul.innerHTML = '';
  let suma = 0;
  listaCarrito.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nombre} - $${p.precio}`;
    ul.appendChild(li);
    suma += p.precio;
  });
  total.textContent = `Total: $${suma}`;
}

// --- Función de búsqueda básica ---
document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");

  if (buscador) {
    buscador.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const valor = buscador.value.toLowerCase();

        if (valor.includes("mujer") || valor.includes("femenino") || valor.includes("damas")) {
          window.location.href = "zapatos-mujer.html";
        } else if (valor.includes("hombre") || valor.includes("masculino") || valor.includes("caballero")) {
          window.location.href = "zapatos-hombre.html";
        } else {
          alert("No se encontraron coincidencias.");
        }
      }
    });
  }
});

// --- Agregar productos al carrito (fragmento) ---
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("agregar-carrito")) {
    const producto = e.target.closest(".product");
    const nombre = producto.querySelector("h3").textContent;
    const precio = producto.querySelector(".precio").textContent;
    alert(`Agregado al carrito: ${nombre} - ${precio}`);
    // Aquí puedes integrar tu lógica real de carrito si ya la tienes en tu página principal.
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const lista = document.querySelector('#lista-carrito tbody');
  const vaciarBtn = document.getElementById('vaciar-carrito');

  // Cargar los productos al iniciar
  cargarCarrito();

  // Función para agregar al carrito sin duplicados
  document.querySelectorAll('.agregar-carrito').forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();

      const producto = e.target.closest('.product');
      const nuevoProducto = {
        imagen: producto.querySelector('img').src,
        nombre: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.precio').textContent,
        id: e.target.dataset.id
      };

      agregarAlCarritoSinDuplicados(nuevoProducto);
    });
  });

  function agregarAlCarritoSinDuplicados(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const existe = carrito.some(item => item.id === producto.id);

    if (!existe) {
      carrito.push(producto);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      alert('Producto agregado al carrito.');
    } else {
      alert('Este producto ya está en el carrito.');
    }

    cargarCarrito(); // Actualiza la tabla
  }

  function cargarCarrito() {
    lista.innerHTML = '';
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito.forEach(producto => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${producto.imagen}" width="70" /></td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td><a href="#" class="borrar" data-id="${producto.id}">✖</a></td>
      `;
      lista.appendChild(row);
    });
  }

  // Eliminar producto individual
  lista.addEventListener('click', (e) => {
    if (e.target.classList.contains('borrar')) {
      const id = e.target.dataset.id;
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito = carrito.filter(item => item.id !== id);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      cargarCarrito();
    }
  });

  // Vaciar todo el carrito
  vaciarBtn.addEventListener('click', () => {
    localStorage.removeItem('carrito');
    cargarCarrito();
  });
});

  
