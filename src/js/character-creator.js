// Constantes y configuración
// Modified to use global functions instead of imports
// import { getRaces, getClasses, getEquipment, getSpecialAbilities } from "./api-service.js"

const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const LOCAL_STORAGE_KEY = "dbs_character_draft"
const MAX_TOTAL_STATS = 70 // Máximo total de puntos de estadísticas
const MAX_ABILITIES = 2 // Máximo de habilidades seleccionables

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
const saveLocalBtn = document.getElementById("saveLocalBtn")
const saveCharacterBtn = document.getElementById("saveCharacterBtn")
const backToDashboardBtn = document.getElementById("backToDashboard")
const specialAbilitiesContainer = document.getElementById("specialAbilitiesContainer")
const characterWeaponSelect = document.getElementById("characterWeapon")
const characterArmorSelect = document.getElementById("characterArmor")
const characterAccessorySelect = document.getElementById("characterAccessory")
const characterBackgroundTextarea = document.getElementById("characterBackground")
const saveModal = document.getElementById("saveModal")
const viewCharactersBtn = document.getElementById("viewCharactersBtn")
const createAnotherBtn = document.getElementById("createAnotherBtn")
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

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
  // Mostrar indicador de carga
  showLoading(true)

  try {
    // Cargar datos desde APIs
    await fetchRaces()
    await fetchClasses()
    await fetchEquipment()

    // Cargar datos guardados en localStorage
    loadFromLocalStorage()

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

// Funciones para cargar datos
async function fetchRaces() {
  try {
    races = await window.getRaces()
    populateRaceSelect()
  } catch (error) {
    console.error("Error al cargar las razas:", error)
    races = [] // Asegurar que races sea un array aunque falle
  }
}

async function fetchClasses() {
  try {
    classes = await window.getClasses()
    populateClassSelect()
  } catch (error) {
    console.error("Error al cargar las clases:", error)
    classes = [] // Asegurar que classes sea un array aunque falle
  }
}

async function fetchEquipment() {
  try {
    const equipment = await window.getEquipment()
    weapons = equipment.weapons || []
    armors = equipment.armors || []
    accessories = equipment.accessories || []
    populateEquipmentSelects()
  } catch (error) {
    console.error("Error al cargar el equipamiento:", error)
    weapons = []
    armors = []
    accessories = []
  }
}

async function fetchSpecialAbilities(race, characterClass) {
  try {
    return await window.getSpecialAbilities(race, characterClass)
  } catch (error) {
    console.error("Error al cargar las habilidades especiales:", error)
    return []
  }
}

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
    specialAbilities = await fetchSpecialAbilities(race, characterClass)

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

  // Eventos para guardar
  saveLocalBtn.addEventListener("click", saveToLocalStorage)
  characterForm.addEventListener("submit", handleFormSubmit)

  // Eventos para el modal
  viewCharactersBtn.addEventListener("click", () => (window.location.href = "dashboard.html"))
  createAnotherBtn.addEventListener("click", () => {
    saveModal.classList.remove("active")
    resetForm()
  })

  // Evento para volver al dashboard
  backToDashboardBtn.addEventListener("click", () => (window.location.href = "dashboard.html"))
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

// Funciones para guardar y cargar datos
function saveToLocalStorage() {
  const characterData = getFormData()
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characterData))

  // Mostrar mensaje de confirmación
  alert("Personaje guardado localmente. Puedes continuar más tarde.")
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (savedData) {
    const characterData = JSON.parse(savedData)
    populateFormWithData(characterData)
  }
}

