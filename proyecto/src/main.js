import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
      <button type="submit">Iniciar sesión</button>
    </div>
    <p>¿No tienes cuenta? <button id="btn-ir-registro">Regístrate</button></p>
  `;

  document.body.appendChild(contenedor);

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

// Iniciar mostrando el login
crearFormularioLogin();

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
  document.body.innerHTML = "hola"
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.innerHTML = "hola"
  } else {
    document.getElementById('btn-ir-login').addEventListener('click', crearFormularioLogin);
  }
});