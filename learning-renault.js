document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      theme: "Découverte",
      question: "Client : « Je viens pour ma révision, mais je ne veux pas qu’on me vende quelque chose d’inutile. » Quelle est la meilleure ouverture ?",
      options: [
        "Je comprends, je vais juste vous proposer le contrat directement.",
        "Avant de vous proposer quoi que ce soit, je vais d’abord comprendre votre usage et vos attentes.",
        "Sans contrat, vous risquez forcément une panne importante.",
        "On verra ça à la fin si j’ai le temps."
      ],
      correct: 1,
      explanation:
        "Le bon réflexe commercial commence par la découverte : usage, attentes, contraintes et sens pour le client."
    },
    {
      theme: "Budget",
      question: "Client : « Ce qui m’intéresse surtout, c’est d’éviter les grosses dépenses imprévues. » Quel angle est le plus pertinent ?",
      options: [
        "Il faut surtout parler de design produit.",
        "Il faut mettre en avant la logique de budget lissé et de meilleure visibilité dans le temps.",
        "Il faut éviter de parler du prix mensuel.",
        "Il faut répondre que ce n’est pas le sujet principal."
      ],
      correct: 1,
      explanation:
        "Quand le client veut éviter les imprévus, le bon angle est la maîtrise budgétaire et la lisibilité des coûts."
    },
    {
      theme: "Valeur client",
      question: "Quel argument a le plus de valeur si le client garde son véhicule plusieurs années ?",
      options: [
        "La tranquillité dans la durée et l’entretien suivi dans le réseau.",
        "Le fait que le contrat soit obligatoire.",
        "Le fait qu’il n’aura plus besoin de réfléchir à rien, quel que soit le cas.",
        "La seule existence d’un badge premium."
      ],
      correct: 0,
      explanation:
        "Pour un client qui garde longtemps son véhicule, la logique d’entretien suivi, de sérénité et de visibilité est l’angle le plus crédible."
    },
    {
      theme: "Objection",
      question: "Client : « Je vais réfléchir, je ne suis pas sûr que ce soit rentable. » Quelle posture est la plus juste ?",
      options: [
        "Le laisser partir sans rien creuser.",
        "Lui répondre que tous les clients prennent cette solution.",
        "Creuser son hésitation puis relier la solution à son usage réel et à son besoin de maîtrise.",
        "Lui dire qu’il a tort de réfléchir."
      ],
      correct: 2,
      explanation:
        "Une objection n’est pas un refus sec : il faut comprendre ce qui bloque, reformuler et réancrer la valeur dans le concret."
    },
    {
      theme: "Usage professionnel",
      question: "Avec un client professionnel, quel angle complémentaire est le plus pertinent ?",
      options: [
        "L’esthétique du véhicule.",
        "L’impact sur l’activité, la continuité d’usage et la réduction des immobilisations.",
        "Le fait qu’il paiera toujours plus cher.",
        "Le fait qu’il n’aura jamais d’aléa."
      ],
      correct: 1,
      explanation:
        "Avec un client pro, il faut parler activité, continuité d’usage, temps perdu évité et meilleure visibilité sur les charges."
    },
    {
      theme: "Conclusion",
      question: "Quelle formulation ressemble le plus à une vraie tentative de closing ?",
      options: [
        "Bon, vous me direz peut-être plus tard.",
        "Je vous laisse réfléchir sans rien formaliser.",
        "Souhaitez-vous qu’on le mette en place aujourd’hui pour sécuriser votre suivi ?",
        "Je ne vais pas insister."
      ],
      correct: 2,
      explanation:
        "Une conclusion solide doit formuler une proposition claire et inviter le client à décider."
    },
    {
      theme: "Posture vendeur",
      question: "Quel comportement affaiblit le plus la crédibilité du vendeur ?",
      options: [
        "Poser des questions sur l’usage.",
        "Faire un lien entre besoin et solution.",
        "Dire “comme vous voulez” sans défendre la valeur de la proposition.",
        "Reformuler une objection."
      ],
      correct: 2,
      explanation:
        "Une posture trop passive détruit la valeur perçue de la recommandation commerciale."
    },
    {
      theme: "Parcours",
      question: "Après un bon résultat au module d’apprentissage Renault, quelle est l’étape logique suivante ?",
      options: [
        "Sortir de la plateforme.",
        "Passer directement à un autre vendeur.",
        "Entrer dans la simulation Renault pour appliquer les acquis.",
        "Supprimer le score."
      ],
      correct: 2,
      explanation:
        "Le module prépare la mise en situation. La suite logique est donc le simulateur Renault."
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

    alert("Ce module correspond à l’univers Renault. Merci de revenir au portail pour sélectionner le bon environnement.");
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
        `Très bon résultat pour ${seller.fullName}. La base Renault est bien maîtrisée avant la simulation.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais plusieurs réflexes Renault doivent encore être consolidés avant la mise en situation.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux maîtriser la découverte, la valeur client, les objections et la conclusion avant la simulation.`;
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
