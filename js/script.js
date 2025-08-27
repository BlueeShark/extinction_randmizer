const extinctionCustomization = {
  classe: ["Spécialiste en armes", "Blindé", "Ingénieur", "Médecin"],
  pistolets: ["1 : P226", "2 : M9A1", "3 : .44 Magnum", "4 : MP-443 Grach"],
  munitions: [
    "Normales",
    "Paralisante",
    "Incendiaires",
    "Explosives",
    "Perforantes",
    "Tueur de Cryptides",
  ],
  soutien: [
    "Explosifs d'équipe",
    "Instincts béstiale",
    "Armure",
    "Booster d'équipe",
    "Fournitures aléatoires",
  ],
  package: [
    "I.M.S.",
    "Frappes de mortier",
    "Trinity Rocket",
    "Tourelle automatique",
    "Drone vautour",
  ],
  egaliseur: [
    "Tourelle mitrailleuse portable",
    "Tourelle à grenades",
    "Shield",
    "Lance-roquettes MK32",
    "Death Machine",
  ],
};

const maps = [
  { nom: "Point of Contact", maxReliques: 7 },
  { nom: "Nightfall", maxReliques: 5 },
  { nom: "Mayday", maxReliques: 6 },
  { nom: "Awakening", maxReliques: 8 },
  { nom: "Exodus", maxReliques: 4 },
];

