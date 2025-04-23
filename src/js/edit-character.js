// Importar el servicio de API
// Modified to use global functions instead of imports
// import { getRaces, getClasses, getEquipment, getSpecialAbilities } from "./api-service.js"

// Constantes y configuración
const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const LOCAL_STORAGE_KEY = "dbs_character_edit_draft"
const MAX_TOTAL_STATS = 70 // Máximo total de puntos de estadísticas
const MAX_ABILITIES = 2 // Máximo de habilidades seleccionables
const characterId = localStorage.getItem("editCharacterId")

// Elementos del DOM
const characterForm = document.getElementById("characterForm")
const characterNameInput = document.getElementById("characterName")
const characterRaceSelect = document.getElementById("characterRace")
const characterClassSelect = document.getElementById("characterClass")
const raceDescriptionDiv = document.getElementById("raceDescription")
const classDescriptionDiv = document.getElementById("classDescription")
const genderInputs = document.querySelectorAll('input[name="gender"]')
const rollDiceBtn = document.getElementById("rollDiceBtn")
const diceContainer = document.getElementById("diceContainer")
const dice = document.getElementById("dice")
const characterWeaponSelect = document.getElementById("characterWeapon")
const characterArmorSelect = document.getElementById("characterArmor")
const characterAccessorySelect = document.getElementById("characterAccessory")
const characterBackgroundTextarea = document.getElementById("characterBackground")
const specialAbilitiesContainer = document.getElementById("specialAbilitiesContainer")
const deleteCharacterBtn = document.getElementById("deleteCharacterBtn")
const saveCharacterBtn = document.getElementById("saveCharacterBtn")
const backToDetailsBtn = document.getElementById("backToDetails")
const deleteModal = document.getElementById("deleteModal")
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
const saveModal = document.getElementById("saveModal")
const viewDetailsBtn = document.getElementById("viewDetailsBtn")
const backToDashboardBtn = document.getElementById("backToDashboardBtn")
const loadingIndicator = document.getElementById("loadingIndicator")

// Elementos de la vista previa
const previewName = document.getElementById("previewName")
const previewRace = document.getElementById("previewRace")
const previewClass = document.getElementById("previewClass")
const previewGender = document.getElementById("previewGender")
const previewStrength = document.getElementById("previewStrength")
const previewKi = document.getElementById("previewKi")
const previewCombatMastery = document.getElementById("previewCombatMastery")
const previewIntelligence = document.getElementById("previewIntelligence")
const previewCombatIntelligence = document.getElementById("previewCombatIntelligence")
const previewConstitution = document.getElementById("previewConstitution")
const previewWeapon = document.getElementById("previewWeapon")
const previewArmor = document.getElementById("previewArmor")
const previewAccessory = document.getElementById("previewAccessory")
const previewAbilities = document.getElementById("previewAbilities")
const characterImage = document.getElementById("characterImage")

