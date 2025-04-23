// Constantes y configuración
const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const logoutBtn = document.getElementById("logoutBtn")
const charactersGrid = document.querySelector(".characters-grid")
const createCharacterCardElement = document.querySelector(".create-character")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  checkAuthentication()

  // Cargar personajes del usuario
  loadCharacters()

  // Configurar eventos
  setupEventListeners()
})

// Funciones
function checkAuthentication() {
  const currentUser = localStorage.getItem("currentUser")

  if (!currentUser) {
    // Redirigir al login si no hay usuario autenticado
    window.location.href = "index.html"
  }
}

async function loadCharacters() {
  try {
    // En un caso real, filtrarías por el ID del usuario actual
    const response = await fetch(MOCKAPI_URL)

    if (!response.ok) {
      throw new Error("Error al cargar los personajes")
    }

    const characters = await response.json()

    // Mostrar personajes en la interfaz
    displayCharacters(characters)
  } catch (error) {
    console.error("Error:", error)
  }
}

function displayCharacters(characters) {
  // Mantener la tarjeta de "Crear nuevo personaje"
  charactersGrid.innerHTML = ""
  charactersGrid.appendChild(createCharacterCardElement)

  // Añadir cada personaje a la cuadrícula
  characters.forEach((character) => {
    const characterCard = createCharacterDiv(character)
    charactersGrid.appendChild(characterCard)
  })
}

// Actualizar la función setupEventListeners para añadir el evento de clic a la tarjeta de crear personaje
function setupEventListeners() {
  // Evento para cerrar sesión
  logoutBtn.addEventListener("click", logout)

  // Evento para crear nuevo personaje
  createCharacterCardElement.addEventListener("click", () => {
    window.location.href = "create-character.html"
  })
}

// Añadir la función de logout que faltaba
function logout() {
  // Eliminar información del usuario actual
  localStorage.removeItem("currentUser")

  // Redirigir al login
  window.location.href = "index.html"
}

// Función para crear una tarjeta de personaje
function createCharacterDiv(character) {
  const card = document.createElement("div")
  card.className = "character-card"

  card.innerHTML = `
    <h3>${character.Nombre || "Sin nombre"}</h3>
    <p>Raza: ${character.Raza || "-"}</p>
    <p>Clase: ${character.Clase || "-"}</p>
    <button class="btn btn-primary view-character" data-id="${character.id}">Ver detalles</button>
  `

  // Añadir evento para ver detalles
  const viewButton = card.querySelector(".view-character")
  viewButton.addEventListener("click", () => {
    // Aquí puedes implementar la vista de detalles
    // Por ahora solo guardamos el ID en localStorage y redirigimos
    localStorage.setItem("viewCharacterId", character.id)
    // En el futuro, puedes crear una página de detalles
    // window.location.href = "character-details.html";
    alert(`Ver detalles del personaje ${character.Nombre}`)
  })

  return card
}