const reliques = [
  "1 Prends plus de dégâts",
  "2 Pistolets uniquement",
  "3 Portefeuille réduit",
  "4 Mortel",
  "5 Fais moins de dégâts",
  "6 Fragile",
  "7 Tiens ta position",
  "8 Pas de machines",
  "9 limitées",
  "10 Gagne ta croûte",
];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomUniqueItems(list, count) {
  const copy = [...list];
  const result = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

// Fonction pour répartir les reliques globales entre les joueurs
function repartirReliquesGlobales(nbReliquesTotal, nbJoueurs, maxReliquesParJoueur) {
  const repartition = new Array(nbJoueurs).fill(0);
  let reliquesRestantes = nbReliquesTotal;

  // Répartir les reliques de manière aléatoire
  while (reliquesRestantes > 0) {
    // Trouver les joueurs qui peuvent encore recevoir des reliques
    const joueursDisponibles = repartition
      .map((count, index) => ({ count, index }))
      .filter(joueur => joueur.count < maxReliquesParJoueur);

    if (joueursDisponibles.length === 0) break;

    // Choisir un joueur aléatoire parmi ceux disponibles
    const joueurAleatoire = joueursDisponibles[Math.floor(Math.random() * joueursDisponibles.length)];
    repartition[joueurAleatoire.index]++;
    reliquesRestantes--;
  }

  return repartition;
}

function generateRandomLoadout(doubleClasse = false, hasCryptidAmmo = true, nbReliques = 0) {
  const pistolet = randomItem(extinctionCustomization.pistolets);

  let classe;
  if (doubleClasse) {
    classe = randomUniqueItems(extinctionCustomization.classe, 2).join(" + ");
  } else {
    classe = randomItem(extinctionCustomization.classe);
  }

  const ammoPool = hasCryptidAmmo
    ? extinctionCustomization.munitions
    : extinctionCustomization.munitions.filter(
      (a) => a !== "Tueur de Cryptides"
    );
  const munitions = randomItem(ammoPool);

  const soutien = randomItem(extinctionCustomization.soutien);
  const package = randomItem(extinctionCustomization.package);
  const egaliseur = randomItem(extinctionCustomization.egaliseur);

  const reliquesTirees = randomUniqueItems(reliques, nbReliques);

  return {
    pistolet,
    classe,
    munitions,
    soutien,
    package,
    egaliseur,
    reliques: reliquesTirees,
  };
}

function displayLoadoutAnimated(loadout, ul) {
  for (const [key, value] of Object.entries(loadout)) {
    if (key === "reliques") {
      const reliqueLabel = document.createElement("li");
      reliqueLabel.textContent = `${value.length} Relique${value.length > 1 ? "s" : ""
        } :`;
      reliqueLabel.classList.add("reliques-label");
      ul.appendChild(reliqueLabel);

      if (value.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucune";
        li.classList.add("reliques-list");
        ul.appendChild(li);
      } else {
        const reliquesUl = document.createElement("ul");
        reliquesUl.classList.add("reliques-list");
        value.forEach((relique) => {
          const li = document.createElement("li");
          li.textContent = relique;
          reliquesUl.appendChild(li);
        });
        ul.appendChild(reliquesUl);
      }
    } else {
      const li = document.createElement("li");
      li.textContent = `${key} : ${value}`;
      ul.appendChild(li);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("randomButton");
  const inputMaxReliques = document.getElementById("maxReliques");
  const inputNumPlayers = document.getElementById("numPlayers");
  const playerConfigsContainer = document.getElementById("playerConfigs");
  const globalReliquesCheckbox = document.getElementById("globalReliques");
  const globalReliquesInfo = document.getElementById("globalReliquesInfo");
  const maxGlobalReliquesSpan = document.getElementById("maxGlobalReliques");
  const nbReliquesTotalInput = document.getElementById("nbReliquesTotal");
  const randomMapCheckbox = document.getElementById("randomMap");
  const mapInfo = document.getElementById("mapInfo");
  const selectedMapSpan = document.getElementById("selectedMap");
  const mapMaxReliquesSpan = document.getElementById("mapMaxReliques");
  const mapConfigsContainer = document.getElementById("mapConfigs");

  let selectedMap = null;

  // Fonction pour sélectionner une map aléatoire
  function selectRandomMap() {
    if (randomMapCheckbox.checked) {
      selectedMap = null; // Ne pas choisir la map maintenant
      mapInfo.style.display = "none";
      // Afficher la configuration des maps
      if (mapConfigsContainer) {
        mapConfigsContainer.style.display = "block";
      }
    } else {
      selectedMap = null;
      mapInfo.style.display = "none";
      // Masquer la configuration des maps
      if (mapConfigsContainer) {
        mapConfigsContainer.style.display = "none";
      }
    }
  }

  // Fonction pour créer l'interface de configuration des maps
  function createMapConfigs() {
    if (!mapConfigsContainer) return;

    mapConfigsContainer.innerHTML = "";
    mapConfigsContainer.style.display = "none"; // Masqué par défaut

    maps.forEach((map, index) => {
      const mapConfig = document.createElement("div");
      mapConfig.classList.add("map-config");
      mapConfig.style.marginBottom = "0.5rem";
      mapConfig.style.display = "flex";
      mapConfig.style.alignItems = "center";
      mapConfig.style.gap = "1rem";

      // Nom de la map
      const mapName = document.createElement("span");
      mapName.textContent = map.nom;
      mapName.style.color = "#ccc";
      mapName.style.fontWeight = "bold";
      mapName.style.minWidth = "120px";
      mapConfig.appendChild(mapName);

      // Label pour les reliques
      const reliquesLabel = document.createElement("label");
      reliquesLabel.textContent = "Max reliques:";
      reliquesLabel.style.color = "#ccc";
      reliquesLabel.style.fontSize = "0.9rem";
      mapConfig.appendChild(reliquesLabel);

      // Input pour les reliques
      const reliquesInput = document.createElement("input");
      reliquesInput.type = "number";
      reliquesInput.min = "0";
      reliquesInput.max = "10";
      reliquesInput.value = map.maxReliques;
      reliquesInput.style.width = "60px";
      reliquesInput.style.padding = "0.3rem";
      reliquesInput.style.border = "1px solid #660000";
      reliquesInput.style.borderRadius = "4px";
      reliquesInput.style.background = "#1a1a1a";
      reliquesInput.style.color = "#ff1a1a";
      reliquesInput.style.textAlign = "center";

      // Écouter les changements pour mettre à jour la map
      reliquesInput.addEventListener("change", (e) => {
        maps[index].maxReliques = parseInt(e.target.value, 10) || 0;
        if (selectedMap && selectedMap.nom === map.nom) {
          updateGlobalReliquesInfo();
        }
      });

      mapConfig.appendChild(reliquesInput);
      mapConfigsContainer.appendChild(mapConfig);
    });
  }

  // Fonction pour créer l'interface de configuration des joueurs
  function createPlayerConfigs() {
    const numPlayers = parseInt(inputNumPlayers.value, 10) || 1;
    playerConfigsContainer.innerHTML = "";

    for (let i = 1; i <= numPlayers; i++) {
      const playerConfig = document.createElement("div");
      playerConfig.classList.add("player-config");
      playerConfig.style.marginBottom = "1rem";

      // Titre du joueur
      const playerTitle = document.createElement("h4");
      playerTitle.textContent = `🎮 Joueur ${i}`;
      playerTitle.style.color = "#ff1a1a";
      playerTitle.style.marginBottom = "0.5rem";
      playerConfig.appendChild(playerTitle);

      // Champ pseudo du joueur
      const pseudoLabel = document.createElement("label");
      pseudoLabel.textContent = "Pseudo :";
      pseudoLabel.style.display = "block";
      pseudoLabel.style.marginBottom = "0.3rem";
      pseudoLabel.style.color = "#ccc";
      pseudoLabel.style.fontSize = "0.9rem";

      const pseudoInput = document.createElement("input");
      pseudoInput.type = "text";
      pseudoInput.id = `pseudo-${i}`;
      pseudoInput.placeholder = `Joueur ${i}`;
      pseudoInput.style.width = "100%";
      pseudoInput.style.padding = "0.4rem";
      pseudoInput.style.border = "1px solid #660000";
      pseudoInput.style.borderRadius = "4px";
      pseudoInput.style.background = "#1a1a1a";
      pseudoInput.style.color = "#fff";
      pseudoInput.style.marginBottom = "0.8rem";

      pseudoLabel.appendChild(pseudoInput);
      playerConfig.appendChild(pseudoLabel);

      // Options du joueur
      const playerOptions = document.createElement("div");
      playerOptions.classList.add("player-options");

      // Option Double Classe
      const doubleClasseLabel = document.createElement("label");
      doubleClasseLabel.style.display = "flex";
      doubleClasseLabel.style.alignItems = "center";
      doubleClasseLabel.style.gap = "0.3rem";
      doubleClasseLabel.style.fontSize = "0.9rem";

      const doubleClasseCheckbox = document.createElement("input");
      doubleClasseCheckbox.type = "checkbox";
      doubleClasseCheckbox.id = `doubleClasse-${i}`;

      const doubleClasseText = document.createElement("span");
      doubleClasseText.textContent = "Double Classe (2 classes)";

      doubleClasseLabel.appendChild(doubleClasseCheckbox);
      doubleClasseLabel.appendChild(doubleClasseText);
      playerOptions.appendChild(doubleClasseLabel);

      // Option Munitions Cryptides
      const cryptidLabel = document.createElement("label");
      cryptidLabel.style.display = "flex";
      cryptidLabel.style.alignItems = "center";
      cryptidLabel.style.gap = "0.3rem";
      cryptidLabel.style.fontSize = "0.9rem";

      const cryptidCheckbox = document.createElement("input");
      cryptidCheckbox.type = "checkbox";
      cryptidCheckbox.id = `hasCryptidAmmo-${i}`;
      cryptidCheckbox.checked = true;

      const cryptidText = document.createElement("span");
      cryptidText.textContent = "Munitions Cryptides débloquées";

      cryptidLabel.appendChild(cryptidCheckbox);
      cryptidLabel.appendChild(cryptidText);
      playerOptions.appendChild(cryptidLabel);

      playerConfig.appendChild(playerOptions);
      playerConfigsContainer.appendChild(playerConfig);
    }
  }

  // Créer la configuration initiale
  createPlayerConfigs();
  createMapConfigs(); // Créer la configuration des maps au chargement

  // Écouter les changements du nombre de joueurs
  inputNumPlayers.addEventListener("change", createPlayerConfigs);
  inputMaxReliques.addEventListener("change", updateGlobalReliquesInfo);
  globalReliquesCheckbox.addEventListener("change", updateGlobalReliquesInfo);
  nbReliquesTotalInput.addEventListener("change", updateGlobalReliquesInfo);
  randomMapCheckbox.addEventListener("change", selectRandomMap);

  // Fonction pour récupérer les paramètres d'un joueur
  function getPlayerParams(playerIndex) {
    const doubleClasse = document.getElementById(`doubleClasse-${playerIndex}`).checked;
    const hasCryptidAmmo = document.getElementById(`hasCryptidAmmo-${playerIndex}`).checked;
    const pseudo = document.getElementById(`pseudo-${playerIndex}`).value.trim() || `Joueur ${playerIndex}`;
    return { doubleClasse, hasCryptidAmmo, pseudo };
  }

  // Fonction pour mettre à jour l'info des reliques globales
  function updateGlobalReliquesInfo() {
    const numPlayers = parseInt(inputNumPlayers.value, 10) || 1;
    const maxReliques = parseInt(inputMaxReliques.value, 10) || 0;
    const maxGlobal = numPlayers * maxReliques;

    maxGlobalReliquesSpan.textContent = maxGlobal;
    nbReliquesTotalInput.max = maxGlobal;

    if (globalReliquesCheckbox.checked) {
      globalReliquesInfo.style.display = "block";
    } else {
      globalReliquesInfo.style.display = "none";
    }
  }

  // Initialiser l'info
  updateGlobalReliquesInfo();

  button.addEventListener("click", () => {
    const maxReliques = parseInt(inputMaxReliques.value, 10) || 0;
    const numPlayers = parseInt(inputNumPlayers.value, 10) || 1;
    const isGlobalReliques = globalReliquesCheckbox.checked;
    const nbReliquesTotal = parseInt(nbReliquesTotalInput.value, 10) || 0;
    const isRandomMap = randomMapCheckbox.checked;

    const container = document.getElementById("randomLoadout");
    container.innerHTML = ""; // VIDE TOUTE LA LISTE AVANT DE GENERER

    // Choisir la map aléatoirement si l'option est activée
    let currentMap = null;
    let maxReliquesFinal = maxReliques;
    if (isRandomMap) {
      currentMap = randomItem(maps);
      // Mettre à jour le max de reliques selon la map choisie
      maxReliquesFinal = currentMap.maxReliques;
      inputMaxReliques.value = currentMap.maxReliques;
      updateGlobalReliquesInfo();
    }

    // Gérer les reliques globales
    let repartitionReliques = [];
    if (isGlobalReliques) {
      const maxGlobalReliques = numPlayers * maxReliquesFinal;
      // Utiliser le nombre saisi par l'utilisateur, avec validation
      const nbReliquesAReperir = Math.min(nbReliquesTotal, maxGlobalReliques);
      repartitionReliques = repartirReliquesGlobales(nbReliquesAReperir, numPlayers, maxReliquesFinal);
    }

    for (let i = 1; i <= numPlayers; i++) {
      const { doubleClasse, hasCryptidAmmo, pseudo } = getPlayerParams(i);

      // Déterminer le nombre de reliques pour ce joueur
      let nbReliquesJoueur = 0;
      if (isGlobalReliques) {
        nbReliquesJoueur = repartitionReliques[i - 1];
      } else {
        nbReliquesJoueur = Math.floor(Math.random() * (maxReliquesFinal + 1));
      }

      const loadout = generateRandomLoadout(doubleClasse, hasCryptidAmmo, nbReliquesJoueur);

      // Conteneur du joueur
      const liPlayerContainer = document.createElement("li");
      liPlayerContainer.style.display = "flex";
      liPlayerContainer.style.flexDirection = "column";
      liPlayerContainer.style.gap = "0.5rem";

      // Titre joueur
      const liPlayerTitle = document.createElement("div");
      liPlayerTitle.textContent = `🎮 ${pseudo}`;
      liPlayerTitle.classList.add("player-title");
      liPlayerContainer.appendChild(liPlayerTitle);

      // UL loadout
      const ulPlayer = document.createElement("ul");
      ulPlayer.classList.add("player-loadout");
      liPlayerContainer.appendChild(ulPlayer);

      // Ajouter le conteneur du joueur dans le container principal
      container.appendChild(liPlayerContainer);

      // Générer le loadout
      displayLoadoutAnimated(loadout, ulPlayer);
    }

    // Afficher la map si sélectionnée (au même niveau que les loadouts)
    if (currentMap) {
      const mapContainer = document.createElement("li");
      mapContainer.style.display = "flex";
      mapContainer.style.flexDirection = "column";
      mapContainer.style.gap = "0.5rem";
      mapContainer.style.alignItems = "center";

      const mapTitle = document.createElement("div");
      mapTitle.textContent = `🗺️ ${currentMap.nom}`;
      mapTitle.classList.add("player-title");
      mapTitle.style.width = "400px";
      mapContainer.appendChild(mapTitle);

      container.appendChild(mapContainer);
    }
  });
});