// Variables globales
let races = []
let classes = []
let weapons = []
let armors = []
let accessories = []
let specialAbilities = []
let selectedAbilities = []
let originalCharacter = null

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si hay un ID de personaje para editar
  if (!characterId) {
    window.location.href = "dashboard.html"
    return
  }

  // Mostrar indicador de carga
  showLoading(true)

  try {
    // Cargar datos desde APIs
    races = await window.getRaces()
    classes = await window.getClasses()
    const equipment = await window.getEquipment()
    weapons = equipment.weapons
    armors = equipment.armors
    accessories = equipment.accessories

    // Poblar selectores
    populateRaceSelect()
    populateClassSelect()
    populateEquipmentSelects()

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

// Funciones para poblar selectores
function populateRaceSelect() {
  characterRaceSelect.innerHTML = '<option value="" disabled selected>Selecciona una raza</option>'

  races.forEach((race) => {
    const option = document.createElement("option")
    option.value = race.name
    option.textContent = race.name
    characterRaceSelect.appendChild(option)
  })
}

function populateClassSelect() {
  characterClassSelect.innerHTML = '<option value="" disabled selected>Selecciona una clase</option>'

  classes.forEach((cls) => {
    const option = document.createElement("option")
    option.value = cls.name
    option.textContent = cls.name
    characterClassSelect.appendChild(option)
  })
}

function populateEquipmentSelects() {
  // Poblar selector de armas
  characterWeaponSelect.innerHTML = '<option value="" disabled selected>Selecciona un arma</option>'
  weapons.forEach((weapon) => {
    const option = document.createElement("option")
    option.value = weapon.name
    option.textContent = weapon.name
    characterWeaponSelect.appendChild(option)
  })

  // Poblar selector de armaduras
  characterArmorSelect.innerHTML = '<option value="" disabled selected>Selecciona una armadura</option>'
  armors.forEach((armor) => {
    const option = document.createElement("option")
    option.value = armor.name
    option.textContent = armor.name
    characterArmorSelect.appendChild(option)
  })

  // Poblar selector de accesorios
  characterAccessorySelect.innerHTML = '<option value="" disabled selected>Selecciona un accesorio</option>'
  accessories.forEach((accessory) => {
    const option = document.createElement("option")
    option.value = accessory.name
    option.textContent = accessory.name
    characterAccessorySelect.appendChild(option)
  })
}

async function populateSpecialAbilities() {
  const race = characterRaceSelect.value
  const characterClass = characterClassSelect.value

  if (!race || !characterClass) {
    specialAbilitiesContainer.innerHTML =
      '<p class="placeholder-text">Selecciona una raza y clase para ver las habilidades disponibles</p>'
    return
  }

  // Mostrar indicador de carga en el contenedor de habilidades
  specialAbilitiesContainer.innerHTML = '<p class="placeholder-text">Cargando habilidades...</p>'

  try {
    const abilities = await window.getSpecialAbilities(race, characterClass)
    specialAbilities = abilities

    if (specialAbilities.length === 0) {
      specialAbilitiesContainer.innerHTML =
        '<p class="placeholder-text">No hay habilidades disponibles para esta combinación</p>'
      return
    }

    // Añadir mensaje sobre el límite de habilidades
    specialAbilitiesContainer.innerHTML = `
      <div class="abilities-limit-message">
        <p>Puedes seleccionar hasta ${MAX_ABILITIES} habilidades especiales</p>
      </div>
    `

    specialAbilities.forEach((ability) => {
      const abilityElement = document.createElement("div")
      abilityElement.className = "ability-item"
      abilityElement.dataset.id = ability.id

      if (selectedAbilities.some((a) => a.id === ability.id)) {
        abilityElement.classList.add("selected")
      }

      abilityElement.innerHTML = `
            <h4>${ability.name}</h4>
            <p>${ability.description}</p>
        `

      abilityElement.addEventListener("click", () => toggleAbility(ability, abilityElement))

      specialAbilitiesContainer.appendChild(abilityElement)
    })
  } catch (error) {
    console.error("Error al cargar las habilidades:", error)
    specialAbilitiesContainer.innerHTML =
      '<p class="placeholder-text">Error al cargar las habilidades. Inténtalo de nuevo.</p>'
  }
}

// Funciones para manejar eventos
function setupEventListeners() {
  // Eventos para actualizar la vista previa
  characterNameInput.addEventListener("input", updatePreview)
  characterRaceSelect.addEventListener("change", handleRaceChange)
  characterClassSelect.addEventListener("change", handleClassChange)
  genderInputs.forEach((input) => input.addEventListener("change", updatePreview))
  characterWeaponSelect.addEventListener("change", updatePreview)
  characterArmorSelect.addEventListener("change", updatePreview)
  characterAccessorySelect.addEventListener("change", updatePreview)
  characterBackgroundTextarea.addEventListener("input", updatePreview)

  // Eventos para los dados
  rollDiceBtn.addEventListener("click", rollDice)

  // Eventos para guardar y eliminar
  characterForm.addEventListener("submit", handleFormSubmit)
  deleteCharacterBtn.addEventListener("click", () => {
    deleteModal.classList.add("active")
  })

  // Eventos para el modal de eliminación
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("active")
  })
  confirmDeleteBtn.addEventListener("click", deleteCharacter)

  // Eventos para el modal de guardado
  viewDetailsBtn.addEventListener("click", () => {
    window.location.href = `character-details.html`
  })
  backToDashboardBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })

  // Evento para volver a detalles
  backToDetailsBtn.addEventListener("click", () => {
    window.location.href = "character-details.html"
  })
}

