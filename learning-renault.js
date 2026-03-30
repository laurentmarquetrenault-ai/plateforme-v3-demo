document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      theme: "Éligibilité",
      question: "Client : « Ma Renault a 8 ans et 5 mois avec 119 000 km. Elle peut encore entrer dans le Contrat Entretien Privilèges ? »",
      options: [
        "Oui, car elle reste dans la limite de 8 ans + 6 mois et sous 120 000 km à la souscription.",
        "Non, car à partir de 8 ans aucun véhicule n’est plus éligible.",
        "Oui, mais uniquement sur CEP et pas sur CEP+.",
        "Non, car à partir de 100 000 km la souscription est impossible."
      ],
      correct: 0,
      explanation:
        "La souscription est possible de 1 à 8 ans + 6 mois maximum, avec un maximum de 120 000 km au compteur. Ici, l’âge et le kilométrage restent dans le cadre de souscription."
    },
    {
      theme: "Éligibilité",
      question: "Client : « Mon véhicule a 7 ans et 10 mois, mais il affiche 120 300 km. On peut quand même le passer ? »",
      options: [
        "Oui, car l’âge est recevable et un léger dépassement kilométrique est toléré.",
        "Oui, si le client choisit directement le CEP+.",
        "Non, car même si l’âge est bon, le kilométrage dépasse la limite maximale de souscription fixée à 120 000 km.",
        "Non, car à plus de 7 ans seuls les véhicules diesel sont éligibles."
      ],
      correct: 2,
      explanation:
        "Les deux critères doivent être respectés à la souscription : âge et kilométrage. Ici, l’âge reste recevable, mais le véhicule dépasse les 120 000 km autorisés."
    },
    {
      theme: "Résiliation / Cessibilité",
      question: "Client : « Si je revends ma voiture ou si j’arrête le contrat, je perds tout automatiquement ? »",
      options: [
        "Oui, un contrat signé est définitivement bloqué.",
        "Non, car le contrat peut être cessible ou résiliable selon les conditions prévues, avec 38 € de frais de résiliation hors rachat réseau.",
        "Oui, sauf si la voiture est revendue dans le réseau Renault.",
        "Non, mais uniquement pendant les 6 premiers mois."
      ],
      correct: 1,
      explanation:
        "Le contrat est cessible ou résiliable. En cas de résiliation, il existe des frais de 38 € hors cas de rachat du véhicule dans le réseau, avec une logique de calcul prévue dans les conditions."
    },
    {
      theme: "CEP vs CEP+",
      question: "Client : « Moi je veux une formule qui couvre aussi les amortisseurs, le freinage et le contrôle technique. Quelle offre correspond vraiment ? »",
      options: [
        "Le CEP, car il couvre déjà l’ensemble des pièces d’usure et le contrôle technique.",
        "Le CEP+, car il ajoute notamment les pièces d’usure et le contrôle technique.",
        "Le CEP, mais seulement pour les véhicules thermiques.",
        "Les deux offres se valent sur ces éléments."
      ],
      correct: 1,
      explanation:
        "Le CEP couvre l’entretien, l’assistance et plusieurs opérations prévues au contrat. Le CEP+ ajoute notamment les pièces d’usure et le contrôle technique, ce qui correspond au besoin exprimé."
    },
    {
      theme: "Mensualités",
      question: "Client : « J’ai une Renault essence de 4 ans. Le tarif CEP+, c’est bien 69 € par mois ? »",
      options: [
        "Oui, pour un véhicule Renault essence ou GPL de 1 à 5 ans, le CEP+ est à 69 € par mois.",
        "Non, le CEP+ est à 59 € par mois.",
        "Oui, mais seulement pour les hybrides.",
        "Non, à 4 ans il n’existe qu’une mensualité unique à 49 €."
      ],
      correct: 0,
      explanation:
        "Pour les véhicules Renault essence & GPL de 1 à 5 ans, les mensualités sont de 39 € en CEP et 69 € en CEP+."
    },
    {
      theme: "Mensualités",
      question: "Client : « Mon véhicule électrique Renault a 7 ans. Vous me confirmez que le CEP est à 25 € par mois et le CEP+ à 39 € ? »",
      options: [
        "Non, ce tarif correspond aux hybrides.",
        "Oui, pour un véhicule électrique Renault de 6 à 8 ans + 6 mois, le CEP est à 25 € et le CEP+ à 39 €.",
        "Non, après 6 ans il n’existe plus d’offre sur les véhicules électriques.",
        "Oui, mais uniquement sur les utilitaires électriques."
      ],
      correct: 1,
      explanation:
        "Pour les véhicules électriques Renault de 6 à 8 ans + 6 mois, les mensualités sont bien de 25 € pour le CEP et 39 € pour le CEP+."
    },
    {
      theme: "Client professionnel",
      question: "Client : « Je suis artisan en nom propre avec 6 véhicules. Mon ami a une SARL avec 6 véhicules aussi. On peut souscrire tous les deux ? »",
      options: [
        "Oui, tant qu’on reste sous 10 véhicules, la forme juridique n’a pas d’importance.",
        "Oui, mais uniquement si les véhicules sont tous entretenus dans le réseau Renault.",
        "Non, l’artisan en nom propre peut être éligible, mais la SARL fait partie des formes juridiques exclues.",
        "Non, car aucun professionnel n’est éligible à l’offre."
      ],
      correct: 2,
      explanation:
        "L’offre est ouverte aux artisans, commerçants et professions libérales agissant en nom propre avec une flotte de moins de 10 véhicules. Les formes juridiques de type société, comme la SARL, sont exclues."
    },
    {
      theme: "Objection commerciale",
      question: "Client : « Je roule peu, donc ce contrat n’a pas grand intérêt pour moi. » Quelle réponse est la plus juste ?",
      options: [
        "Vous avez raison, le contrat est surtout utile aux gros rouleurs.",
        "Même en roulant peu, le temps et l’usure continuent d’agir. Le contrat permet justement d’anticiper ces frais et de garder de la tranquillité.",
        "Dans ce cas il vaut mieux attendre une grosse panne avant de décider.",
        "Le contrat ne sert qu’aux clients qui font plus de 30 000 km par an."
      ],
      correct: 1,
      explanation:
        "La bonne logique commerciale consiste à rappeler que même avec peu de kilomètres, le temps, l’usure et les échéances d’entretien continuent d’exister. L’intérêt du contrat reste donc réel."
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

  function ensureSellerIdentity() {
    const seller = getSellerIdentity();

    if (seller.isReady) {
      return true;
    }

    alert("Aucun vendeur actif n’est enregistré. Merci de revenir sur le portail pour renseigner le prénom et le nom du vendeur avant de lancer le module.");
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
        `Très bon résultat pour ${seller.fullName}. Vous maîtrisez les points techniques clés du produit Renault avant la mise en situation simulateur.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais plusieurs règles produit Renault doivent encore être consolidées avant la simulation de vente.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux maîtriser les règles d’éligibilité, de couverture, de mensualités et de traitement client avant la mise en situation.`;
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

  renderQuestion();
});
