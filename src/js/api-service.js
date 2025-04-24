// API Service for Dragon Ball Super D&D Character Creator
// This service handles all API calls to D&D 5e API and Dragon Ball API

const DND_API_BASE_URL = "https://www.dnd5eapi.co/api"
const DRAGONBALL_API_BASE_URL = "https://www.dragonball-api.com/api/v1"

// Cache API responses to reduce API calls
const apiCache = {
  races: null,
  classes: null,
  equipment: null,
  characters: null,
  planets: null,
  transformations: null,
}

/**
 * Fetch data from D&D 5e API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - API response
 */
async function fetchDndData(endpoint) {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/${endpoint}`)

    if (!response.ok) {
      throw new Error(`D&D API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching from D&D API:", error)
    return null
  }
}

/**
 * Fetch data from Dragon Ball API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - API response
 */
async function fetchDragonBallData(endpoint) {
  try {
    const response = await fetch(`${DRAGONBALL_API_BASE_URL}/${endpoint}`)

    if (!response.ok) {
      throw new Error(`Dragon Ball API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching from Dragon Ball API:", error)
    return null
  }
}

/**
 * Get races from APIs and adapt them to the application format
 * @returns {Promise<Array>} - Formatted races data
 */
async function getRaces() {
  // Return cached data if available
  if (apiCache.races) {
    return apiCache.races
  }

  // Try to get races from Dragon Ball API first
  const dbCharacters = await fetchDragonBallData("characters?limit=100")
  const dbPlanets = await fetchDragonBallData("planets")

  // Fallback to D&D races if Dragon Ball API fails
  const dndRaces = await fetchDndData("races")

  let races = []

  if (dbCharacters && dbCharacters.items) {
    // Extract unique races from Dragon Ball characters
    const raceMap = new Map()

    dbCharacters.items.forEach((character) => {
      if (character.race && !raceMap.has(character.race)) {
        raceMap.set(character.race, {
          id: raceMap.size + 1,
          name: character.race,
          description: `Race from the Dragon Ball universe.`,
          imageUrl: character.image || "../assets/races/placeholder.png",
        })
      }
    })

    // Add Saiyan if not already included
    if (!raceMap.has("Saiyan")) {
      raceMap.set("Saiyan", {
        id: raceMap.size + 1,
        name: "Saiyan",
        description: "Warrior race with great power and the ability to transform.",
        imageUrl: "../assets/races/saiyan.png",
      })
    }

    // Add Namekian if not already included
    if (!raceMap.has("Namekian")) {
      raceMap.set("Namekian", {
        id: raceMap.size + 1,
        name: "Namekian",
        description: "Green-skinned humanoids with regenerative abilities from Planet Namek.",
        imageUrl: "../assets/races/namekian.png",
      })
    }

    races = Array.from(raceMap.values())
  } else if (dndRaces && dndRaces.results) {
    // Adapt D&D races to Dragon Ball universe
    const dndRacePromises = dndRaces.results.map(async (race) => {
      const raceDetails = await fetchDndData(`races/${race.index}`)

      // Map D&D races to Dragon Ball equivalents
      const dragonBallRace = {
        id: race.index,
        name: race.name,
        description: raceDetails ? raceDetails.alignment : "",
        imageUrl: "../assets/races/placeholder.png",
      }

      // Custom mapping for some races
      switch (race.name) {
        case "Dragonborn":
          dragonBallRace.name = "Saiyan"
          dragonBallRace.description = "Warrior race with great power and the ability to transform."
          dragonBallRace.imageUrl = "../assets/races/saiyan.png"
          break
        case "Elf":
          dragonBallRace.name = "Namekian"
          dragonBallRace.description = "Green-skinned humanoids with regenerative abilities from Planet Namek."
          dragonBallRace.imageUrl = "../assets/races/namekian.png"
          break
        case "Human":
          dragonBallRace.name = "Human"
          dragonBallRace.description = "Adaptable and resilient beings from Earth."
          dragonBallRace.imageUrl = "../assets/races/human.png"
          break
        case "Gnome":
          dragonBallRace.name = "Majin"
          dragonBallRace.description = "Magical beings with elastic bodies and incredible regeneration."
          dragonBallRace.imageUrl = "../assets/races/majin.png"
          break
        case "Half-Orc":
          dragonBallRace.name = "Android"
          dragonBallRace.description = "Cybernetically enhanced beings with unlimited energy."
          dragonBallRace.imageUrl = "../assets/races/android.png"
          break
        case "Tiefling":
          dragonBallRace.name = "Raza de Freezer"
          dragonBallRace.description = "Powerful alien race capable of surviving in space and transforming."
          dragonBallRace.imageUrl = "../assets/races/frieza.png"
          break
        case "Halfling":
          dragonBallRace.name = "Halfling"
          dragonBallRace.description = "Small but brave folk known for their luck and stealth."
          dragonBallRace.imageUrl = "../assets/races/halfling.png"
          break
        case "Half-Elf":
          dragonBallRace.name = "Half-Elf"
          dragonBallRace.description = "Beings with both human and elven heritage, combining the best of both worlds."
          dragonBallRace.imageUrl = "../assets/races/half-elf.png"
          break
        case "Dwarf":
          dragonBallRace.name = "Dwarf"
          dragonBallRace.description = "Stout and sturdy folk with natural mining and crafting abilities."
          dragonBallRace.imageUrl = "../assets/races/dwarf.png"
          break
      }

      return dragonBallRace
    })

    races = await Promise.all(dndRacePromises)
  }

  // If both APIs fail, use fallback data
  if (races.length === 0) {
    races = [
      {
        id: 1,
        name: "Saiyan",
        description: "Warrior race with great power and the ability to transform.",
        imageUrl: "../assets/races/saiyan.png",
      },
      {
        id: 2,
        name: "Namekian",
        description: "Green-skinned humanoids with regenerative abilities from Planet Namek.",
        imageUrl: "../assets/races/namekian.png",
      },
      {
        id: 3,
        name: "Human",
        description: "Adaptable and resilient beings from Earth.",
        imageUrl: "../assets/races/human.png",
      },
      {
        id: 4,
        name: "Android",
        description: "Cybernetically enhanced beings with unlimited energy.",
        imageUrl: "../assets/races/android.png",
      },
      {
        id: 5,
        name: "Majin",
        description: "Magical beings with elastic bodies and incredible regeneration.",
        imageUrl: "../assets/races/majin.png",
      },
      {
        id: 6,
        name: "Raza de Freezer",
        description: "Powerful alien race capable of surviving in space and transforming.",
        imageUrl: "../assets/races/frieza.png",
      },
      {
        id: 7,
        name: "Halfling",
        description: "Small but brave folk known for their luck and stealth.",
        imageUrl: "../assets/races/halfling.png",
      },
      {
        id: 8,
        name: "Half-Elf",
        description: "Beings with both human and elven heritage, combining the best of both worlds.",
        imageUrl: "../assets/races/half-elf.png",
      },
      {
        id: 9,
        name: "Dwarf",
        description: "Stout and sturdy folk with natural mining and crafting abilities.",
        imageUrl: "../assets/races/dwarf.png",
      },
    ]
  }

  // Cache the results
  apiCache.races = races
  return races
}

/**
 * Get classes from APIs and adapt them to the application format
 * @returns {Promise<Array>} - Formatted classes data
 */
async function getClasses() {
  // Return cached data if available
  if (apiCache.classes) {
    return apiCache.classes
  }

  // Try to get transformations from Dragon Ball API
  const dbTransformations = await fetchDragonBallData("transformations")

  // Fallback to D&D classes
  const dndClasses = await fetchDndData("classes")

  let classes = []

  if (dbTransformations && dbTransformations.items) {
    // Use transformations as inspiration for classes
    classes = dbTransformations.items.slice(0, 5).map((transformation, index) => {
      return {
        id: index + 1,
        name: transformation.name,
        description: transformation.description || "A powerful fighting style from the Dragon Ball universe.",
        imageUrl: transformation.image || `../assets/classes/placeholder.png`,
      }
    })
  } else if (dndClasses && dndClasses.results) {
    // Adapt D&D classes to Dragon Ball universe
    const dndClassPromises = dndClasses.results.slice(0, 5).map(async (dndClass, index) => {
      const classDetails = await fetchDndData(`classes/${dndClass.index}`)

      // Map D&D classes to Dragon Ball equivalents
      const dragonBallClass = {
        id: index + 1,
        name: dndClass.name,
        description: classDetails ? classDetails.subclasses[0]?.name : "",
        imageUrl: "../assets/classes/placeholder.png",
      }

      // Custom mapping for some classes
      switch (dndClass.name) {
        case "Barbarian":
          dragonBallClass.name = "Guerrero Z"
          dragonBallClass.description = "Fighters dedicated to physical combat and basic ki techniques."
          dragonBallClass.imageUrl = "../assets/classes/warrior.png"
          break
        case "Monk":
          dragonBallClass.name = "Maestro de Ki"
          dragonBallClass.description = "Energy manipulation specialists who master advanced ki techniques."
          dragonBallClass.imageUrl = "../assets/classes/ki-master.png"
          break
        case "Fighter":
          dragonBallClass.name = "Estratega"
          dragonBallClass.description = "Intelligent fighters who analyze opponents and gain tactical advantages."
          dragonBallClass.imageUrl = "../assets/classes/strategist.png"
          break
        case "Paladin":
          dragonBallClass.name = "Defensor"
          dragonBallClass.description = "Specialists in resistance and protection who can withstand great damage."
          dragonBallClass.imageUrl = "../assets/classes/defender.png"
          break
        case "Sorcerer":
          dragonBallClass.name = "Transformista"
          dragonBallClass.description = "Masters of transformation who can change form to increase their power."
          dragonBallClass.imageUrl = "../assets/classes/transformer.png"
          break
      }

      return dragonBallClass
    })

    classes = await Promise.all(dndClassPromises)
  }

  // If both APIs fail, use fallback data
  if (classes.length === 0) {
    classes = [
      {
        id: 1,
        name: "Guerrero Z",
        description: "Fighters dedicated to physical combat and basic ki techniques.",
        imageUrl: "../assets/classes/warrior.png",
      },
      {
        id: 2,
        name: "Maestro de Ki",
        description: "Energy manipulation specialists who master advanced ki techniques.",
        imageUrl: "../assets/classes/ki-master.png",
      },
      {
        id: 3,
        name: "Estratega",
        description: "Intelligent fighters who analyze opponents and gain tactical advantages.",
        imageUrl: "../assets/classes/strategist.png",
      },
      {
        id: 4,
        name: "Defensor",
        description: "Specialists in resistance and protection who can withstand great damage.",
        imageUrl: "../assets/classes/defender.png",
      },
      {
        id: 5,
        name: "Transformista",
        description: "Masters of transformation who can change form to increase their power.",
        imageUrl: "../assets/classes/transformer.png",
      },
    ]
  }

  // Cache the results
  apiCache.classes = classes
  return classes
}

/**
 * Get equipment from D&D API and adapt it to the application format
 * @returns {Promise<Object>} - Formatted equipment data
 */
async function getEquipment() {
  // Return cached data if available
  if (apiCache.equipment) {
    return apiCache.equipment
  }

  // Get equipment from D&D API
  const dndWeapons = await fetchDndData("equipment-categories/weapon")
  const dndArmor = await fetchDndData("equipment-categories/armor")
  const dndAdventuringGear = await fetchDndData("equipment-categories/adventuring-gear")

  let weapons = []
  let armors = []
  let accessories = []

  // Process weapons
  if (dndWeapons && dndWeapons.equipment) {
    weapons = await Promise.all(
      dndWeapons.equipment.slice(0, 5).map(async (item, index) => {
        const weaponDetails = await fetchDndData(`equipment/${item.index}`)

        return {
          id: index + 1,
          name: adaptEquipmentName(item.name, "weapon"),
          description: weaponDetails ? weaponDetails.desc.join(" ") : "A powerful weapon.",
        }
      }),
    )
  }

  // Process armor
  if (dndArmor && dndArmor.equipment) {
    armors = await Promise.all(
      dndArmor.equipment.slice(0, 5).map(async (item, index) => {
        const armorDetails = await fetchDndData(`equipment/${item.index}`)

        return {
          id: index + 1,
          name: adaptEquipmentName(item.name, "armor"),
          description: armorDetails ? armorDetails.desc.join(" ") : "Protective armor.",
        }
      }),
    )
  }

  // Process accessories
  if (dndAdventuringGear && dndAdventuringGear.equipment) {
    accessories = await Promise.all(
      dndAdventuringGear.equipment.slice(0, 5).map(async (item, index) => {
        const accessoryDetails = await fetchDndData(`equipment/${item.index}`)

        return {
          id: index + 1,
          name: adaptEquipmentName(item.name, "accessory"),
          description: accessoryDetails ? accessoryDetails.desc.join(" ") : "A useful accessory.",
        }
      }),
    )
  }

  // If API fails, use fallback data
  if (weapons.length === 0) {
    weapons = [
      { id: 1, name: "Puños Desnudos", description: "El arma natural de todo guerrero." },
      { id: 2, name: "Bastón Extensible", description: "Un bastón mágico que puede extenderse a voluntad." },
      { id: 3, name: "Espada Z", description: "Una espada capaz de canalizar el ki del usuario." },
      { id: 4, name: "Bastón Sagrado", description: "Un bastón antiguo con propiedades místicas." },
      { id: 5, name: "Guantes de Ki", description: "Guantes que amplifican el poder de los ataques de ki." },
    ]
  }

  if (armors.length === 0) {
    armors = [
      { id: 1, name: "Gi de Entrenamiento", description: "Uniforme ligero ideal para el movimiento." },
      { id: 2, name: "Armadura Saiyan", description: "Armadura flexible y resistente de tecnología alienígena." },
      { id: 3, name: "Ropa Pesada", description: "Ropa con peso para entrenamiento que aumenta la resistencia." },
      { id: 4, name: "Traje de Combate", description: "Traje diseñado para maximizar la movilidad en combate." },
      { id: 5, name: "Armadura de la Patrulla Galáctica", description: "Armadura oficial con protección avanzada." },
    ]
  }

  if (accessories.length === 0) {
    accessories = [
      { id: 1, name: "Semilla del Ermitaño", description: "Restaura completamente la salud y energía." },
      { id: 2, name: "Radar del Dragón", description: "Dispositivo para localizar las esferas del dragón." },
      { id: 3, name: "Anillo de Ki", description: "Aumenta la regeneración de ki durante el combate." },
      { id: 4, name: "Pendientes Potara", description: "Permite la fusión con otro guerrero." },
      { id: 5, name: "Báculo Sagrado", description: "Antiguo báculo con propiedades místicas." },
    ]
  }

  const equipment = { weapons, armors, accessories }

  // Cache the results
  apiCache.equipment = equipment
  return equipment
}

/**
 * Get special abilities based on race and class
 * @param {string} race - Character race
 * @param {string} characterClass - Character class
 * @returns {Promise<Array>} - Special abilities
 */
async function getSpecialAbilities(race, characterClass) {
  // Try to get spells from D&D API
  const dndSpells = await fetchDndData("spells")

  // Try to get transformations from Dragon Ball API
  const dbTransformations = await fetchDragonBallData("transformations")

  let raceAbilities = []
  let classAbilities = []

  // Generate race abilities
  if (race) {
    if (dbTransformations && dbTransformations.items) {
      // Find transformations related to the race
      const raceTransformations = dbTransformations.items
        .filter((t) => t.name.includes(race) || (race === "Saiyan" && t.name.includes("Super")))
        .slice(0, 2)

      raceAbilities = raceTransformations.map((transformation, index) => ({
        id: index + 1,
        name: transformation.name,
        description: transformation.description || `A powerful ability of the ${race} race.`,
      }))
    }

    // If no transformations found, use fallback data
    if (raceAbilities.length === 0) {
      switch (race) {
        case "Saiyan":
          raceAbilities = [
            { id: 1, name: "Zenkai", description: "Aumenta el poder después de recuperarse de heridas graves." },
            { id: 2, name: "Super Saiyan", description: "Transformación que aumenta drásticamente el poder." },
          ]
          break
        case "Namekian":
          raceAbilities = [
            { id: 3, name: "Regeneración", description: "Capacidad de regenerar partes del cuerpo dañadas." },
            { id: 4, name: "Fusión Namekiana", description: "Capacidad de fusionarse con otro Namekiano." },
          ]
          break
        case "Human":
          raceAbilities = [
            { id: 5, name: "Potencial Oculto", description: "Desbloquea el poder latente en situaciones críticas." },
            { id: 6, name: "Adaptabilidad", description: "Aprende técnicas nuevas con mayor facilidad." },
          ]
          break
        case "Android":
          raceAbilities = [
            { id: 7, name: "Energía Ilimitada", description: "No se agota el ki en combates prolongados." },
            { id: 8, name: "Mejoras Tecnológicas", description: "Puede integrar mejoras a su cuerpo." },
          ]
          break
        case "Majin":
          raceAbilities = [
            { id: 9, name: "Cuerpo Elástico", description: "Puede estirar y deformar su cuerpo a voluntad." },
            { id: 10, name: "Absorción", description: "Puede absorber a otros seres para ganar sus habilidades." },
          ]
          break
        case "Raza de Freezer":
          raceAbilities = [
            { id: 11, name: "Transformaciones", description: "Múltiples formas que liberan poder oculto." },
            { id: 12, name: "Supervivencia Espacial", description: "Puede sobrevivir en el vacío del espacio." },
          ]
          break
        default:
          raceAbilities = [
            { id: 1, name: `Habilidad de ${race}`, description: `Una habilidad especial de la raza ${race}.` },
            { id: 2, name: `Poder de ${race}`, description: `Un poder único de la raza ${race}.` },
          ]
      }
    }
  }

  // Generate class abilities
  if (characterClass) {
    if (dndSpells && dndSpells.results) {
      // Get random spells from D&D API
      const randomSpells = dndSpells.results.sort(() => 0.5 - Math.random()).slice(0, 2)

      const spellPromises = randomSpells.map(async (spell, index) => {
        const spellDetails = await fetchDndData(`spells/${spell.index}`)

        return {
          id: index + 13, // Start from 13 to avoid conflicts with race abilities
          name: adaptSpellName(spell.name),
          description: spellDetails ? spellDetails.desc[0] : `A powerful technique of the ${characterClass} class.`,
        }
      })

      classAbilities = await Promise.all(spellPromises)
    }

    // If no spells found, use fallback data
    if (classAbilities.length === 0) {
      switch (characterClass) {
        case "Guerrero Z":
          classAbilities = [
            { id: 13, name: "Kamehameha", description: "Poderoso rayo de energía concentrada." },
            { id: 14, name: "Kaioken", description: "Técnica que multiplica el poder a costa de tensión física." },
          ]
          break
        case "Maestro de Ki":
          classAbilities = [
            { id: 15, name: "Kikoho", description: "Potente ataque de ki que forma un triángulo de energía." },
            { id: 16, name: "Taiyoken", description: "Destello de luz que ciega temporalmente al oponente." },
          ]
          break
        case "Estratega":
          classAbilities = [
            { id: 17, name: "Análisis de Combate", description: "Identifica puntos débiles del oponente." },
            { id: 18, name: "Contraataque", description: "Devuelve parte del daño recibido." },
          ]
          break
        case "Defensor":
          classAbilities = [
            { id: 19, name: "Barrera de Ki", description: "Crea un escudo de energía protector." },
            { id: 20, name: "Resistencia Aumentada", description: "Reduce el daño recibido de ataques físicos." },
          ]
          break
        case "Transformista":
          classAbilities = [
            { id: 21, name: "Transformación Avanzada", description: "Desbloquea una forma más poderosa." },
            { id: 22, name: "Control de Forma", description: "Mantiene transformaciones por más tiempo." },
          ]
          break
        default:
          classAbilities = [
            {
              id: 13,
              name: `Técnica de ${characterClass}`,
              description: `Una técnica especial de la clase ${characterClass}.`,
            },
            {
              id: 14,
              name: `Poder de ${characterClass}`,
              description: `Un poder único de la clase ${characterClass}.`,
            },
          ]
      }
    }
  }

  return [...raceAbilities, ...classAbilities]
}

/**
 * Adapt equipment names to fit Dragon Ball universe
 * @param {string} name - Original equipment name
 * @param {string} type - Equipment type (weapon, armor, accessory)
 * @returns {string} - Adapted name
 */
function adaptEquipmentName(name, type) {
  // Map common D&D equipment names to Dragon Ball equivalents
  const weaponMap = {
    Quarterstaff: "Bastón Extensible",
    Club: "Bastón de Combate",
    Dagger: "Cuchilla de Ki",
    Javelin: "Lanza de Energía",
    Spear: "Lanza de Namek",
    Greatclub: "Bastón Sagrado",
    Handaxe: "Hacha de Combate",
    "Light hammer": "Martillo de Ki",
    Mace: "Maza de Poder",
    Sickle: "Hoz de Energía",
    Battleaxe: "Hacha de Batalla Z",
    Flail: "Cadena de Ki",
    Glaive: "Espada Z",
    Greatsword: "Espada de Trunks",
    Longsword: "Espada de Tapion",
  }

  const armorMap = {
    Padded: "Gi de Entrenamiento",
    Leather: "Traje de Combate",
    "Studded leather": "Armadura Ligera",
    Hide: "Ropa Pesada",
    "Chain shirt": "Armadura Saiyan",
    "Scale mail": "Armadura de Combate",
    Breastplate: "Armadura de la Patrulla Galáctica",
    "Half plate": "Armadura de Élite",
    "Ring mail": "Armadura de Freezer",
    "Chain mail": "Armadura de Vegeta",
    Splint: "Armadura de Nappa",
    Plate: "Armadura Real Saiyan",
  }

  const accessoryMap = {
    Amulet: "Radar del Dragón",
    Potion: "Semilla del Ermitaño",
    Ring: "Anillo de Ki",
    Rod: "Báculo Sagrado",
    Scroll: "Pergamino de Técnicas",
    Wand: "Cetro de Poder",
    Orb: "Esfera del Dragón",
    Crystal: "Cristal de Ki",
    Staff: "Báculo Mágico",
    Backpack: "Mochila de Viaje",
    "Ball bearings": "Esferas de Entrenamiento",
    Bedroll: "Saco de Dormir",
    Bell: "Campana de Alerta",
    Blanket: "Manta de Descanso",
    "Block and tackle": "Equipo de Escalada",
  }

  // Select the appropriate map based on equipment type
  let map
  switch (type) {
    case "weapon":
      map = weaponMap
      break
    case "armor":
      map = armorMap
      break
    case "accessory":
      map = accessoryMap
      break
    default:
      return name
  }

  // Return the mapped name or the original name if no mapping exists
  return map[name] || name
}

/**
 * Adapt spell names to fit Dragon Ball universe
 * @param {string} name - Original spell name
 * @returns {string} - Adapted name
 */
function adaptSpellName(name) {
  // Map common D&D spell names to Dragon Ball techniques
  const spellMap = {
    Fireball: "Bola de Fuego Ki",
    "Magic Missile": "Ráfaga de Ki",
    "Lightning Bolt": "Rayo Eléctrico",
    Shield: "Barrera de Ki",
    "Mage Armor": "Armadura de Ki",
    "Burning Hands": "Manos Ardientes",
    Thunderwave: "Onda de Choque",
    "Detect Magic": "Detección de Ki",
    "Feather Fall": "Vuelo Controlado",
    Jump: "Super Salto",
    Invisibility: "Técnica de Invisibilidad",
    Fly: "Técnica de Vuelo",
    Haste: "Velocidad Aumentada",
    Slow: "Ralentización de Tiempo",
    Stoneskin: "Piel de Acero",
    Teleport: "Teletransportación",
    Wish: "Invocación del Dragón",
    "Meteor Swarm": "Lluvia de Meteoros Ki",
    "Time Stop": "Congelación Temporal",
    "Power Word Kill": "Palabra de Poder Mortal",
  }

  // Return the mapped name or the original name if no mapping exists
  return spellMap[name] || name
}

// Make functions available globally
window.getRaces = getRaces
window.getClasses = getClasses
window.getEquipment = getEquipment
window.getSpecialAbilities = getSpecialAbilities