async function handleRaceChange() {
  const selectedRace = characterRaceSelect.value
  const raceData = races.find((race) => race.name === selectedRace)

  if (raceData) {
    raceDescriptionDiv.textContent = raceData.description

    // Actualizar imagen del personaje basada en la raza
    updateCharacterImage()
  } else {
    raceDescriptionDiv.textContent = ""
  }

  // Resetear habilidades seleccionadas al cambiar de raza
  selectedAbilities = []

  await populateSpecialAbilities()
  updatePreview()
}

async function handleClassChange() {
  const selectedClass = characterClassSelect.value
  const classData = classes.find((cls) => cls.name === selectedClass)

  if (classData) {
    classDescriptionDiv.textContent = classData.description
  } else {
    classDescriptionDiv.textContent = ""
  }

  // Resetear habilidades seleccionadas al cambiar de clase
  selectedAbilities = []

  await populateSpecialAbilities()
  updatePreview()
}

function toggleAbility(ability, element) {
  const index = selectedAbilities.findIndex((a) => a.id === ability.id)

  if (index === -1) {
    // Verificar si ya se alcanzó el límite de habilidades
    if (selectedAbilities.length >= MAX_ABILITIES) {
      alert(`Solo puedes seleccionar un máximo de ${MAX_ABILITIES} habilidades especiales.`)
      return
    }

    // Añadir habilidad
    selectedAbilities.push(ability)
    element.classList.add("selected")
  } else {
    // Quitar habilidad
    selectedAbilities.splice(index, 1)
    element.classList.remove("selected")
  }

  updatePreview()
}

// Función para lanzar dados
function rollDice() {
  // Animación de dados
  dice.classList.add("rolling")

  // Deshabilitar el botón durante la animación
  rollDiceBtn.disabled = true

  // Esperar un tiempo aleatorio para dar sensación de lanzamiento
  setTimeout(() => {
    dice.classList.remove("rolling")
    rollDiceBtn.disabled = false

    // Generar valores aleatorios para cada estadística con un total máximo de MAX_TOTAL_STATS
    const stats = generateBalancedStats(MAX_TOTAL_STATS)

    // Actualizar los valores en el formulario
    document.getElementById("statStrength").value = stats.strength
    document.getElementById("statKi").value = stats.ki
    document.getElementById("statCombatMastery").value = stats.combatMastery
    document.getElementById("statIntelligence").value = stats.intelligence
    document.getElementById("statCombatIntelligence").value = stats.combatIntelligence
    document.getElementById("statConstitution").value = stats.constitution

    // Actualizar las barras de progreso
    updateStatBars()

    // Actualizar la vista previa
    updatePreview()
  }, 1000)
}

function generateBalancedStats(maxTotal) {
  // Generar valores aleatorios para cada estadística
  const stats = {
    strength: Math.floor(Math.random() * 10) + 5, // 5-14
    ki: Math.floor(Math.random() * 10) + 5,
    combatMastery: Math.floor(Math.random() * 10) + 5,
    intelligence: Math.floor(Math.random() * 10) + 5,
    combatIntelligence: Math.floor(Math.random() * 10) + 5,
    constitution: Math.floor(Math.random() * 10) + 5,
  }

  // Calcular el total actual
  const total = Object.values(stats).reduce((sum, val) => sum + val, 0)

  // Ajustar los valores para que sumen exactamente maxTotal
  if (total !== maxTotal) {
    // Calcular el factor de ajuste
    const factor = maxTotal / total

    // Ajustar cada estadística y redondear
    for (const key in stats) {
      stats[key] = Math.round(stats[key] * factor)
    }

    // Verificar el nuevo total después del redondeo
    const newTotal = Object.values(stats).reduce((sum, val) => sum + val, 0)

    // Ajustar la diferencia (si existe) en una estadística aleatoria
    if (newTotal !== maxTotal) {
      const diff = maxTotal - newTotal
      const keys = Object.keys(stats)
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      stats[randomKey] += diff
    }
  }

  return stats
}

