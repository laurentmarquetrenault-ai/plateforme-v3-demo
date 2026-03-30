let messages = [];
let trust = 50;
let finished = false;
let evaluationShown = false;
let evaluationInProgress = false;
let lastClientReply = "";

const chat = document.getElementById("chat");
const trustBar = document.getElementById("trust");
const trustText = document.getElementById("trustText");
const avatar = document.getElementById("avatar");
const input = document.getElementById("input");
const profilSelect = document.getElementById("profil");
const scenarioSelect = document.getElementById("scenario");
const vehicleAgeSelect = document.getElementById("vehicleAge");
const energyTypeSelect = document.getElementById("energyType");
const endMessage = document.getElementById("endMessage");
const sendBtn = document.getElementById("sendBtn");
const finishBtn = document.getElementById("finishDemoBtn");
const newBtn = document.getElementById("newDemoBtn");
const evalBtn = document.getElementById("evalBtn");
const endTitle = document.getElementById("endTitle");
const endSubtitle = document.getElementById("endSubtitle");
const modeBadge = document.getElementById("modeBadge");
const helpRecommendation = document.getElementById("helpRecommendation");
const helpAngle = document.getElementById("helpAngle");
const helpOffer = document.getElementById("helpOffer");
const helpEligibility = document.getElementById("helpEligibility");
const helpContractEnd = document.getElementById("helpContractEnd");
const helpPriceLine1 = document.getElementById("helpPriceLine1");
const helpPriceLine2 = document.getElementById("helpPriceLine2");
const helpPriceLine3 = document.getElementById("helpPriceLine3");
const helpArg1 = document.getElementById("helpArg1");
const helpArg2 = document.getElementById("helpArg2");
const helpArg3 = document.getElementById("helpArg3");
const helpObjection = document.getElementById("helpObjection");
const briefText = document.getElementById("briefText");
const toggleHelpBtn = document.getElementById("toggleHelpBtn");

const avatarByState = {
  happy: "/images/happy.jpg",
  neutral: "/images/neutral.jpg",
  angry: "/images/angry.jpg"
};

const skills = {
  welcome: false,
  discovery: false,
  argumentation: false,
  objection: false,
  closing: false
};

const skillLabels = {
  welcome: "Accueil",
  discovery: "Découverte",
  argumentation: "Argumentation",
  objection: "Objections",
  closing: "Conclusion"
};

function getSellerIdentity() {
  const firstName = (localStorage.getItem("seller_first_name") || "").trim();
  const lastName = (localStorage.getItem("seller_last_name") || "").trim();
  const email = (localStorage.getItem("seller_email") || "").trim();

  return {
    firstName,
    lastName,
    email,
    fullName: `${firstName} ${lastName}`.trim(),
    isReady: Boolean(firstName && lastName)
  };
}

function getSelectedBrand() {
  return (localStorage.getItem("selected_brand") || "").trim().toLowerCase();
}

function ensureSellerIdentity() {
  const seller = getSellerIdentity();

  if (seller.isReady) {
    return true;
  }

  alert("Aucun vendeur actif n’est enregistré. Merci de revenir sur le portail pour renseigner le prénom et le nom du vendeur avant de lancer une simulation.");
  window.location.href = "index.html";
  return false;
}

function ensureRenaultEnvironment() {
  const selectedBrand = getSelectedBrand();

  if (!selectedBrand || selectedBrand === "renault") {
    return true;
  }

  alert("Cette simulation correspond à l’univers Renault. Merci de revenir au portail pour sélectionner l’environnement approprié.");
  window.location.href = "index.html";
  return false;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, "<br>");
}

