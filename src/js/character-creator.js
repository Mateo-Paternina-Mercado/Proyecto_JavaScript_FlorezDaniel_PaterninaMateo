// Constantes y configuración
const MOCKAPI_URL = "https://67fe6eb758f18d7209ee325e.mockapi.io/characters"
const LOCAL_STORAGE_KEY = "dbs_character_draft"

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
const saveModal = document.getElementById("saveModal")
const viewCharactersBtn = document.getElementById("viewCharactersBtn")
const createAnotherBtn = document.getElementById("createAnotherBtn")

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
document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos desde APIs
  fetchRaces()
  fetchClasses()
  fetchEquipment()

  // Cargar datos guardados en localStorage
  loadFromLocalStorage()

  // Configurar eventos
  setupEventListeners()
})

// Funciones para cargar datos
async function fetchRaces() {
  try {
    // En un caso real, esto vendría de una API externa
    // Por ahora, usamos datos simulados de Dragon Ball Super
    const racesData = [
      {
        id: 1,
        name: "Saiyan",
        description: "Guerreros poderosos con la capacidad de transformarse. Obtienen bonificación en Fuerza y Ki.",
      },
      {
        id: 2,
        name: "Namekiano",
        description:
          "Seres sabios con capacidad de regeneración. Obtienen bonificación en Inteligencia y Constitución.",
      },
      {
        id: 3,
        name: "Humano",
        description: "Adaptables y versátiles. Obtienen bonificación en todas las estadísticas.",
      },
      {
        id: 4,
        name: "Androide",
        description:
          "Creaciones tecnológicas con energía ilimitada. Obtienen bonificación en Ki y Maestría en Combate.",
      },
      {
        id: 5,
        name: "Majin",
        description: "Criaturas mágicas con cuerpos maleables. Obtienen bonificación en Constitución y Ki.",
      },
      {
        id: 6,
        name: "Raza de Freezer",
        description:
          "Seres con gran poder natural y múltiples transformaciones. Obtienen bonificación en Ki e Inteligencia en Combate.",
      },
    ]

    races = racesData
    populateRaceSelect()
  } catch (error) {
    console.error("Error al cargar las razas:", error)
  }
}

async function fetchClasses() {
  try {
    // Datos simulados de clases
    const classesData = [
      {
        id: 1,
        name: "Guerrero Z",
        description:
          "Luchadores dedicados al combate físico. Especialistas en técnicas de ki básicas y combate cuerpo a cuerpo.",
      },
      {
        id: 2,
        name: "Maestro de Ki",
        description:
          "Especialistas en manipulación de energía. Dominan técnicas de ki avanzadas y ataques a distancia.",
      },
      {
        id: 3,
        name: "Estratega",
        description: "Combatientes inteligentes que analizan al oponente. Obtienen ventajas tácticas en combate.",
      },
      {
        id: 4,
        name: "Defensor",
        description: "Especialistas en resistencia y protección. Pueden soportar grandes cantidades de daño.",
      },
      {
        id: 5,
        name: "Transformista",
        description: "Maestros de las transformaciones. Pueden cambiar de forma para aumentar su poder.",
      },
    ]

    classes = classesData
    populateClassSelect()
  } catch (error) {
    console.error("Error al cargar las clases:", error)
  }
}

