const socket = io.connect();

document.getElementById('btnProductoEnviar').addEventListener('click', function (e) {
    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        foto: document.getElementById('foto').value,
    }

    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('foto').value = '';
    socket.emit('new-product', producto);
});

socket.on('productos', productos => {
    generarTablaProductos(productos);
});

const generarTablaProductos = (items) => {
    fetch('partials/table.hbs')
        .then(response => response.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ items })
            document.getElementById('productos').innerHTML = html
        })
}

document.getElementById('btnMensajeEnviar').addEventListener('click', () => {
    let form_validation = true;

    if (!isRequired(document.getElementById('usermail').value)) {
        showError('usermail', 'Este es un campo requerido');
        form_validation = false;
    }
    
    if (form_validation){
        const mensaje = {
            usermail: document.getElementById('usermail').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: new Date().toLocaleString(),
        }
        document.getElementById('mensaje').value = '';
        document.getElementById('mensaje').focus();
        socket.emit('new-message', mensaje);
    }
});


socket.on('mensajes', mensajes => {
    generarTablaMensajes(mensajes);
});

const generarTablaMensajes = (mensajes) => {
    const html = mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.usermail}</b>
                [<span style="color:brown;">${mensaje.fecha}</span>] :
                <i style="color:green;">${mensaje.mensaje}</i>
            </div>
        `)
    }).join(" ");
    document.getElementById('mensajes').innerHTML = html
}

const isRequired = value => value === '' ? false : true;

const showError = (input_id, message) => {
    const input = document.querySelector(`#${input_id}`);
    input.classList.add('is-invalid');
    const error = input.parentElement.querySelector('.invalid-feedback');
    error.textContent = message;
};