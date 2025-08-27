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

// --- Fonctions utilitaires ---
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

function generateRandomLoadout() {
  const doubleClasse = document.getElementById("doubleClasse").checked;
  const hasCryptidAmmo = document.getElementById("hasCryptidAmmo").checked;

  // 🔫 Choix pistolet
  const pistolet = randomItem(extinctionCustomization.pistolets);

  // 🎓 Classes (1 ou 2 selon boost)
  let classe;
  if (doubleClasse) {
    classe = randomUniqueItems(extinctionCustomization.classe, 2).join(" + ");
  } else {
    classe = randomItem(extinctionCustomization.classe);
  }

  // 💥 Munitions (exclure Cryptides si non débloqué)
  const ammoPool = hasCryptidAmmo
    ? extinctionCustomization.munitions
    : extinctionCustomization.munitions.filter(
        (a) => a !== "Tueur de Cryptides"
      );
  const munitions = randomItem(ammoPool);

  // 🔧 Autres équipements
  const soutien = randomItem(extinctionCustomization.soutien);
  const package = randomItem(extinctionCustomization.package);
  const egaliseur = randomItem(extinctionCustomization.egaliseur);

  // 🎭 Reliques
  let maxReliques = parseInt(document.getElementById("maxReliques").value, 10);
  if (isNaN(maxReliques) || maxReliques < 0) maxReliques = 0;
  if (maxReliques > 10) maxReliques = 10;
  const nbReliques = Math.floor(Math.random() * (maxReliques + 1));
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

function displayLoadoutAnimated(loadout) {
  const ul = document.getElementById("randomLoadout");
  ul.innerHTML = ""; // vide avant affichage

  for (const [key, value] of Object.entries(loadout)) {
    if (key === "reliques") {
      const reliqueLabel = document.createElement("li");
      reliqueLabel.textContent = `${value.length} Relique${
        value.length > 1 ? "s" : ""
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

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const maxReliques = parseInt(inputMaxReliques.value, 10) || 0;
    const loadout = generateRandomLoadout(maxReliques);
    displayLoadoutAnimated(loadout);
  });
});