function updateStatBars() {
  const stats = [
    { id: "statStrength", fillId: "statStrengthFill" },
    { id: "statKi", fillId: "statKiFill" },
    { id: "statCombatMastery", fillId: "statCombatMasteryFill" },
    { id: "statIntelligence", fillId: "statIntelligenceFill" },
    { id: "statCombatIntelligence", fillId: "statCombatIntelligenceFill" },
    { id: "statConstitution", fillId: "statConstitutionFill" },
  ]

  stats.forEach((stat) => {
    const value = Number.parseInt(document.getElementById(stat.id).value)
    const percentage = (value / 20) * 100
    document.getElementById(stat.fillId).style.width = `${percentage}%`
  })
}

// Funciones para actualizar la vista previa
function updatePreview() {
  // Actualizar información básica
  previewName.textContent = characterNameInput.value || "Nombre del Personaje"
  previewRace.textContent = characterRaceSelect.value || "-"
  previewClass.textContent = characterClassSelect.value || "-"

  // Actualizar género
  const selectedGender = document.querySelector('input[name="gender"]:checked')
  previewGender.textContent = selectedGender ? selectedGender.value : "Masculino"

  // Actualizar estadísticas
  previewStrength.textContent = document.getElementById("statStrength").value
  previewKi.textContent = document.getElementById("statKi").value
  previewCombatMastery.textContent = document.getElementById("statCombatMastery").value
  previewIntelligence.textContent = document.getElementById("statIntelligence").value
  previewCombatIntelligence.textContent = document.getElementById("statCombatIntelligence").value
  previewConstitution.textContent = document.getElementById("statConstitution").value

  // Actualizar equipamiento
  previewWeapon.textContent = characterWeaponSelect.value || "-"
  previewArmor.textContent = characterArmorSelect.value || "-"
  previewAccessory.textContent = characterAccessorySelect.value || "-"

  // Actualizar habilidades
  if (selectedAbilities.length > 0) {
    previewAbilities.innerHTML = ""
    selectedAbilities.forEach((ability) => {
      const li = document.createElement("li")
      li.textContent = ability.name
      previewAbilities.appendChild(li)
    })
  } else {
    previewAbilities.innerHTML = '<li class="placeholder-text">Ninguna habilidad seleccionada</li>'
  }

  // Actualizar imagen
  updateCharacterImage()
}

function updateCharacterImage() {
  const race = characterRaceSelect.value
  const characterClass = characterClassSelect.value
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "Masculino"

  // Buscar la imagen correspondiente a la raza seleccionada
  let imagePath = "../assets/character-placeholder.png"

  if (race) {
    const raceData = races.find((r) => r.name === race)
    if (raceData && raceData.imageUrl) {
      imagePath = raceData.imageUrl
    }
  }

  characterImage.src = imagePath
}

