document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("selected_brand", "renault");

  const questions = [
    {
      theme: "Découverte client",
      question: "Avant de proposer une solution Renault, quel est le meilleur premier réflexe vendeur ?",
      options: [
        "Présenter directement CEP+ pour gagner du temps.",
        "Commencer par découvrir l’usage du véhicule, les attentes du client et ce qui compte vraiment pour lui.",
        "Attendre que le client pose lui-même une question sur les contrats.",
        "Éviter les questions pour ne pas alourdir l’échange."
      ],
      correct: 1,
      explanation:
        "La bonne posture Renault commence par la découverte. Le vendeur doit comprendre l’usage, les attentes et le cadre de décision du client avant de recommander une solution."
    },
    {
      theme: "Éligibilité",
      question: "Quel contrôle est prioritaire avant d’aller plus loin dans la proposition d’un contrat Renault ?",
      options: [
        "Vérifier si le client connaît déjà le produit.",
        "Vérifier l’éligibilité du véhicule selon son âge et son kilométrage.",
        "Vérifier si le client préfère payer comptant.",
        "Vérifier si le client a déjà acheté un véhicule neuf chez Renault."
      ],
      correct: 1,
      explanation:
        "Avant toute argumentation, le vendeur doit sécuriser la faisabilité. L’éligibilité du véhicule est un prérequis logique avant de présenter une offre."
    },
    {
      theme: "Fin de garantie",
      question: "Un client arrive avec un véhicule en fin de garantie. Quel angle est le plus pertinent ?",
      options: [
        "Dire qu’après la garantie, il n’y a plus vraiment de solution à proposer.",
        "Présenter cela comme un moment logique pour sécuriser la suite de l’entretien et de la protection du véhicule.",
        "Attendre la prochaine panne pour reparler du sujet.",
        "Insister uniquement sur le prestige de la marque Renault."
      ],
      correct: 1,
      explanation:
        "La fin de garantie est un moment clé. Le bon réflexe est de relier ce passage à une continuité de protection, de suivi et de sérénité pour le client."
    },
    {
      theme: "Facture atelier",
      question: "Après une facture atelier élevée, quelle posture vendeur est la plus solide ?",
      options: [
        "Éviter le sujet pour ne pas raviver la frustration du client.",
        "Dire que ce genre de facture est normal et qu’il faut s’y habituer.",
        "Transformer la dépense subie en réflexion sur l’anticipation, la lisibilité budgétaire et les imprévus évitables.",
        "Proposer immédiatement l’offre la plus complète sans explication."
      ],
      correct: 2,
      explanation:
        "Une facture élevée peut devenir un levier commercial si elle est reliée intelligemment à la maîtrise budgétaire et à l’intérêt d’anticiper plutôt que subir."
    },
    {
      theme: "Client professionnel",
      question: "Avec un client professionnel, quel bénéfice doit être mis en avant en priorité ?",
      options: [
        "Le plaisir de conduite uniquement.",
        "L’image premium du réseau.",
        "La continuité d’usage, la maîtrise du budget et la limitation des immobilisations.",
        "Le fait que d’autres professionnels prennent déjà ce type d’offre."
      ],
      correct: 2,
      explanation:
        "Pour un professionnel, l’argument central est concret : véhicule disponible, charges plus lisibles, activité moins perturbée par les imprévus."
    },
    {
      theme: "Recommandation vendeur",
      question: "Quel comportement vendeur est le plus juste au moment de recommander une solution Renault ?",
      options: [
        "Faire une recommandation claire, reliée à l’usage réel du client.",
        "Lister toutes les possibilités sans jamais prendre position.",
        "Toujours pousser l’offre la plus haute, même si le besoin n’est pas démontré.",
        "Attendre que le client choisisse seul pour éviter toute responsabilité."
      ],
      correct: 0,
      explanation:
        "Le vendeur doit assumer sa recommandation. Une bonne proposition Renault est claire, argumentée et adaptée au besoin découvert."
    },
    {
      theme: "Objection",
      question: "Client : « Je vais réfléchir. » Quelle réponse est la plus solide ?",
      options: [
        "D’accord, revenez quand vous voulez, on verra plus tard.",
        "Très bien, je préfère ne pas influencer votre décision.",
        "Je comprends. L’idée n’est pas de vous forcer, mais de voir si cette solution a vraiment du sens maintenant par rapport à votre usage et à ce qu’elle vous permet d’anticiper.",
        "Si vous hésitez, c’est que vous n’en avez sans doute pas besoin."
      ],
      correct: 2,
      explanation:
        "La bonne réponse ne casse pas le client, mais elle ne laisse pas non plus l’échange retomber. Elle recentre sur la cohérence de la solution au bon moment."
    },
    {
      theme: "Closing",
      question: "Après une bonne découverte et une argumentation cohérente, quelle conclusion est la plus juste ?",
      options: [
        "Bon, à vous de voir, moi j’ai fini.",
        "Si cette logique de protection, de suivi et de maîtrise correspond bien à votre besoin, est-ce qu’on le met en place aujourd’hui ?",
        "Je peux vous laisser repartir et on en reparlera peut-être une autre fois.",
        "Il faut décider vite, sinon vous allez forcément le regretter."
      ],
      correct: 1,
      explanation:
        "Le closing Renault doit être clair, naturel et assumé. Il prolonge la logique de valeur construite pendant l’échange, sans pression maladroite."
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
    console.error("Un ou plusieurs éléments du QCM sont introuvables dans learning-renault.html");
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

  function ensureRenaultEnvironment() {
    const selectedBrand = getSelectedBrand();

    if (!selectedBrand || selectedBrand === "renault") {
      return true;
    }

    alert("Ce module correspond à l’univers Renault. Merci de revenir sur le portail pour sélectionner le bon environnement.");
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

    localStorage.setItem("qcm_renault_score", String(score));
    localStorage.setItem("qcm_renault_total", String(questions.length));
    localStorage.setItem("qcm_renault_percent", String(percent));

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
        `Très bon résultat pour ${seller.fullName}. Vous avez de bons réflexes Renault sur la découverte, la recommandation, l’objection et la conclusion commerciale.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais le parcours Renault doit encore être consolidé, notamment sur la logique de recommandation et la conduite d’échange.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux structurer la découverte, la proposition et la conclusion dans un échange vendeur Renault.`;
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
    questionText.textContent = "Le module Renault est terminé.";
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

  if (!ensureRenaultEnvironment()) {
    return;
  }

  renderQuestion();
});

