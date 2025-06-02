document.addEventListener("DOMContentLoaded", () => {
  const lista = document.querySelector("#lista-carrito tbody");
  const vaciarBtn = document.getElementById("vaciar-carrito");
  const productos = document.querySelectorAll(".agregar-carrito");
  let carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoItems));
  }

  function calcularTotal() {
    return carritoItems.reduce((acc, item) => {
      const precioNum = Number(item.precio.replace(/[^0-9.-]+/g,""));
      return acc + precioNum * item.cantidad;
    }, 0);
  }

  function renderCarrito() {
    lista.innerHTML = "";
    carritoItems.forEach(producto => {
      const precioNum = Number(producto.precio.replace(/[^0-9.-]+/g,""));
      const subtotal = precioNum * producto.cantidad;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${producto.imagen}" width="60"></td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>
          <button class="menos" data-id="${producto.id}">-</button>
          <span class="cantidad">${producto.cantidad}</span>
          <button class="mas" data-id="${producto.id}">+</button>
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><a href="#" class="borrar" data-id="${producto.id}">X</a></td>
      `;
      lista.appendChild(row);
    });
    document.getElementById("total-carrito").textContent = `$${calcularTotal().toFixed(2)}`;
  }

  function agregarProducto(productoNuevo) {
    const existe = carritoItems.find(item => item.id === productoNuevo.id);
    if (existe) {
      existe.cantidad++;
    } else {
      productoNuevo.cantidad = 1;
      carritoItems.push(productoNuevo);
    }
  }

  productos.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const card = e.target.closest(".product");
      const producto = {
        imagen: card.querySelector("img").src,
        titulo: card.querySelector("h3").textContent,
        precio: card.querySelector(".precio").textContent,
        id: card.querySelector("a").getAttribute("data-id")
      };
      agregarProducto(producto);
      guardarCarrito();
      renderCarrito();
    });
  });

  lista.addEventListener("click", e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("borrar")) {
      carritoItems = carritoItems.filter(item => item.id !== id);
    }
    if (e.target.classList.contains("mas")) {
      const item = carritoItems.find(item => item.id === id);
      if (item) item.cantidad++;
    }
    if (e.target.classList.contains("menos")) {
      const item = carritoItems.find(item => item.id === id);
      if (item) {
        item.cantidad--;
        if (item.cantidad <= 0) {
          carritoItems = carritoItems.filter(i => i.id !== id);
        }
      }
    }
    guardarCarrito();
    renderCarrito();
  });

  vaciarBtn.addEventListener("click", e => {
    e.preventDefault();
    carritoItems = [];
    guardarCarrito();
    renderCarrito();
  });

  renderCarrito();
});