async function fetchEquipment() {
  try {
    // Datos simulados de equipamiento
    weapons = [
      { id: 1, name: "Puños Desnudos", description: "El arma natural de todo guerrero." },
      { id: 2, name: "Bastón Extensible", description: "Un bastón mágico que puede extenderse a voluntad." },
      { id: 3, name: "Espada Z", description: "Una espada capaz de canalizar el ki del usuario." },
      { id: 4, name: "Bastón Sagrado", description: "Un bastón antiguo con propiedades místicas." },
      { id: 5, name: "Guantes de Ki", description: "Guantes que amplifican el poder de los ataques de ki." },
    ]

    armors = [
      { id: 1, name: "Gi de Entrenamiento", description: "Uniforme ligero ideal para el movimiento." },
      { id: 2, name: "Armadura Saiyan", description: "Armadura flexible y resistente de tecnología alienígena." },
      { id: 3, name: "Ropa Pesada", description: "Ropa con peso para entrenamiento que aumenta la resistencia." },
      { id: 4, name: "Traje de Combate", description: "Traje diseñado para maximizar la movilidad en combate." },
      { id: 5, name: "Armadura de la Patrulla Galáctica", description: "Armadura oficial con protección avanzada." },
    ]

    accessories = [
      { id: 1, name: "Semilla del Ermitaño", description: "Restaura completamente la salud y energía." },
      { id: 2, name: "Radar del Dragón", description: "Dispositivo para localizar las esferas del dragón." },
      { id: 3, name: "Anillo de Ki", description: "Aumenta la regeneración de ki durante el combate." },
      { id: 4, name: "Pendientes Potara", description: "Permite la fusión con otro guerrero." },
      { id: 5, name: "Báculo Sagrado", description: "Antiguo báculo con propiedades místicas." },
    ]

    populateEquipmentSelects()
  } catch (error) {
    console.error("Error al cargar el equipamiento:", error)
  }
}