function display(text, role = "client") {
  if (!chat) return;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;

  const roleLabel =
    role === "seller" ? "Vendeur" :
    role === "coach" ? "Coach" :
    "Client";

  bubble.innerHTML = `<span class="role">${roleLabel}</span>${escapeHtml(text)}`;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function resetTrustUI() {
  if (trustBar) {
    trustBar.style.width = `${trust}%`;
  }

  if (trustText) {
    trustText.textContent = `${trust}%`;
  }
}

function updateAvatar() {
  if (!avatar) return;

  if (trust > 70) {
    avatar.src = avatarByState.happy;
  } else if (trust > 40) {
    avatar.src = avatarByState.neutral;
  } else {
    avatar.src = avatarByState.angry;
  }
}

function parseVehicleAge() {
  const raw = vehicleAgeSelect?.value || "1 an";
  const match = raw.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function getRenaultPriceTable(vehicleAge, energyType) {
  const bucket = vehicleAge <= 5 ? "1-5" : "6-8";

  const matrix = {
    "1-5": {
      ev: { cep: 29, cepp: 49, label: "Véhicules électriques (VP, VU)" },
      essence: { cep: 39, cepp: 69, label: "Véhicules essence & GPL" },
      hybrid: { cep: 49, cepp: 69, label: "Véhicules hybrides (HEV, PHEV)" },
      diesel: { cep: 49, cepp: 79, label: "Véhicules diesel" },
      vu: { cep: 59, cepp: 89, label: "Véhicules utilitaires thermiques" }
    },
    "6-8": {
      ev: { cep: 25, cepp: 39, label: "Véhicules électriques (VP, VU)" },
      essence: { cep: 35, cepp: 59, label: "Véhicules essence & GPL" },
      hybrid: { cep: 45, cepp: 59, label: "Véhicules hybrides (HEV, PHEV)" },
      diesel: { cep: 45, cepp: 69, label: "Véhicules diesel" },
      vu: { cep: 55, cepp: 79, label: "Véhicules utilitaires thermiques" }
    }
  };

  return matrix[bucket]?.[energyType] || null;
}

function updateHelpContent() {
  const scenario = scenarioSelect?.value || "revision";
  const profil = profilSelect?.value || "convaincu";
  const vehicleAge = parseVehicleAge();
  const energyType = energyTypeSelect?.value || "essence";
  const priceData = getRenaultPriceTable(vehicleAge, energyType);
  const ageBucketLabel = vehicleAge <= 5 ? "1 à 5 ans" : "6 à 8 ans + 6 mois de souplesse";

  let reco = "Commencez par découvrir l’usage et ce qui compte vraiment pour le client.";
  let angle = "Reliez ensuite la solution à la tranquillité, à la visibilité budgétaire et au suivi dans le réseau.";
  let offer = "Proposez CEP+ en premier, puis ajustez si le besoin est plus simple.";
  let objection = "“C’est trop cher” → “Le contrat coûte souvent moins cher qu’un imprévu non couvert.”";

  if (profil === "pro") {
    reco = "Avec un client professionnel, parlez d’abord continuité d’usage, maîtrise budgétaire et limitation des immobilisations.";
    angle = "L’angle clé est l’impact concret sur l’activité : moins d’imprévus, meilleure visibilité, véhicule plus facilement maintenu en usage.";
    offer = "Sur un pro, reliez la proposition à l’activité, à la disponibilité du véhicule et à la lisibilité budgétaire.";
  } else if (scenario === "facture") {
    reco = "Transformez la facture subie en réflexion sur l’anticipation et la maîtrise des dépenses futures.";
    angle = "Reliez la dépense actuelle à l’intérêt d’une solution plus lisible dans le temps.";
    objection = "“Je verrai plus tard” → “Plus tard, la révision déjà faite ne sera pas comprise. Aujourd’hui, vous sécurisez tout de suite l’avantage complet.”";
  } else if (scenario === "fin-garantie") {
    reco = "Mettez en avant la suite logique après la garantie et la sécurisation du véhicule dans la durée.";
    angle = "Parlez sérénité, continuité de suivi et réduction du risque de mauvaises surprises après la fin de garantie.";
    offer = "La fin de garantie est un moment clé pour proposer une continuité de protection et d’entretien.";
  } else if (scenario === "usure") {
    reco = "Faites parler le client sur son usage réel, puis reliez ce besoin à une logique d’anticipation.";
    angle = "Montrez le sens de la solution par rapport à l’usage, pas juste par rapport au produit.";
    objection = "“Je roule peu, ça vaut le coup ?” → “Même en roulant peu, le temps et l’usure continuent d’agir. Le contrat garde son intérêt.”";
  }

  if (helpRecommendation) {
    helpRecommendation.textContent = reco;
  }

  if (helpAngle) {
    helpAngle.textContent = angle;
  }

  if (helpOffer) {
    helpOffer.textContent = offer;
  }

  if (helpEligibility) {
    helpEligibility.textContent = "Éligibilité : 1 à 8 ans + 6 mois et moins de 120 000 km à la souscription.";
  }

  if (helpContractEnd) {
    helpContractEnd.textContent = "Fin de contrat : 48 mois maximum, avec fin de contrat au plus à 200 000 km et jusqu’à 12 ans et demi selon l’âge de départ.";
  }

  if (helpPriceLine1 && helpPriceLine2 && helpPriceLine3) {
    if (priceData) {
      helpPriceLine1.textContent = `CEP : ${priceData.cep} €/mois`;
      helpPriceLine2.textContent = `CEP+ : ${priceData.cepp} €/mois`;
      helpPriceLine3.textContent = `Base tarifaire : Renault ${ageBucketLabel} • ${priceData.label}`;
    } else {
      helpPriceLine1.textContent = "CEP : tarif indisponible";
      helpPriceLine2.textContent = "CEP+ : tarif indisponible";
      helpPriceLine3.textContent = "Base tarifaire : configuration non reconnue";
    }
  }

  if (helpArg1) {
    helpArg1.textContent = "Budget maîtrisé : mensualités fixes sans augmentation pendant 4 ans.";
  }

  if (helpArg2) {
    helpArg2.textContent = "Respect du programme d’entretien et suivi dans le réseau Renault.";
  }

  if (helpArg3) {
    helpArg3.textContent = "Assistance, véhicule de remplacement et revente facilitée grâce au suivi réseau.";
  }

  if (helpObjection) {
    helpObjection.textContent = objection;
  }
}

function updateModeUI() {
  if (modeBadge) {
    modeBadge.textContent = "Simulation vendeur";
  }

  if (finishBtn) {
    finishBtn.textContent = "Terminer la simulation";
  }

  if (newBtn) {
    newBtn.textContent = "Nouvelle simulation";
  }

  if (endTitle) {
    endTitle.textContent = "Fin de simulation";
  }

  if (endSubtitle) {
    endSubtitle.textContent = "La discussion est terminée. Lance maintenant l’évaluation.";
  }
}

function renderSkills() {
  Object.keys(skills).forEach((key) => {
    const star = document.getElementById(`skill-${key}`);
    if (!star) return;

    star.classList.toggle("active", skills[key]);
    star.setAttribute("aria-checked", skills[key] ? "true" : "false");
    star.title = `${skillLabels[key]} : ${skills[key] ? "validé" : "non validé"}`;
  });
}

function resetSkills() {
  Object.keys(skills).forEach((key) => {
    skills[key] = false;
  });

  renderSkills();
}

function setSkill(key) {
  if (!skills[key]) {
    skills[key] = true;
    renderSkills();
  }
}

function getValidatedSkillsCount() {
  return Object.values(skills).filter(Boolean).length;
}

function computeSimulationScore() {
  const skillsCount = getValidatedSkillsCount();
  const trustPart = trust * 0.6;
  const skillsPart = (skillsCount / 5) * 40;
  const total = Math.round(trustPart + skillsPart);
  return Math.max(0, Math.min(100, total));
}

function saveSimulationScore() {
  const seller = getSellerIdentity();
  const score = computeSimulationScore();

  if (!seller.isReady) {
    return { score, saved: false };
  }

  const previousBest = Number(localStorage.getItem("simulator_renault_best_score") || "0");

  localStorage.setItem("simulator_renault_last_score", String(score));

  if (score > previousBest) {
    localStorage.setItem("simulator_renault_best_score", String(score));
  }

  return { score, saved: true };
}

function getQcmPercent() {
  const raw = localStorage.getItem("qcm_renault_percent");
  return raw ? Number(raw) : null;
}

function getSimulationLastScore() {
  const raw = localStorage.getItem("simulator_renault_last_score");
  return raw ? Number(raw) : null;
}

function removePostEvaluationActions() {
  const actionsBox = document.getElementById("postEvalActions");
  if (actionsBox) {
    actionsBox.remove();
  }
}

function setControlsState({
  sendVisible = true,
  sendDisabled = false,
  finishVisible = true,
  finishDisabled = false,
  evalVisible = true,
  evalDisabled = false,
  evalText = "Voir évaluation",
  inputDisabled = false
} = {}) {
  if (sendBtn) {
    sendBtn.style.display = sendVisible ? "inline-flex" : "none";
    sendBtn.disabled = sendDisabled;
  }

  if (finishBtn) {
    finishBtn.style.display = finishVisible ? "inline-flex" : "none";
    finishBtn.disabled = finishDisabled;
  }

  if (evalBtn) {
    evalBtn.style.display = evalVisible ? "inline-flex" : "none";
    evalBtn.disabled = evalDisabled;
    evalBtn.textContent = evalText;
  }

  if (input) {
    input.disabled = inputDisabled;
  }
}

function showEndPanel(title, subtitle) {
  if (!endMessage) return;

  endMessage.classList.remove("hidden");

  if (endTitle) {
    endTitle.textContent = title;
  }

  if (endSubtitle) {
    endSubtitle.textContent = subtitle;
  }
}

function hideEndPanel() {
  if (!endMessage) return;
  endMessage.classList.add("hidden");
}

function buildFinalStatusMessage() {
  const seller = getSellerIdentity();
  const qcm = getQcmPercent();
  const sim = getSimulationLastScore();

  const qcmOk = qcm !== null && qcm >= 75;
  const simOk = sim !== null && sim >= 75;

  let title = "Parcours en cours";
  let text = "La simulation est terminée. Vous pouvez relancer une nouvelle tentative ou revenir au portail vendeur.";

  if (!seller.isReady) {
    title = "Identité vendeur manquante";
    text = "La simulation est terminée, mais aucun vendeur actif n’est enregistré. Revenez au portail pour renseigner le vendeur avant de poursuivre.";
    return { title, text };
  }

  if (qcmOk && simOk) {
    title = "Validation réussie";
    text = `Très bon travail ${seller.fullName}. QCM : ${qcm}% • Simulation : ${sim}/100. Les seuils de validation sont atteints. Vous pouvez consulter la certification ou poursuivre vos entraînements.`;
  } else if (qcm !== null && sim !== null) {
    title = "Nouvel essai recommandé";
    text = `${seller.fullName} — QCM : ${qcm}% • Simulation : ${sim}/100. La base est posée, mais un nouvel essai est conseillé pour consolider le parcours vendeur.`;
  } else if (sim !== null) {
    title = "Simulation terminée";
    text = `${seller.fullName} — Simulation : ${sim}/100. Vous pouvez revenir au portail, faire le QCM Renault ou relancer une nouvelle simulation.`;
  }

  return { title, text };
}

function showPostEvaluationActions() {
  const { title, text } = buildFinalStatusMessage();

  showEndPanel(title, text);

  setControlsState({
    sendVisible: false,
    sendDisabled: true,
    finishVisible: false,
    finishDisabled: true,
    evalVisible: false,
    evalDisabled: true,
    inputDisabled: true
  });

  removePostEvaluationActions();

  if (!endMessage) return;

  const actionsBox = document.createElement("div");
  actionsBox.id = "postEvalActions";
  actionsBox.style.display = "flex";
  actionsBox.style.gap = "12px";
  actionsBox.style.flexWrap = "wrap";
  actionsBox.style.marginTop = "14px";

  const retryBtn = document.createElement("button");
  retryBtn.type = "button";
  retryBtn.className = "btn btn-secondary";
  retryBtn.textContent = "Nouvelle simulation";
  retryBtn.addEventListener("click", resetDemo);

  const certLink = document.createElement("a");
  certLink.href = "certification.html";
  certLink.className = "btn btn-secondary";
  certLink.textContent = "Voir certification";

  const homeLink = document.createElement("a");
  homeLink.href = "index.html";
  homeLink.className = "btn btn-secondary";
  homeLink.textContent = "Retour au portail";

  actionsBox.appendChild(retryBtn);
  actionsBox.appendChild(certLink);
  actionsBox.appendChild(homeLink);
  endMessage.appendChild(actionsBox);
}

function generateBrief() {
  if (!briefText) return;

  const scenario = scenarioSelect?.value || "revision";
  const age = vehicleAgeSelect?.value || "1 an";
  const profil = profilSelect?.value || "convaincu";
  const seller = getSellerIdentity();

  const intro = seller.isReady ? `Vendeur actif : ${seller.fullName}.` : "";
  let text = "";

  if (profil === "pro") {
    if (scenario === "revision") {
      text = `${intro}
Vous recevez un client professionnel pour une révision Renault.
Le véhicule a ${age}.
Vous serez évalué sur votre capacité à relier usage professionnel, maîtrise budgétaire et continuité d’usage.`;
    } else if (scenario === "facture") {
      text = `${intro}
Vous recevez un client professionnel après une facture atelier élevée.
Le véhicule a ${age}.
Vous serez évalué sur votre capacité à transformer une dépense subie en logique de valeur.`;
    } else if (scenario === "fin-garantie") {
      text = `${intro}
Vous recevez un client professionnel avec un véhicule en fin de garantie.
Le véhicule a ${age}.
Vous serez évalué sur votre capacité à sécuriser la suite du parcours client.`;
    } else if (scenario === "usure") {
      text = `${intro}
Vous recevez un client professionnel pour un sujet d’usure.
Le véhicule a ${age}.
Vous serez évalué sur votre capacité à qualifier le besoin et à conclure proprement.`;
    }
  } else {
    if (scenario === "revision") {
      text = `${intro}
Vous attendez un client Renault pour une révision.
Le véhicule a ${age}.
Votre objectif est de mener un échange commercial complet et structuré.`;
    } else if (scenario === "facture") {
      text = `${intro}
Vous recevez un client après une facture atelier élevée.
Le véhicule a ${age}.
Vous serez évalué sur votre capacité à rassurer, découvrir et argumenter.`;
    } else if (scenario === "fin-garantie") {
      text = `${intro}
Vous recevez un client dont le véhicule arrive en fin de garantie.
Le véhicule a ${age}.
Vous serez évalué sur la découverte, l’argumentation et la conclusion.`;
    } else if (scenario === "usure") {
      text = `${intro}
Vous recevez un client pour un sujet d’usure.
Le véhicule a ${age}.
Vous serez évalué sur la pertinence de votre recommandation.`;
    }
  }

  briefText.innerHTML = text.replace(/\n/g, "<br>");
}

function resetDemo() {
  messages = [];
  trust = 50;
  finished = false;
  evaluationShown = false;
  evaluationInProgress = false;
  lastClientReply = "";

  if (chat) {
    chat.innerHTML = "";
  }

  generateBrief();

  const firstMessage = "Bonjour";
  display(firstMessage, "client");

  messages.push({
    role: "assistant",
    content: firstMessage
  });

  lastClientReply = firstMessage;

  if (input) {
    input.value = "";
  }

  removePostEvaluationActions();
  hideEndPanel();

  setControlsState({
    sendVisible: true,
    sendDisabled: false,
    finishVisible: true,
    finishDisabled: false,
    evalVisible: true,
    evalDisabled: false,
    evalText: "Voir évaluation",
    inputDisabled: false
  });

  resetTrustUI();
  updateAvatar();
  resetSkills();
  updateModeUI();
  updateHelpContent();

  if (input) {
    input.focus();
  }
}

function toggleHelp() {
  const helpBox = document.getElementById("helpBox");
  if (!helpBox) return;

  helpBox.classList.toggle("hidden");

  if (toggleHelpBtn) {
    toggleHelpBtn.textContent = helpBox.classList.contains("hidden")
      ? "Afficher aide"
      : "Masquer aide";
  }
}

function updateTrustFromSellerMessage(text) {
  const t = text.toLowerCase();
  const profil = profilSelect?.value || "convaincu";

  let delta = -4;

  const goodSignals = [
    "budget",
    "maîtrise",
    "maitrise",
    "visibilité",
    "visibilite",
    "tranquillité",
    "tranquillite",
    "révision",
    "entretien",
    "usage",
    "besoin",
    "garantie",
    "anticiper",
    "protéger",
    "proteger",
    "éviter",
    "eviter",
    "devis",
    "réseau",
    "reseau",
    "suivi",
    "solution",
    "valeur",
    "revente",
    "continuité",
    "continuite"
  ];

  const proSignals = [
    "activité",
    "activite",
    "professionnel",
    "professionnelle",
    "usage pro",
    "usage professionnel",
    "budget fixe",
    "imprévu",
    "imprevu",
    "imprévus",
    "imprevus",
    "immobilisation",
    "continuité d'usage",
    "continuité d’usage",
    "continuite d'usage",
    "continuite d’usage",
    "outil de travail"
  ];

  const badSignals = [
    "comme vous voulez",
    "je sais pas",
    "aucune idée",
    "faites comme vous voulez",
    "c'est vous qui voyez"
  ];

  const hasGood = goodSignals.some((word) => t.includes(word));
  const hasProGood = proSignals.some((word) => t.includes(word));
  const hasBad = badSignals.some((word) => t.includes(word));

  if (hasGood) delta = 8;
  if (profil === "pro" && hasProGood) delta += 4;
  if (hasBad) delta = -12;

  trust += delta;
  if (trust > 100) trust = 100;
  if (trust < 0) trust = 0;

  resetTrustUI();
  updateAvatar();
}

function sellerLooksLikeWelcome(text) {
  const t = text.toLowerCase();
  return /(bonjour|bonsoir|madame|monsieur|bienvenue)/.test(t);
}

function sellerLooksLikeDiscovery(text) {
  const t = text.toLowerCase();

  const discoverySignals = [
    "quel usage",
    "vous roulez",
    "combien de kilomètres",
    "combien de kilometres",
    "vous gardez",
    "vous comptez la garder",
    "qu'est-ce qui vous freine",
    "qu'est-ce qui vous fait hésiter",
    "qu'est-ce qui vous fait hesiter",
    "pour votre activité",
    "pour votre activite",
    "outil de travail",
    "ce qui compte pour vous",
    "quelles sont vos attentes"
  ];

  return discoverySignals.some((q) => t.includes(q));
}

function sellerLooksLikeArgumentation(text) {
  const t = text.toLowerCase();

  const argumentSignals = [
    "budget maîtrisé",
    "budget maitrise",
    "visibilité",
    "visibilite",
    "tranquillité",
    "tranquillite",
    "réseau",
    "reseau",
    "entretien",
    "suivi",
    "anticiper",
    "protéger",
    "proteger",
    "éviter",
    "eviter",
    "valeur",
    "continuité",
    "continuite",
    "activité",
    "activite",
    "immobilisation",
    "maîtrise du budget",
    "maitrise du budget"
  ];

  return argumentSignals.some((q) => t.includes(q));
}

function clientRaisedObjection(text) {
  const t = (text || "").toLowerCase();

  const objectionTerms = [
    "trop cher",
    "pas sûr",
    "pas sur",
    "pas convaincu",
    "je vais réfléchir",
    "je vais reflechir",
    "plus tard",
    "j'hésite",
    "j'hesite",
    "ça vaut le coup",
    "ca vaut le coup",
    "je préfère attendre",
    "je prefere attendre",
    "pas nécessaire",
    "pas necessaire"
  ];

  return objectionTerms.some((item) => t.includes(item));
}

function sellerLooksLikeObjectionHandling(text) {
  const t = text.toLowerCase();

  const reassuringTerms = [
    "je comprends",
    "justement",
    "l'idée",
    "le but",
    "cela permet",
    "ça permet",
    "ca permet",
    "éviter",
    "eviter",
    "maîtriser",
    "maitriser",
    "visibilité",
    "visibilite",
    "tranquillité",
    "tranquillite",
    "continuité",
    "continuite",
    "activité",
    "activite"
  ];

  return reassuringTerms.some((item) => t.includes(item));
}

function sellerLooksLikeClosing(text) {
  const t = text.toLowerCase();

  const closingTerms = [
    "on le met en place",
    "on part dessus",
    "je vous prépare le devis",
    "je vous prepare le devis",
    "je vous fais le devis",
    "souhaitez-vous",
    "vous souhaitez qu'on",
    "on valide",
    "on lance",
    "je peux vous l'intégrer",
    "je peux vous l'integrer"
  ];

  return closingTerms.some((item) => t.includes(item));
}

function updateSkillsFromSellerMessage(text) {
  if (sellerLooksLikeWelcome(text)) {
    setSkill("welcome");
  }

  if (sellerLooksLikeDiscovery(text)) {
    setSkill("discovery");
  }

  if (sellerLooksLikeArgumentation(text)) {
    setSkill("argumentation");
  }

  if (clientRaisedObjection(lastClientReply) && sellerLooksLikeObjectionHandling(text)) {
    setSkill("objection");
  }

  if (sellerLooksLikeClosing(text)) {
    setSkill("closing");
  }
}

function finishSession() {
  if (finished) return;

  finished = true;

  const seller = getSellerIdentity();
  const { score, saved } = saveSimulationScore();

  showEndPanel(
    "Fin de simulation",
    !seller.isReady || !saved
      ? "La discussion est terminée, mais aucun vendeur actif n’est correctement renseigné. Revenez au portail pour enregistrer le vendeur avant de poursuivre."
      : `La discussion est terminée. Score simulé enregistré pour ${seller.fullName} : ${score}/100. Lance maintenant l’évaluation pour obtenir le retour final.`
  );

  setControlsState({
    sendVisible: false,
    sendDisabled: true,
    finishVisible: false,
    finishDisabled: true,
    evalVisible: true,
    evalDisabled: !seller.isReady,
    evalText: "Voir évaluation",
    inputDisabled: true
  });
}

async function send() {
  if (finished || evaluationInProgress) return;

  const val = input?.value.trim();
  if (!val) return;

  input.value = "";

  display(val, "seller");
  messages.push({
    role: "user",
    content: val
  });

  updateTrustFromSellerMessage(val);
  updateSkillsFromSellerMessage(val);

  const validatedSkillsCount = getValidatedSkillsCount();

  const payload = {
    messages,
    profil: profilSelect?.value || "convaincu",
    scenario: scenarioSelect?.value || "revision",
    vehicleAge: vehicleAgeSelect?.value || "1 an",
    energyType: energyTypeSelect?.value || "essence",
    liveSkills: skills,
    trust,
    validatedSkillsCount,
    brand: "renault"
  };

  try {
    setControlsState({
      sendVisible: true,
      sendDisabled: true,
      finishVisible: true,
      finishDisabled: true,
      evalVisible: true,
      evalDisabled: true,
      evalText: "Voir évaluation",
      inputDisabled: true
    });

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      display(data.error || "Erreur serveur.", "client");
      return;
    }

    if (!data.reply) {
      display("Erreur : réponse IA invalide.", "client");
      return;
    }

    const reply = data.reply.trim();
    lastClientReply = reply;

    display(reply, "client");
    messages.push({
      role: "assistant",
      content: reply
    });
  } catch (err) {
    console.error(err);
    display("Erreur réseau ou serveur.", "client");
  } finally {
    if (!finished && !evaluationInProgress) {
      setControlsState({
        sendVisible: true,
        sendDisabled: false,
        finishVisible: true,
        finishDisabled: false,
        evalVisible: true,
        evalDisabled: false,
        evalText: "Voir évaluation",
        inputDisabled: false
      });

      if (input) {
        input.focus();
      }
    }
  }
}

function finishDemo() {
  finishSession();
}

async function evaluate() {
  if (evaluationShown || evaluationInProgress) return;

  const seller = getSellerIdentity();

  if (!seller.isReady) {
    alert("Aucun vendeur actif n’est enregistré. Revenez au portail pour renseigner le vendeur avant de lancer l’évaluation.");
    window.location.href = "index.html";
    return;
  }

  if (!finished) {
    finishSession();
  }

  evaluationInProgress = true;
  evaluationShown = true;

  setControlsState({
    sendVisible: false,
    sendDisabled: true,
    finishVisible: false,
    finishDisabled: true,
    evalVisible: true,
    evalDisabled: true,
    evalText: "Évaluation en cours...",
    inputDisabled: true
  });

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conversation: messages,
        trust,
        profil: profilSelect?.value || "convaincu",
        scenario: scenarioSelect?.value || "revision",
        vehicleAge: vehicleAgeSelect?.value || "1 an",
        energyType: energyTypeSelect?.value || "essence",
        liveSkills: skills,
        sellerFirstName: seller.firstName,
        sellerLastName: seller.lastName,
        sellerEmail: seller.email,
        brand: "renault"
      })
    });

    const data = await res.json();

    if (!res.ok || !data.evaluation) {
      evaluationShown = false;
      evaluationInProgress = false;

      setControlsState({
        sendVisible: false,
        sendDisabled: true,
        finishVisible: false,
        finishDisabled: true,
        evalVisible: true,
        evalDisabled: false,
        evalText: "Voir évaluation",
        inputDisabled: true
      });

      display(data.error || "Erreur : évaluation invalide.", "coach");
      return;
    }

    hideEndPanel();
    display(data.evaluation, "coach");

    evaluationInProgress = false;
    showPostEvaluationActions();
  } catch (err) {
    console.error(err);
    evaluationShown = false;
    evaluationInProgress = false;

    setControlsState({
      sendVisible: false,
      sendDisabled: true,
      finishVisible: false,
      finishDisabled: true,
      evalVisible: true,
      evalDisabled: false,
      evalText: "Voir évaluation",
      inputDisabled: true
    });

    display("Erreur pendant l’évaluation.", "coach");
  }
}

function onSettingsChange() {
  resetDemo();
}

if (profilSelect) {
  profilSelect.addEventListener("change", onSettingsChange);
}

if (scenarioSelect) {
  scenarioSelect.addEventListener("change", onSettingsChange);
}

if (vehicleAgeSelect) {
  vehicleAgeSelect.addEventListener("change", onSettingsChange);
}

if (energyTypeSelect) {
  energyTypeSelect.addEventListener("change", onSettingsChange);
}

if (sendBtn) {
  sendBtn.addEventListener("click", send);
}

if (finishBtn) {
  finishBtn.addEventListener("click", finishDemo);
}

if (newBtn) {
  newBtn.addEventListener("click", resetDemo);
}

if (evalBtn) {
  evalBtn.addEventListener("click", evaluate);
}

if (toggleHelpBtn) {
  toggleHelpBtn.addEventListener("click", toggleHelp);
}

if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      send();
    }
  });
}

if (!ensureSellerIdentity()) {
  throw new Error("Vendeur actif manquant");
}

if (!ensureRenaultEnvironment()) {
  throw new Error("Univers Renault non sélectionné");
}

resetDemo();