// Funciones para cargar y guardar datos del personaje
async function loadCharacterDetails() {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${characterId}`)

    if (!response.ok) {
      throw new Error("Error al cargar los detalles del personaje")
    }

    const character = await response.json()
    originalCharacter = character
    populateFormWithData(character)
  } catch (error) {
    console.error("Error:", error)
    alert("No se pudo cargar la información del personaje. Volviendo al dashboard.")
    window.location.href = "dashboard.html"
  }
}

function populateFormWithData(character) {
  // Rellenar campos básicos
  characterNameInput.value = character.Nombre || ""

  // Esperar a que se carguen las razas y clases antes de seleccionarlas
  const checkSelects = setInterval(() => {
    if (characterRaceSelect.options.length > 1 && characterClassSelect.options.length > 1) {
      clearInterval(checkSelects)

      // Seleccionar raza y clase
      characterRaceSelect.value = character.Raza || ""
      characterClassSelect.value = character.Clase || ""

      // Disparar eventos para actualizar descripciones y habilidades
      handleRaceChange()
      handleClassChange()

      // Continuar con el resto de la población de datos
      populateRemainingData(character)
    }
  }, 100)
}

function populateRemainingData(character) {
  // Género
  if (character.Genero) {
    const genderInput = document.querySelector(`input[name="gender"][value="${character.Genero}"]`)
    if (genderInput) genderInput.checked = true
  }

  // Estadísticas
  if (character.Estadisticas) {
    document.getElementById("statStrength").value = character.Estadisticas.strength || 10
    document.getElementById("statKi").value = character.Estadisticas.ki || 10
    document.getElementById("statCombatMastery").value = character.Estadisticas.combatMastery || 10
    document.getElementById("statIntelligence").value = character.Estadisticas.intelligence || 10
    document.getElementById("statCombatIntelligence").value = character.Estadisticas.combatIntelligence || 10
    document.getElementById("statConstitution").value = character.Estadisticas.constitution || 10

    updateStatBars()
  }

  // Equipamiento
  if (character.Equipamiento) {
    if (character.Equipamiento.Arma) characterWeaponSelect.value = character.Equipamiento.Arma
    if (character.Equipamiento.Armadura) characterArmorSelect.value = character.Equipamiento.Armadura
    if (character.Equipamiento.Accesorio) characterAccessorySelect.value = character.Equipamiento.Accesorio
  }

  // Historia de fondo
  if (character.Historia) {
    characterBackgroundTextarea.value = character.Historia
  }

  // Habilidades
  if (character["Hechizos-Ki"] && character["Hechizos-Ki"].length > 0) {
    // Convertir las habilidades del personaje al formato que usa la aplicación
    selectedAbilities = character["Hechizos-Ki"].map((ability, index) => ({
      id: index + 100, // ID temporal para evitar conflictos
      name: ability.nombre,
      description: ability.descripcion,
    }))

    // Actualizar la selección visual de habilidades
    setTimeout(() => {
      const abilityElements = specialAbilitiesContainer.querySelectorAll(".ability-item")
      abilityElements.forEach((element) => {
        const abilityId = Number.parseInt(element.dataset.id)
        const abilityName = element.querySelector("h4").textContent

        // Buscar por nombre ya que los IDs pueden no coincidir
        if (selectedAbilities.some((a) => a.name === abilityName)) {
          element.classList.add("selected")
        }
      })
    }, 500)
  }

  // Actualizar vista previa
  updatePreview()
}

function getFormData() {
  return {
    name: characterNameInput.value,
    race: characterRaceSelect.value,
    class: characterClassSelect.value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || "Masculino",
    background: characterBackgroundTextarea.value,
    stats: {
      strength: Number.parseInt(document.getElementById("statStrength").value),
      ki: Number.parseInt(document.getElementById("statKi").value),
      combatMastery: Number.parseInt(document.getElementById("statCombatMastery").value),
      intelligence: Number.parseInt(document.getElementById("statIntelligence").value),
      combatIntelligence: Number.parseInt(document.getElementById("statCombatIntelligence").value),
      constitution: Number.parseInt(document.getElementById("statConstitution").value),
    },
    equipment: {
      weapon: characterWeaponSelect.value,
      armor: characterArmorSelect.value,
      accessory: characterAccessorySelect.value,
    },
    abilities: selectedAbilities,
  }
}

async function handleFormSubmit(event) {
  event.preventDefault()

  // Validar formulario
  if (!validateForm()) {
    return
  }

  // Mostrar indicador de carga
  showLoading(true)

  // Obtener datos del formulario
  const characterData = getFormData()

  try {
    // Actualizar en MockAPI
    const response = await fetch(`${MOCKAPI_URL}/${characterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: characterData.name,
        Raza: characterData.race,
        Clase: characterData.class,
        Genero: characterData.gender,
        Historia: characterData.background,
        Equipamiento: {
          Arma: characterData.equipment.weapon,
          Armadura: characterData.equipment.armor,
          Accesorio: characterData.equipment.accessory,
        },
        Estadisticas: characterData.stats,
        "Hechizos-Ki": characterData.abilities.map((ability) => ({
          nombre: ability.name,
          descripcion: ability.description,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el personaje")
    }

    // Mostrar modal de confirmación
    saveModal.classList.add("active")
  } catch (error) {
    console.error("Error:", error)
    alert("Hubo un error al actualizar el personaje. Por favor, intenta de nuevo.")
  } finally {
    // Ocultar indicador de carga
    showLoading(false)
  }
}

function validateForm() {
  // Validar campos requeridos
  if (!characterNameInput.value) {
    alert("Por favor, ingresa un nombre para tu personaje.")
    characterNameInput.focus()
    return false
  }

  if (!characterRaceSelect.value) {
    alert("Por favor, selecciona una raza para tu personaje.")
    characterRaceSelect.focus()
    return false
  }

  if (!characterClassSelect.value) {
    alert("Por favor, selecciona una clase para tu personaje.")
    characterClassSelect.focus()
    return false
  }

  return true
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