function fetchSpecialAbilities(race, characterClass) {
  // Simulamos la obtención de habilidades basadas en la raza y clase seleccionadas
  if (!race || !characterClass) return []

  const raceAbilities = {
    Saiyan: [
      { id: 1, name: "Zenkai", description: "Aumenta el poder después de recuperarse de heridas graves." },
      { id: 2, name: "Super Saiyan", description: "Transformación que aumenta drásticamente el poder." },
    ],
    Namekiano: [
      { id: 3, name: "Regeneración", description: "Capacidad de regenerar partes del cuerpo dañadas." },
      { id: 4, name: "Fusión Namekiana", description: "Capacidad de fusionarse con otro Namekiano." },
    ],
    Humano: [
      { id: 5, name: "Potencial Oculto", description: "Desbloquea el poder latente en situaciones críticas." },
      { id: 6, name: "Adaptabilidad", description: "Aprende técnicas nuevas con mayor facilidad." },
    ],
    Androide: [
      { id: 7, name: "Energía Ilimitada", description: "No se agota el ki en combates prolongados." },
      { id: 8, name: "Mejoras Tecnológicas", description: "Puede integrar mejoras a su cuerpo." },
    ],
    Majin: [
      { id: 9, name: "Cuerpo Elástico", description: "Puede estirar y deformar su cuerpo a voluntad." },
      { id: 10, name: "Absorción", description: "Puede absorber a otros seres para ganar sus habilidades." },
    ],
    "Raza de Freezer": [
      { id: 11, name: "Transformaciones", description: "Múltiples formas que liberan poder oculto." },
      { id: 12, name: "Supervivencia Espacial", description: "Puede sobrevivir en el vacío del espacio." },
    ],
  }

  const classAbilities = {
    "Guerrero Z": [
      { id: 13, name: "Kamehameha", description: "Poderoso rayo de energía concentrada." },
      { id: 14, name: "Kaioken", description: "Técnica que multiplica el poder a costa de tensión física." },
    ],
    "Maestro de Ki": [
      { id: 15, name: "Kikoho", description: "Potente ataque de ki que forma un triángulo de energía." },
      { id: 16, name: "Taiyoken", description: "Destello de luz que ciega temporalmente al oponente." },
    ],
    Estratega: [
      { id: 17, name: "Análisis de Combate", description: "Identifica puntos débiles del oponente." },
      { id: 18, name: "Contraataque", description: "Devuelve parte del daño recibido." },
    ],
    Defensor: [
      { id: 19, name: "Barrera de Ki", description: "Crea un escudo de energía protector." },
      { id: 20, name: "Resistencia Aumentada", description: "Reduce el daño recibido de ataques físicos." },
    ],
    Transformista: [
      { id: 21, name: "Transformación Avanzada", description: "Desbloquea una forma más poderosa." },
      { id: 22, name: "Control de Forma", description: "Mantiene transformaciones por más tiempo." },
    ],
  }

  return [...(raceAbilities[race] || []), ...(classAbilities[characterClass] || [])]
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

function populateSpecialAbilities() {
  const race = characterRaceSelect.value
  const characterClass = characterClassSelect.value

  if (!race || !characterClass) {
    specialAbilitiesContainer.innerHTML =
      '<p class="placeholder-text">Selecciona una raza y clase para ver las habilidades disponibles</p>'
    return
  }

  specialAbilities = fetchSpecialAbilities(race, characterClass)

  if (specialAbilities.length === 0) {
    specialAbilitiesContainer.innerHTML =
      '<p class="placeholder-text">No hay habilidades disponibles para esta combinación</p>'
    return
  }

  specialAbilitiesContainer.innerHTML = ""

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

function handleRaceChange() {
  const selectedRace = characterRaceSelect.value
  const raceData = races.find((race) => race.name === selectedRace)

  if (raceData) {
    raceDescriptionDiv.textContent = raceData.description

    // Actualizar imagen del personaje basada en la raza
    updateCharacterImage()
  } else {
    raceDescriptionDiv.textContent = ""
  }

  populateSpecialAbilities()
  updatePreview()
}

function handleClassChange() {
  const selectedClass = characterClassSelect.value
  const classData = classes.find((cls) => cls.name === selectedClass)

  if (classData) {
    classDescriptionDiv.textContent = classData.description
  } else {
    classDescriptionDiv.textContent = ""
  }

  populateSpecialAbilities()
  updatePreview()
}

function toggleAbility(ability, element) {
  const index = selectedAbilities.findIndex((a) => a.id === ability.id)

  if (index === -1) {
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

    // Generar valores aleatorios para cada estadística (3d6)
    const stats = {
      strength: rollStat(),
      ki: rollStat(),
      combatMastery: rollStat(),
      intelligence: rollStat(),
      combatIntelligence: rollStat(),
      constitution: rollStat(),
    }

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

function rollStat() {
  // Simular 3d6 (3 dados de 6 caras)
  return Math.floor(Math.random() * 10) + 10 // Simplificado para valores entre 10-19
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
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "Masculino"

  // En un caso real, tendríamos imágenes para cada combinación de raza y género
  // Por ahora, usamos imágenes de placeholder basadas en la raza
  const imagePath = "../assets/character-placeholder.png"

  if (race) {
    // Aquí podrías tener lógica para seleccionar la imagen correcta
    // Por ejemplo: imagePath = `../assets/races/${race.toLowerCase()}_${gender.toLowerCase()}.png`;
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
    selectedAbilities = data.abilities
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
      throw new Error("Error al guardar el personaje")
    }

    // Limpiar localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY)

    // Mostrar modal de confirmación
    saveModal.classList.add("active")
  } catch (error) {
    console.error("Error:", error)
    alert("Hubo un error al guardar el personaje. Por favor, intenta de nuevo.")
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

function resetForm() {
  characterForm.reset()
  selectedAbilities = []

  // Restablecer estadísticas
  document.getElementById("statStrength").value = 10
  document.getElementById("statKi").value = 10
  document.getElementById("statCombatMastery").value = 10
  document.getElementById("statCombatIntelligence").value = 10
  document.getElementById("statIntelligence").value = 10
  document.getElementById("statConstitution").value = 10

  updateStatBars()

  // Limpiar descripciones
  raceDescriptionDiv.textContent = ""
  classDescriptionDiv.textContent = ""

  // Limpiar habilidades
  specialAbilitiesContainer.innerHTML =
    '<p class="placeholder-text">Selecciona una raza y clase para ver las habilidades disponibles</p>'

  // Actualizar vista previa
  updatePreview()
}
