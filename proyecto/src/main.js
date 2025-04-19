import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail,EmailAuthProvider,reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Tu config de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyeuOhV-dQRXLrlQxi3v9INY1H98Lf1CA",
  authDomain: "viernes-d9398.firebaseapp.com",
  projectId: "viernes-d9398",
  storageBucket: "viernes-d9398.firebasestorage.app",
  messagingSenderId: "176920941068",
  appId: "1:176920941068:web:f62204bcaa48d98cd6d429"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function crearFormularioLogin() {
  document.body.innerHTML = ''; // Limpia el contenido actual

  const contenedor = document.createElement('div');

  contenedor.innerHTML = `
    <h2>Iniciar sesión</h2>
    <div id="form-login">
      <input type="email" id="login-email" placeholder="Correo" required><br>
      <input type="password" id="login-password" placeholder="Contraseña" required><br>
      <button>Iniciar sesión</button>
    </div>
    <p>¿No tienes cuenta? <button id="btn-ir-registro">Regístrate</button></p>
  `;

  document.body.appendChild(contenedor);
  document.querySelector('#form-login button').addEventListener('click', iniciarSesion);
  document.getElementById('btn-ir-registro').addEventListener('click', crearFormularioRegistro);
}

function crearFormularioRegistro() {
  document.body.innerHTML = ''; // Limpia el contenido actual

  const contenedor = document.createElement('div');

  contenedor.innerHTML = `
    <h2>Registro</h2>
    <div id="form-registro">
      <input type="text" id="nombre" placeholder="Nombre" required><br>
      <input type="email" id="email" placeholder="Correo electrónico" required><br>
      <input type="password" id="password" placeholder="Contraseña" required><br>
      <input type="text" id="pais" placeholder="País" required><br>
      <input type="number" id="edad" placeholder="Edad" required><br>
      <button id="btn-registrarse">Registrarse</button>
    </div>
    <p>¿Ya tienes cuenta? <button id="btn-ir-login">Inicia sesión</button></p>
  `;

  document.body.appendChild(contenedor);

  document.getElementById('btn-ir-login').addEventListener('click', crearFormularioLogin);
  document.getElementById('btn-registrarse').addEventListener('click', registrame);
}

//registrar datos
async function registrame() {

  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const pais = document.getElementById("pais").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Guardar datos en Firestore
    await setDoc(doc(db, "usuarios", uid), {
      nombre,
      edad,
      pais,
      email
    });

    alert("Usuario registrado y datos guardados");
    // Redirigir al login si quieres
  } catch (error) {
    console.error("Error al registrar:", error.message);
  }
}

//iniciar sesión
async function iniciarSesion() {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const usuario = userCredential.user;
    alert(`Bienvenido ${usuario.email}`);
    // Aquí puedes redirigir o mostrar la app principal
  } catch (error) {
    alert("Error al iniciar sesión: ");
  }
}

//mostrar datos
function mostrarDatosUsuario() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        document.body.innerHTML = `
          <h2>Perfil de Usuario</h2>
          <p><strong>Nombre:</strong> <input type="text" id="nombre" value="${datos.nombre}" /></p>
          <p><strong>Correo:</strong> <input type="text" id="email" value="${datos.email}" /></p>
          <p><strong>Password:</strong> <input type="password" id="password" placeholder="No modificar" value="" /></p>
          <p><strong>País:</strong> <input type="text" id="pais" value="${datos.pais}" /></p>
          <p><strong>Edad:</strong> <input type="text" id="edad" value="${datos.edad}" /></p>
          <button id="actualizar">Actualizar</button>
          <button id="cerrar">Cerrar sesión</button>

        `;
        document.getElementById('actualizar').addEventListener('click', actualizar);
        document.getElementById('cerrar').addEventListener('click', cerrarSesion);
      } else {
        alert("No se encontraron datos del usuario.");
      }
    }
  });
}


//actualizar
async function actualizar(){
  const user = auth.currentUser;
  const uid = user.uid;

  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const pais = document.getElementById("pais").value;
  const nuevoCorreo = document.getElementById("email").value;
  const nuevaClave = document.getElementById("password").value;

  try {
    // Actualizar datos de autenticacion
    const contraseñaActual = prompt("Confirma tu contraseña actual:");

    const credential = EmailAuthProvider.credential(user.email, contraseñaActual);
    await reauthenticateWithCredential(user, credential);

    await updateEmail(user, nuevoCorreo);
    if (nuevaClave.trim() !== "") {
      await updatePassword(user, nuevaClave);
    }
    

    //actualiza los datos de la base de datos
    await updateDoc(doc(db, "usuarios", uid), {
        nombre: nombre,
        edad: edad,
        pais: pais,
        email: nuevoCorreo,
    });

    alert("Datos actualizados correctamente");
  } catch (error) {
    console.error("Error al actualizar:", error.message);
  }
}

//cerrrar sesion
function cerrarSesion() {
  signOut(auth)
    .then(() => {
      alert("Sesión cerrada");
      crearFormularioLogin(); // Muestra el login de nuevo
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    mostrarDatosUsuario()
  } else {
    crearFormularioLogin();
  }
});