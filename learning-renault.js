document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("selected_brand", "renault");

  const questions = [
    {
      theme: "Découverte client",
      question: "Avant de proposer un Contrat Entretien Privilèges, quel est le meilleur premier réflexe vendeur ?",
      options: [
        "Présenter directement le CEP+ pour gagner du temps.",
        "Commencer par découvrir l’usage du véhicule, les attentes du client et ce qui compte vraiment pour lui.",
        "Attendre que le client demande lui-même s’il existe un contrat.",
        "Éviter les questions pour garder un échange rapide."
      ],
      correct: 1,
      explanation:
        "La bonne posture vendeur commence par la découverte. Avant de proposer un contrat, il faut comprendre l’usage, les attentes et le cadre de décision du client."
    },
    {
      theme: "Éligibilité produit",
      question: "Quel véhicule est éligible à la souscription d’un Contrat Entretien Privilèges ?",
      options: [
        "Un véhicule de 9 ans avec 110 000 km.",
        "Un véhicule de 7 ans et 4 mois avec 125 000 km.",
        "Un véhicule de 8 ans et 3 mois avec 95 000 km.",
        "Un véhicule de 6 ans avec 150 000 km."
      ],
      correct: 2,
      explanation:
        "La souscription est possible de 1 à 8 ans + 6 mois de souplesse, avec un maximum de 120 000 km au compteur au moment de la souscription."
    },
    {
      theme: "Moment clé de vente",
      question: "Dans quel cas la proposition du Contrat Entretien Privilèges est-elle particulièrement pertinente ?",
      options: [
        "Uniquement si le client demande explicitement un contrat.",
        "À la livraison d’un VO, lors d’une intervention atelier, à la fin de garantie constructeur ou avec chaque devis entretien.",
        "Seulement après une grosse panne.",
        "Uniquement au moment de la vente d’un véhicule neuf."
      ],
      correct: 1,
      explanation:
        "Le bon réflexe est de proposer le contrat à tous les moments clés : livraison VO, atelier, fin de garantie et accompagnement d’un devis entretien."
    },
    {
      theme: "Connaissance produit",
      question: "Quelle différence majeure distingue le Contrat Entretien Privilèges + du Contrat Entretien Privilèges ?",
      options: [
        "Le CEP+ ajoute les pièces d’usure et le contrôle technique.",
        "Le CEP+ supprime l’assistance mais ajoute la carrosserie.",
        "Le CEP+ couvre le multimédia et les rétroviseurs électriques.",
        "Le CEP+ est réservé uniquement aux véhicules électriques."
      ],
      correct: 0,
      explanation:
        "Le CEP comprend notamment assistance, entretien, véhicule de remplacement et éléments liés au programme d’entretien. Le CEP+ ajoute les pièces d’usure, le contrôle technique et d’autres postes complémentaires."
    },
    {
      theme: "Mensualités",
      question: "Pour un véhicule Renault diesel âgé de 1 à 5 ans, quelles sont les mensualités CEP et CEP+ ?",
      options: [
        "CEP 39 € / CEP+ 69 €",
        "CEP 49 € / CEP+ 79 €",
        "CEP 45 € / CEP+ 69 €",
        "CEP 59 € / CEP+ 89 €"
      ],
      correct: 1,
      explanation:
        "Pour les véhicules Renault diesel de 1 à 5 ans, les mensualités sont de 49 € pour le CEP et 79 € pour le CEP+."
    },
    {
      theme: "Professionnels éligibles",
      question: "Quel professionnel est éligible à l’offre Contrat Entretien Privilèges ?",
      options: [
        "Une SARL avec 6 véhicules.",
        "Un artisan agissant en nom propre avec 4 véhicules.",
        "Une société commerciale avec 2 véhicules.",
        "Une SARL familiale avec 1 véhicule."
      ],
      correct: 1,
      explanation:
        "Les professionnels éligibles sont les artisans, commerçants et professions libérales agissant exclusivement en nom propre, avec une flotte de moins de 10 véhicules. Les sociétés de type SARL sont exclues."
    },
    {
      theme: "Objection client",
      question: "Client : « Je verrai plus tard. » Quelle réponse est la plus juste ?",
      options: [
        "D’accord, on en reparle quand vous voulez.",
        "Vous pourrez souscrire plus tard, mais la révision déjà faite ne sera pas comprise. En le prenant aujourd’hui, vous gardez l’avantage complet.",
        "Si vous hésitez, c’est que vous n’en avez pas besoin.",
        "Attendez une panne importante, ce sera plus parlant."
      ],
      correct: 1,
      explanation:
        "C’est la réponse conseillée dans le guide : plus tard reste possible, mais la révision déjà passée ne sera pas comprise. La prise aujourd’hui conserve l’intérêt complet du contrat."
    },
    {
      theme: "Closing",
      question: "Après une bonne découverte et une argumentation cohérente, quelle conclusion est la plus juste ?",
      options: [
        "Bon, à vous de voir, moi j’ai fini.",
        "Si cette logique de protection, de suivi et de maîtrise du budget correspond bien à votre besoin, est-ce qu’on le met en place aujourd’hui ?",
        "Je peux vous laisser repartir et on verra peut-être plus tard.",
        "Il faut décider vite sinon vous allez forcément le regretter."
      ],
      correct: 1,
      explanation:
        "Le closing doit être clair, naturel et assumé. Il prolonge la logique de valeur construite pendant l’échange, sans pression maladroite."
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
        `Très bon résultat pour ${seller.fullName}. Vous avez de bons réflexes vendeur pour proposer et défendre les Contrats Entretien Privilèges avec cohérence.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais la vente des Contrats Entretien Privilèges doit encore être consolidée, notamment sur la découverte du besoin, la connaissance produit et la conclusion.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux structurer la vente des Contrats Entretien Privilèges, de la découverte jusqu’au closing.`;
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