function populateFormWithData(data) {
  // Rellenar campos básicos
  if (data.name) characterNameInput.value = data.name
  if (data.race) characterRaceSelect.value = data.race
  if (data.class) characterClassSelect.value = data.class

  // Género
  if (data.gender) {
    const genderInput = document.querySelector(`input[name="gender"][value="${data.gender}"]`)
    if (genderInput) genderInput.checked = true
  }

  // Historia de fondo
  if (data.background) {
    characterBackgroundTextarea.value = data.background
  }

  // Estadísticas
  if (data.stats) {
    if (data.stats.strength) document.getElementById("statStrength").value = data.stats.strength
    if (data.stats.ki) document.getElementById("statKi").value = data.stats.ki
    if (data.stats.combatMastery) document.getElementById("statCombatMastery").value = data.stats.combatMastery
    if (data.stats.intelligence) document.getElementById("statIntelligence").value = data.stats.intelligence
    if (data.stats.combatIntelligence)
      document.getElementById("statCombatIntelligence").value = data.stats.combatIntelligence
    if (data.stats.constitution) document.getElementById("statConstitution").value = data.stats.constitution

    updateStatBars()
  }

  // Equipamiento
  if (data.equipment) {
    if (data.equipment.weapon) characterWeaponSelect.value = data.equipment.weapon
    if (data.equipment.armor) characterArmorSelect.value = data.equipment.armor
    if (data.equipment.accessory) characterAccessorySelect.value = data.equipment.accessory
  }

  // Habilidades
  if (data.abilities) {
    selectedAbilities = data.abilities.slice(0, MAX_ABILITIES) // Limitar a MAX_ABILITIES
  }

  // Disparar eventos para actualizar descripciones y habilidades
  if (data.race) handleRaceChange()
  if (data.class) handleClassChange()

  // Actualizar vista previa
  updatePreview()
}

function getFormData() {
  return {
    name: characterNameInput.value,
    race: characterRaceSelect.value,
    class: characterClassSelect.value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || "Masculino",
    background: characterBackgroundTextarea ? characterBackgroundTextarea.value : "",
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
    // Guardar en MockAPI
    const response = await fetch(MOCKAPI_URL, {
      method: "POST",
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

    if (response.ok) {
      // Mostrar modal de éxito
      saveModal.classList.add("active")
    } else {
      console.error("Error al guardar el personaje:", response.status)
      alert("Error al guardar el personaje. Inténtalo de nuevo.")
    }
  } catch (error) {
    console.error("Error al enviar los datos:", error)
    alert("Error al guardar el personaje. Inténtalo de nuevo.")
  } finally {
    // Ocultar indicador de carga
    showLoading(false)
  }
}

// Funciones de validación
function validateForm() {
  let isValid = true

  if (characterNameInput.value.trim() === "") {
    alert("Por favor, introduce un nombre para el personaje.")
    isValid = false
  }

  if (characterRaceSelect.value === "") {
    alert("Por favor, selecciona una raza para el personaje.")
    isValid = false
  }

  if (characterClassSelect.value === "") {
    alert("Por favor, selecciona una clase para el personaje.")
    isValid = false
  }

  return isValid
}

// Función para resetear el formulario
function resetForm() {
  characterForm.reset()

  // Resetear descripciones
  raceDescriptionDiv.textContent = ""
  classDescriptionDiv.textContent = ""

  // Resetear habilidades seleccionadas
  selectedAbilities = []
  specialAbilitiesContainer.innerHTML =
    '<p class="placeholder-text">Selecciona una raza y clase para ver las habilidades disponibles</p>'

  // Resetear imagen
  characterImage.src = "../assets/character-placeholder.png"

  // Resetear las barras de progreso
  const stats = [
    { id: "statStrengthFill" },
    { id: "statKiFill" },
    { id: "statCombatMasteryFill" },
    { id: "statIntelligenceFill" },
    { id: "statCombatIntelligenceFill" },
    { id: "statConstitutionFill" },
  ]

  stats.forEach((stat) => {
    document.getElementById(stat.id).style.width = "0%"
  })

  // Actualizar la vista previa
  updatePreview()
}

// Función para mostrar/ocultar indicador de carga
function showLoading(show) {
  if (loadingIndicator) {
    loadingIndicator.style.display = show ? "flex" : "none"
  }
}
