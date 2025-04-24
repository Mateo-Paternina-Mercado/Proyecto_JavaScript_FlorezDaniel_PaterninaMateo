// Constantes y configuración
const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const logoutBtn = document.getElementById("logoutBtn")
const charactersGrid = document.querySelector(".characters-grid")
const createCharacterCardElement = document.querySelector(".create-character")

const searchInput = document.getElementById("characterSearch")
const clearSearchBtn = document.getElementById("clearSearch")
const filterName = document.getElementById("filterName")
const filterRace = document.getElementById("filterRace")
const filterClass = document.getElementById("filterClass")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  checkAuthentication()

  // Cargar personajes del usuario
  loadCharacters()

  // Configurar eventos
  setupEventListeners()

  // Configurar funcionalidad de búsqueda
  setupSearchFunctionality()
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

function setupSearchFunctionality() {
  // Evento para la búsqueda en tiempo real
  searchInput.addEventListener("input", filterCharacters)

  // Evento para limpiar la búsqueda
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = ""
    clearSearchBtn.style.display = "none"
    filterCharacters()
  })

  // Eventos para los filtros
  filterName.addEventListener("change", filterCharacters)
  filterRace.addEventListener("change", filterCharacters)
  filterClass.addEventListener("change", filterCharacters)

  // Mostrar/ocultar el botón de limpiar
  searchInput.addEventListener("input", () => {
    clearSearchBtn.style.display = searchInput.value ? "block" : "none"
  })
}

function filterCharacters() {
  const searchTerm = searchInput.value.toLowerCase().trim()
  const useNameFilter = filterName.checked
  const useRaceFilter = filterRace.checked
  const useClassFilter = filterClass.checked

  // Si no hay término de búsqueda, mostrar todos los personajes
  if (!searchTerm) {
    const characterCards = document.querySelectorAll(".character-card")
    characterCards.forEach((card) => {
      card.style.display = "flex"
    })

    // Verificar si hay un mensaje de "no resultados" y eliminarlo
    const noResultsMessage = document.querySelector(".no-results-message")
    if (noResultsMessage) {
      noResultsMessage.remove()
    }
    return
  }

  // Filtrar personajes
  const characterCards = document.querySelectorAll(".character-card")
  let visibleCount = 0

  characterCards.forEach((card) => {
    const name = card.querySelector(".character-name").textContent.toLowerCase()
    const raceElement = card.querySelector("p:nth-child(2)")
    const classElement = card.querySelector("p:nth-child(3)")

    const race = raceElement ? raceElement.textContent.toLowerCase() : ""
    const characterClass = classElement ? classElement.textContent.toLowerCase() : ""

    const nameMatch = useNameFilter && name.includes(searchTerm)
    const raceMatch = useRaceFilter && race.includes(searchTerm)
    const classMatch = useClassFilter && characterClass.includes(searchTerm)

    if (nameMatch || raceMatch || classMatch) {
      card.style.display = "flex"
      visibleCount++
    } else {
      card.style.display = "none"
    }
  })

  // Mostrar mensaje si no hay resultados
  const noResultsMessage = document.querySelector(".no-results-message")

  if (visibleCount === 0) {
    if (!noResultsMessage) {
      const message = document.createElement("div")
      message.className = "no-results-message"
      message.textContent = "No se encontraron personajes que coincidan con tu búsqueda."

      // Insertar después de la tarjeta de crear personaje
      createCharacterCardElement.insertAdjacentElement("afterend", message)
    }
  } else if (noResultsMessage) {
    noResultsMessage.remove()
  }
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
    <h3 class="character-name">${character.Nombre || "Sin nombre"}</h3>
    <p>Raza: ${character.Raza || "-"}</p>
    <p>Clase: ${character.Clase || "-"}</p>
    <button class="btn btn-primary view-character" data-id="${character.id}">Ver detalles</button>
  `

  // Añadir evento para ver detalles
  const viewButton = card.querySelector(".view-character")
  viewButton.addEventListener("click", () => {
    // Guardar el ID en localStorage y redirigir a la página de detalles
    localStorage.setItem("viewCharacterId", character.id)
    window.location.href = "character-details.html"
  })

  return card
}
