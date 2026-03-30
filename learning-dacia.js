document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("selected_brand", "dacia");

  const questions = [
    {
      theme: "Éligibilité",
      question: "Cliente : « Mon véhicule a 8 ans et 7 mois et 119 000 km. On est encore bon pour souscrire ? »",
      options: [
        "Oui, car le kilométrage est inférieur à 120 000 km.",
        "Oui, mais uniquement sur la formule CEP et pas sur CEP+.",
        "Non, car le véhicule dépasse la limite d’âge à la souscription malgré un kilométrage encore recevable.",
        "Non, car à partir de 8 ans il faut forcément moins de 100 000 km."
      ],
      correct: 2,
      explanation:
        "La souscription est possible de 1 à 8 ans + 6 mois de souplesse maximum, avec un maximum de 120 000 km à la souscription. À 8 ans et 7 mois, le véhicule sort du cadre, même avec 119 000 km."
    },
    {
      theme: "Éligibilité",
      question: "Cliente : « Ma Dacia a 8 ans et 5 mois et 120 100 km. Vu qu’on est presque dedans, vous pouvez quand même me le faire ? »",
      options: [
        "Oui, car la tolérance de 6 mois permet aussi de dépasser légèrement le kilométrage.",
        "Non, car l’âge est encore recevable, mais le kilométrage dépasse la limite maximale de souscription.",
        "Oui, à condition de partir sur CEP+.",
        "Oui, si le véhicule a toujours été entretenu dans le réseau."
      ],
      correct: 1,
      explanation:
        "Les deux critères doivent être respectés à la souscription : âge et kilométrage. Ici, l’âge reste dans la fenêtre de 8 ans + 6 mois, mais le véhicule dépasse les 120 000 km autorisés."
    },
    {
      theme: "Résiliation",
      question: "Cliente : « Si j’arrête mon contrat dans un an, je récupère simplement les mensualités restantes, sans autre impact ? »",
      options: [
        "Oui, la résiliation est libre et sans frais.",
        "Non, car un contrat signé n’est plus résiliable.",
        "Non, la résiliation se fait au prorata des mensualités réglées et du montant des factures atelier, avec 38 € de frais hors rachat du véhicule dans le réseau.",
        "Oui, sauf si une révision constructeur a déjà eu lieu."
      ],
      correct: 2,
      explanation:
        "Le contrat est bien résiliable, mais selon un calcul au prorata des mensualités réglées et du montant des factures atelier, avec 38 € de frais de résiliation, hors cas de rachat du véhicule dans le réseau."
    },
    {
      theme: "Cessibilité / Revente",
      question: "Cliente : « Si je revends ma voiture, le contrat devient forcément inutile ? »",
      options: [
        "Oui, puisque le contrat est attaché uniquement à ma personne.",
        "Non, car le contrat peut être cessible, et sinon il peut aussi être résilié selon les conditions prévues.",
        "Oui, sauf si la revente se fait entre particuliers.",
        "Non, mais seulement si je revends dans les 12 premiers mois."
      ],
      correct: 1,
      explanation:
        "Le vendeur doit maîtriser la nuance : le contrat n’est pas automatiquement perdu à la revente. Il peut être cessible ou résiliable selon le cas."
    },
    {
      theme: "Dacia Zen",
      question: "Cliente : « Mon véhicule a 6 ans, 145 000 km, et je veux surtout être couverte sur les pannes électroniques. Le multimédia est compris avec Dacia Zen ? »",
      options: [
        "Oui, car Dacia Zen couvre tout l’électronique du véhicule sans exception.",
        "Oui, mais uniquement si le client prend Essentielle+.",
        "Non, car même si Dacia Zen couvre certaines pièces mécaniques, électriques et électroniques, le multimédia fait partie des exclusions.",
        "Non, car Dacia Zen n’est plus possible à partir de 6 ans."
      ],
      correct: 2,
      explanation:
        "Dacia Zen peut s’appliquer entre 3 et 7 ans maximum, sous réserve des autres conditions. En revanche, le multimédia fait partie des exclusions, tout comme la carrosserie, les rétros électriques et les réseaux dégivrants."
    },
    {
      theme: "Conditions Dacia Zen",
      question: "Cliente : « Ma voiture a 7 ans et 149 500 km. Je peux encore déclencher Dacia Zen si je prends le bon forfait ? »",
      options: [
        "Oui, car elle est encore dans la limite d’âge et sous le plafond de 150 000 km constructeur.",
        "Non, car à 7 ans Dacia Zen n’existe plus.",
        "Oui, mais seulement si le véhicule est diesel.",
        "Non, car à partir de 140 000 km Dacia Zen est toujours refusée."
      ],
      correct: 0,
      explanation:
        "Pour Dacia Zen, il faut un véhicule entre 3 et 7 ans maximum, avec une couverture constructeur plafonnée à 150 000 km et 30 000 km maximum par an. Ici, 7 ans et 149 500 km restent encore dans le cadre."
    },
    {
      theme: "CEP vs CEP+",
      question: "Cliente : « Je veux une formule qui couvre aussi les amortisseurs, le freinage et le contrôle technique. Laquelle correspond à ce besoin ? »",
      options: [
        "Le CEP, car il inclut déjà l’ensemble des pièces d’usure.",
        "Le CEP+, car il ajoute notamment les pièces d’usure et le contrôle technique.",
        "Le CEP, mais seulement sur un véhicule diesel.",
        "Les deux formules le permettent de la même manière."
      ],
      correct: 1,
      explanation:
        "Le CEP couvre principalement l’entretien, l’assistance, le véhicule de remplacement et l’extension de garantie. Le CEP+ ajoute notamment les pièces d’usure et le contrôle technique."
    },
    {
      theme: "Client professionnel",
      question: "Cliente : « Je suis artisan en nom propre avec 4 véhicules. Mon voisin, lui, a une SARL avec 4 véhicules aussi. On est traités pareil ? »",
      options: [
        "Oui, tant qu’on reste sous 10 véhicules, la forme juridique ne change rien.",
        "Oui, mais seulement si les deux véhicules sont entretenus dans le réseau.",
        "Non, l’artisan en nom propre peut être éligible, alors que la SARL fait partie des formes juridiques exclues.",
        "Non, car aucun professionnel n’est éligible à cette offre."
      ],
      correct: 2,
      explanation:
        "L’offre est ouverte aux artisans, commerçants et professions libérales agissant en nom propre avec une flotte de moins de 10 véhicules. Les sociétés de type SARL sont exclues."
    }
  ];

  let currentQuestion = 0;
  let selectedAnswer = null;
  let score = 0;
  let answered = false;

  const questionNumber = document.getElementById("questionNumber");
  const questionTheme = document.getElementById("questionTheme");
  const questionText = document.getElementById("questionText");
  const answersBox = document.getElementById("answersBox");
  const feedbackBox = document.getElementById("feedbackBox");
  const feedbackTitle = document.getElementById("feedbackTitle");
  const feedbackText = document.getElementById("feedbackText");
  const validateBtn = document.getElementById("validateBtn");
  const nextBtn = document.getElementById("nextBtn");
  const resultsCard = document.getElementById("resultsCard");
  const finalScoreValue = document.getElementById("finalScoreValue");
  const finalScorePercent = document.getElementById("finalScorePercent");
  const finalScoreText = document.getElementById("finalScoreText");
  const scoreBadge = document.getElementById("scoreBadge");
  const restartBtn = document.getElementById("restartBtn");

  if (
    !questionNumber ||
    !questionTheme ||
    !questionText ||
    !answersBox ||
    !feedbackBox ||
    !feedbackTitle ||
    !feedbackText ||
    !validateBtn ||
    !nextBtn ||
    !resultsCard ||
    !finalScoreValue ||
    !finalScorePercent ||
    !finalScoreText ||
    !scoreBadge ||
    !restartBtn
  ) {
    console.error("Un ou plusieurs éléments du QCM sont introuvables dans learning-dacia.html");
    return;
  }

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

    alert("Aucun vendeur actif n’est enregistré. Merci de revenir sur le portail pour renseigner le prénom et le nom du vendeur avant de lancer le module.");
    window.location.href = "index.html";
    return false;
  }

  function ensureDaciaEnvironment() {
    const selectedBrand = getSelectedBrand();

    if (!selectedBrand || selectedBrand === "dacia") {
      return true;
    }

    alert("Ce module correspond à l’univers Dacia. Merci de revenir au portail pour sélectionner le bon environnement.");
    window.location.href = "index.html";
    return false;
  }

  function createAnswerCard(optionText, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "step-card premium-step step-card-button";
    button.style.textAlign = "left";
    button.style.cursor = "pointer";
    button.style.minHeight = "unset";
    button.style.padding = "18px";

    button.innerHTML = `
      <div class="step-top" style="margin-bottom: 10px;">
        <span class="step-number">${String.fromCharCode(65 + index)}</span>
        <span class="step-tag">Réponse</span>
      </div>
      <p style="margin: 0; color: var(--text); line-height: 1.7;">${optionText}</p>
    `;

    button.addEventListener("click", () => {
      if (answered) return;

      selectedAnswer = index;
      resetAnswerStyles();

      button.style.borderColor = "rgba(214, 179, 106, 0.45)";
      button.style.background =
        "linear-gradient(180deg, rgba(214, 179, 106, 0.12) 0%, rgba(255,255,255,0.04) 100%)";
    });

    return button;
  }

  function resetAnswerStyles() {
    [...answersBox.children].forEach((child) => {
      child.style.borderColor = "rgba(255,255,255,0.07)";
      child.style.background =
        "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.02) 100%)";
    });
  }

  function renderQuestion() {
    const q = questions[currentQuestion];

    selectedAnswer = null;
    answered = false;

    questionNumber.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
    questionTheme.textContent = q.theme;
    questionText.textContent = q.question;

    feedbackBox.style.display = "none";
    feedbackTitle.textContent = "";
    feedbackText.textContent = "";

    validateBtn.style.display = "inline-flex";
    nextBtn.style.display = "none";

    answersBox.innerHTML = "";

    q.options.forEach((option, index) => {
      answersBox.appendChild(createAnswerCard(option, index));
    });
  }

  function validateAnswer() {
    if (selectedAnswer === null || answered) {
      return;
    }

    answered = true;
    const q = questions[currentQuestion];
    const isCorrect = selectedAnswer === q.correct;

    if (isCorrect) {
      score += 1;
      feedbackTitle.textContent = "Bonne réponse";
      feedbackTitle.style.color = "#ecd6a0";
    } else {
      feedbackTitle.textContent = "Réponse à retravailler";
      feedbackTitle.style.color = "#ffb3b3";
    }

    feedbackText.textContent = q.explanation;
    feedbackBox.style.display = "block";

    [...answersBox.children].forEach((child, index) => {
      if (index === q.correct) {
        child.style.borderColor = "rgba(214, 179, 106, 0.45)";
        child.style.background =
          "linear-gradient(180deg, rgba(214, 179, 106, 0.12) 0%, rgba(255,255,255,0.04) 100%)";
      } else if (index === selectedAnswer && selectedAnswer !== q.correct) {
        child.style.borderColor = "rgba(255, 120, 120, 0.35)";
        child.style.background =
          "linear-gradient(180deg, rgba(255, 120, 120, 0.10) 0%, rgba(255,255,255,0.03) 100%)";
      }
    });

    validateBtn.style.display = "none";
    nextBtn.style.display = "inline-flex";
  }

  function saveResults(percent) {
    const seller = getSellerIdentity();

    if (!seller.isReady) {
      return false;
    }

    localStorage.setItem("qcm_dacia_score", String(score));
    localStorage.setItem("qcm_dacia_total", String(questions.length));
    localStorage.setItem("qcm_dacia_percent", String(percent));

    return true;
  }

  function showResults() {
    const seller = getSellerIdentity();
    const percent = Math.round((score / questions.length) * 100);
    const saved = saveResults(percent);

    resultsCard.style.display = "block";
    finalScoreValue.textContent = `${score}/${questions.length}`;
    finalScorePercent.textContent = `${percent}%`;
    scoreBadge.textContent = `Score ${percent}%`;

    if (!seller.isReady || !saved) {
      finalScoreText.textContent =
        "Résultat calculé localement, mais non enregistré car aucun vendeur actif n’est défini. Revenez au portail pour renseigner le vendeur.";
    } else if (percent >= 75) {
      finalScoreText.textContent =
        `Très bon résultat pour ${seller.fullName}. Vous maîtrisez les points techniques clés du produit Dacia avant la mise en situation simulateur.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais plusieurs règles produit doivent encore être consolidées avant la simulation de vente.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux maîtriser les règles d’éligibilité, de couverture et de traitement client avant la mise en situation.`;
    }

    resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      return;
    }

    questionNumber.textContent = "Module terminé";
    questionTheme.textContent = "Résultat";
    questionText.textContent = "Le module Dacia est terminé.";
    answersBox.innerHTML = "";
    feedbackBox.style.display = "none";
    validateBtn.style.display = "none";
    nextBtn.style.display = "none";

    showResults();
  }

  function restartQuiz() {
    currentQuestion = 0;
    selectedAnswer = null;
    score = 0;
    answered = false;

    resultsCard.style.display = "none";
    renderQuestion();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  validateBtn.addEventListener("click", validateAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);

  if (!ensureSellerIdentity()) {
    return;
  }

  if (!ensureDaciaEnvironment()) {
    return;
  }

  renderQuestion();
});
