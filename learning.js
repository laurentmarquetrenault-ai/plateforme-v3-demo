document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      theme: "Éligibilité",
      question: "Cliente : « Mon véhicule a 8 ans et 4 mois et 118 000 km. Je peux encore souscrire ? »",
      options: [
        "Non, dès que le véhicule a plus de 8 ans, la souscription est impossible.",
        "Oui, car l’éligibilité va jusqu’à 8 ans + 6 mois de souplesse, avec un maximum de 120 000 km à la souscription.",
        "Oui, mais uniquement sur la formule CEP+.",
        "Non, parce qu’à partir de 8 ans il faut moins de 100 000 km."
      ],
      correct: 1,
      explanation:
        "La souscription est possible de 1 à 8 ans + 6 mois de souplesse, avec un maximum de 120 000 km à la souscription. Ici, le véhicule reste donc éligible."
    },
    {
      theme: "Résiliation",
      question: "Cliente : « Si je résilie mon contrat plus tard, je récupère simplement ce qu’il reste à payer, sans frais ? »",
      options: [
        "Oui, la résiliation est toujours gratuite.",
        "Non, il existe un calcul au prorata des mensualités réglées et du montant des factures atelier, avec 38 € de frais de résiliation hors rachat du véhicule dans le réseau.",
        "Non, un contrat signé ne peut jamais être résilié.",
        "Oui, mais seulement si aucune révision n’a encore été faite."
      ],
      correct: 1,
      explanation:
        "Le contrat est résiliable, mais pas sans condition. La résiliation se fait au prorata des mensualités réglées et du montant des factures atelier, avec 38 € de frais, hors cas de rachat du véhicule dans le réseau."
    },
    {
      theme: "Cessibilité",
      question: "Cliente : « Si je revends mon véhicule, mon contrat est perdu automatiquement ? »",
      options: [
        "Oui, en cas de revente le contrat disparaît forcément.",
        "Non, le contrat peut être cessible ou résiliable selon le cas.",
        "Oui, sauf si le repreneur est un professionnel.",
        "Non, mais seulement sur CEP+, pas sur CEP."
      ],
      correct: 1,
      explanation:
        "Le contrat est bien cessible ou résiliable. Le vendeur doit donc connaître cette souplesse et ne jamais présenter le contrat comme automatiquement perdu en cas de revente."
    },
    {
      theme: "Dacia Zen",
      question: "Cliente : « J’ai une Dacia de 6 ans, 90 000 km. Avec Dacia Zen, l’écran multimédia est couvert lui aussi ? »",
      options: [
        "Oui, Dacia Zen couvre tout ce qui est mécanique, électrique, électronique et multimédia.",
        "Oui, à condition de choisir la formule Essentielle +.",
        "Non, car le multimédia fait partie des exclusions de Dacia Zen.",
        "Non, car Dacia Zen ne peut plus s’appliquer à partir de 6 ans."
      ],
      correct: 2,
      explanation:
        "Dacia Zen couvre des pièces mécaniques, électriques et électroniques, mais exclut notamment le multimédia, la carrosserie, les rétros électriques et les réseaux dégivrants."
    },
    {
      theme: "Conditions Dacia Zen",
      question: "Cliente : « Ma voiture a 7 ans et 155 000 km. Je roule peu maintenant, donc pour Dacia Zen c’est encore possible ? »",
      options: [
        "Oui, car seule l’ancienneté compte.",
        "Oui, si le véhicule est encore bien entretenu dans le réseau.",
        "Non, car Dacia Zen est plafonnée à 150 000 km maximum de couverture constructeur.",
        "Non, car Dacia Zen s’arrête obligatoirement à 5 ans."
      ],
      correct: 2,
      explanation:
        "Pour Dacia Zen, le véhicule doit être entre 3 et 7 ans maximum, avec une couverture constructeur allant jusqu’à 150 000 km maximum et 30 000 km maximum par an. À 155 000 km, ce n’est plus dans le cadre."
    },
    {
      theme: "CEP vs CEP+",
      question: "Cliente : « Concrètement, quelle est la différence entre CEP et CEP+ ? »",
      options: [
        "Il n’y en a pas vraiment, CEP et CEP+ couvrent la même chose.",
        "CEP couvre l’entretien, l’assistance, le véhicule de remplacement et l’extension de garantie ; CEP+ ajoute notamment les pièces d’usure et le contrôle technique.",
        "CEP couvre seulement l’assistance ; CEP+ couvre seulement l’entretien.",
        "CEP inclut les amortisseurs, mais CEP+ non."
      ],
      correct: 1,
      explanation:
        "Le CEP couvre assistance, entretien, véhicule de remplacement et extension de garantie. Le CEP+ ajoute notamment les pièces d’usure, le contrôle technique, MyCheckUp et la contre-visite."
    },
    {
      theme: "Client professionnel",
      question: "Cliente : « Je suis gérante d’une SARL avec 6 véhicules. Je peux souscrire ce contrat sur mon parc ? »",
      options: [
        "Oui, car la flotte est inférieure à 10 véhicules.",
        "Oui, mais seulement sur CEP et pas sur CEP+.",
        "Non, car les sociétés de type SARL sont exclues.",
        "Non, car les clients professionnels sont tous exclus."
      ],
      correct: 2,
      explanation:
        "L’offre est disponible pour les artisans, commerçants et professions libérales agissant en nom propre avec une flotte de moins de 10 véhicules. Les formes juridiques de type société, comme la SARL, sont exclues."
    },
    {
      theme: "Fin de contrat",
      question: "Cliente : « Si je souscris tard, jusqu’où peut aller mon contrat au maximum ? »",
      options: [
        "La couverture peut aller jusqu’à 48 mois maximum, avec une fin de contrat possible jusqu’à 200 000 km et jusqu’à 12 ans et demi maximum selon l’âge de départ.",
        "Le contrat peut durer sans vraie limite tant que le client paie.",
        "Le contrat s’arrête forcément au 8e anniversaire du véhicule.",
        "La seule limite, c’est de rester sous 150 000 km."
      ],
      correct: 0,
      explanation:
        "Le cadre global à maîtriser est le suivant : 48 mois de couverture maximum, avec une fin de contrat plafonnée à 200 000 km et jusqu’à 12 ans et demi maximum selon l’âge du véhicule au départ."
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
    console.error("Un ou plusieurs éléments du QCM sont introuvables dans learning.html");
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

  renderQuestion();
});
