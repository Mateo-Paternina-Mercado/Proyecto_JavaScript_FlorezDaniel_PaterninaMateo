// Importar el servicio de API
// Modified to use global functions instead of imports
// import { getRaces } from "./api-service.js"

// Constantes y configuración
const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const characterId = localStorage.getItem("viewCharacterId")

// Elementos del DOM
const characterNameHeader = document.getElementById("characterName")
const characterImage = document.getElementById("characterImage")
const characterRace = document.getElementById("characterRace")
const characterClass = document.getElementById("characterClass")
const characterGender = document.getElementById("characterGender")
const characterStrength = document.getElementById("characterStrength")
const characterKi = document.getElementById("characterKi")
const characterCombatMastery = document.getElementById("characterCombatMastery")
const characterIntelligence = document.getElementById("characterIntelligence")
const characterCombatIntelligence = document.getElementById("characterCombatIntelligence")
const characterConstitution = document.getElementById("characterConstitution")
const characterWeapon = document.getElementById("characterWeapon")
const characterArmor = document.getElementById("characterArmor")
const characterAccessory = document.getElementById("characterAccessory")
const characterAbilities = document.getElementById("characterAbilities")
const backToDashboardBtn = document.getElementById("backToDashboard")
const editCharacterBtn = document.getElementById("editCharacterBtn")
const deleteCharacterBtn = document.getElementById("deleteCharacterBtn")
const deleteModal = document.getElementById("deleteModal")
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
const loadingIndicator = document.getElementById("loadingIndicator")

// Variables globales
let races = []

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si hay un ID de personaje para ver
  if (!characterId) {
    window.location.href = "dashboard.html"
    return
  }

  // Mostrar indicador de carga
  showLoading(true)

  try {
    // Cargar razas para obtener imágenes
    races = await window.getRaces()

    // Cargar los datos del personaje
    await loadCharacterDetails()

    // Configurar eventos
    setupEventListeners()
  } catch (error) {
    console.error("Error during initialization:", error)
    alert("Hubo un error al cargar los datos. Por favor, recarga la página.")
  } finally {
    // Ocultar indicador de carga
    showLoading(false)
  }
})

// Funciones
async function loadCharacterDetails() {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${characterId}`)

    if (!response.ok) {
      throw new Error("Error al cargar los detalles del personaje")
    }

    const character = await response.json()
    displayCharacterDetails(character)
  } catch (error) {
    console.error("Error:", error)
    alert("No se pudo cargar la información del personaje. Volviendo al dashboard.")
    window.location.href = "dashboard.html"
  }
}

function displayCharacterDetails(character) {
  // Actualizar el título con el nombre del personaje
  characterNameHeader.textContent = character.Nombre || "Personaje sin nombre"
  document.title = `Dragon Ball Super D&D - ${character.Nombre || "Detalles del Personaje"}`

  // Información básica
  characterRace.textContent = character.Raza || "-"
  characterClass.textContent = character.Clase || "-"
  characterGender.textContent = character.Genero || "-"

  // Estadísticas
  if (character.Estadisticas) {
    characterStrength.textContent = character.Estadisticas.strength || "-"
    characterKi.textContent = character.Estadisticas.ki || "-"
    characterCombatMastery.textContent = character.Estadisticas.combatMastery || "-"
    characterIntelligence.textContent = character.Estadisticas.intelligence || "-"
    characterCombatIntelligence.textContent = character.Estadisticas.combatIntelligence || "-"
    characterConstitution.textContent = character.Estadisticas.constitution || "-"
  }

  // Equipamiento
  if (character.Equipamiento) {
    characterWeapon.textContent = character.Equipamiento.Arma || "-"
    characterArmor.textContent = character.Equipamiento.Armadura || "-"
    characterAccessory.textContent = character.Equipamiento.Accesorio || "-"
  }

  // Habilidades
  if (character["Hechizos-Ki"] && character["Hechizos-Ki"].length > 0) {
    characterAbilities.innerHTML = ""
    character["Hechizos-Ki"].forEach((ability) => {
      const li = document.createElement("li")
      li.className = "character-ability-item"
      li.innerHTML = `
        <h4>${ability.nombre}</h4>
        <p>${ability.descripcion}</p>
      `
      characterAbilities.appendChild(li)
    })
  } else {
    characterAbilities.innerHTML = '<li class="placeholder-text">Este personaje no tiene habilidades especiales</li>'
  }

  // Historia de fondo
  if (character.Historia) {
    // Crear una nueva sección para la historia
    const historySection = document.createElement("div")
    historySection.className = "character-info-section"
    historySection.innerHTML = `
      <h2>Historia de Fondo</h2>
      <div class="character-background">
        ${character.Historia || "Este personaje no tiene historia de fondo."}
      </div>
    `

    // Añadir la sección a la información del personaje
    document.querySelector(".character-info").appendChild(historySection)
  }

  // Imagen del personaje
  updateCharacterImage(character.Raza)
}

function updateCharacterImage(race) {
  // Buscar la imagen correspondiente a la raza
  let imagePath = "../assets/character-placeholder.png"

  if (race) {
    const raceData = races.find((r) => r.name === race)
    if (raceData && raceData.imageUrl) {
      imagePath = raceData.imageUrl
    }
  }

  characterImage.src = imagePath
}

function setupEventListeners() {
  // Evento para volver al dashboard
  backToDashboardBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })

  // Evento para editar personaje
  editCharacterBtn.addEventListener("click", () => {
    // Guardar el ID en localStorage para edición
    localStorage.setItem("editCharacterId", characterId)
    window.location.href = "edit-character.html"
  })

  // Eventos para eliminar personaje
  deleteCharacterBtn.addEventListener("click", () => {
    deleteModal.classList.add("active")
  })

  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("active")
  })

  confirmDeleteBtn.addEventListener("click", deleteCharacter)
}

async function deleteCharacter() {
  try {
    // Mostrar indicador de carga
    showLoading(true)

    const response = await fetch(`${MOCKAPI_URL}/${characterId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error al eliminar el personaje")
    }

    alert("Personaje eliminado correctamente")
    window.location.href = "dashboard.html"
  } catch (error) {
    console.error("Error:", error)
    alert("Error al eliminar el personaje. Inténtalo de nuevo.")
    deleteModal.classList.remove("active")
  } finally {
    // Ocultar indicador de carga
    showLoading(false)
  }
}

// Función para mostrar/ocultar indicador de carga
function showLoading(show) {
  if (loadingIndicator) {
    loadingIndicator.style.display = show ? "flex" : "none"
  }
}
