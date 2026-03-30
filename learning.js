document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      theme: "Éligibilité",
      question: "Cliente : « Mon véhicule a déjà 200 000 km, je peux quand même prendre ce contrat ? »",
      options: [
        "Oui, ce n’est pas gênant si le véhicule roule encore bien.",
        "Il faut d’abord vérifier le cadre d’éligibilité, car on ne propose pas un contrat hors conditions.",
        "Oui, mais seulement si vous prenez directement la formule la plus complète."
      ],
      correct: 1,
      explanation: "Le bon réflexe vendeur est de rester dans le cadre produit. On ne promet jamais un contrat sans vérifier l’éligibilité du véhicule."
    },
    {
      theme: "Réflexe métier",
      question: "Cliente : « Avant de me parler du contrat, qu’est-ce que vous devez vérifier sur mon véhicule ? »",
      options: [
        "L’année, le kilométrage, l’absence éventuelle de contrat existant et la faisabilité du dossier.",
        "Seulement la motorisation.",
        "Seulement le prix de la prochaine révision."
      ],
      correct: 0,
      explanation: "Avant toute proposition, le vendeur doit avoir un réflexe complet de vérification : âge, kilométrage, contrat existant et faisabilité."
    },
    {
      theme: "Argumentaire",
      question: "Cliente : « Je ne vois pas trop pourquoi je prendrais ce type de contrat, vous me le présentez comment ? »",
      options: [
        "Je commence directement par la mensualité pour aller vite.",
        "Je vous le présente comme une solution de tranquillité avec budget maîtrisé et entretien encadré dans le réseau.",
        "Je vous le propose surtout parce que beaucoup de clients le prennent."
      ],
      correct: 1,
      explanation: "Le bon angle d’introduction part de la valeur pour le client : sérénité, maîtrise du budget, entretien suivi et couverture."
    },
    {
      theme: "Objection prix",
      question: "Cliente : « Franchement, votre contrat, ça me paraît cher pour ce que c’est. »",
      options: [
        "Je comprends, mais une panne ou une intervention hors cadre peut coûter bien plus cher qu’une mensualité maîtrisée.",
        "Si c’est trop cher, on peut laisser tomber.",
        "De toute façon, c’est le tarif fixé, je ne peux rien faire."
      ],
      correct: 0,
      explanation: "La bonne réponse remet en avant la logique de valeur et de protection, sans abandonner ni se réfugier derrière un tarif."
    },
    {
      theme: "Objection usage",
      question: "Cliente : « Moi je roule très peu, donc je ne suis pas sûre que ce soit utile. »",
      options: [
        "Si vous roulez peu, le contrat n’a effectivement pas beaucoup d’intérêt.",
        "Même avec peu de kilomètres, l’intérêt peut rester fort car la tranquillité, le temps et la couverture comptent aussi.",
        "Dans ce cas, il faut seulement attendre une panne."
      ],
      correct: 1,
      explanation: "Le vendeur doit montrer que la valeur d’un contrat ne dépend pas uniquement du kilométrage, mais aussi du temps, du budget et de la sérénité."
    },
    {
      theme: "Closing",
      question: "Cliente : « Je préfère réfléchir et voir plus tard. »",
      options: [
        "D’accord, on laisse ça de côté sans approfondir.",
        "Je peux comprendre, mais plus tard certaines opportunités ne seront plus dans le même cadre ; si c’est pertinent pour vous, on peut le poser maintenant.",
        "Ce n’est pas grave, on en reparlera peut-être un jour."
      ],
      correct: 1,
      explanation: "Le vendeur doit savoir relancer intelligemment, sans forcer, en donnant une raison concrète d’agir maintenant."
    },
    {
      theme: "Valeur revente",
      question: "Cliente : « Et si je revends mon véhicule, mon contrat ne sert plus à rien ? »",
      options: [
        "Oui, dans ce cas tout est perdu.",
        "Pas forcément : un véhicule suivi, entretenu et couvert peut aussi rassurer et soutenir la valeur perçue à la revente.",
        "Ce point n’a aucun intérêt pour un acheteur."
      ],
      correct: 1,
      explanation: "Le contrat peut devenir un argument de valeur, car il renforce la crédibilité de l’entretien et rassure un futur acheteur."
    },
    {
      theme: "Proposition finale",
      question: "Cliente : « Bon… au final, qu’est-ce que vous me conseillez concrètement ? »",
      options: [
        "Je vous conseille de ne rien décider aujourd’hui.",
        "Je vous fais une recommandation claire, adaptée à votre situation, avec une vraie proposition concrète.",
        "Je vous laisse comparer seule et revenir plus tard."
      ],
      correct: 1,
      explanation: "La simulation attend une vraie proposition. Le vendeur doit assumer une recommandation claire et guider la décision."
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
    !questionNumber || !questionTheme || !questionText || !answersBox ||
    !feedbackBox || !feedbackTitle || !feedbackText ||
    !validateBtn || !nextBtn || !resultsCard ||
    !finalScoreValue || !finalScorePercent || !finalScoreText ||
    !scoreBadge || !restartBtn
  ) {
    console.error("Un ou plusieurs éléments du QCM sont introuvables dans learning.html");
    return;
  }

  function renderQuestion() {
    const q = questions[currentQuestion];
    selectedAnswer = null;
    answered = false;

    questionNumber.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
    questionTheme.textContent = q.theme;
    questionText.textContent = q.question;

    feedbackBox.style.display = "none";
    nextBtn.style.display = "none";
    validateBtn.style.display = "inline-flex";

    answersBox.innerHTML = "";

    q.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-card premium-step";
      button.style.textAlign = "left";
      button.style.cursor = "pointer";
      button.style.minHeight = "unset";
      button.style.padding = "18px";
      button.innerHTML = `
        <div class="step-top" style="margin-bottom:10px;">
          <span class="step-number">${String.fromCharCode(65 + index)}</span>
          <span class="step-tag">Réponse</span>
        </div>
        <p style="margin:0; color: var(--text); line-height:1.7;">${option}</p>
      `;

      button.addEventListener("click", () => {
        if (answered) return;
        selectedAnswer = index;

        [...answersBox.children].forEach((child) => {
          child.style.borderColor = "rgba(255,255,255,0.08)";
          child.style.background = "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)";
        });

        button.style.borderColor = "rgba(214, 179, 106, 0.45)";
        button.style.background = "linear-gradient(180deg, rgba(214, 179, 106, 0.12) 0%, rgba(255,255,255,0.04) 100%)";
      });

      answersBox.appendChild(button);
    });
  }

  function validateAnswer() {
    if (selectedAnswer === null || answered) return;

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
        child.style.background = "linear-gradient(180deg, rgba(214, 179, 106, 0.12) 0%, rgba(255,255,255,0.04) 100%)";
      } else if (index === selectedAnswer && selectedAnswer !== q.correct) {
        child.style.borderColor = "rgba(255, 120, 120, 0.35)";
        child.style.background = "linear-gradient(180deg, rgba(255, 120, 120, 0.10) 0%, rgba(255,255,255,0.03) 100%)";
      }
    });

    validateBtn.style.display = "none";
    nextBtn.style.display = "inline-flex";
  }

  function showResults() {
    const percent = Math.round((score / questions.length) * 100);

    resultsCard.style.display = "block";
    finalScoreValue.textContent = `${score}/${questions.length}`;
    finalScorePercent.textContent = `${percent}%`;
    scoreBadge.textContent = `Score ${percent}%`;

    if (percent >= 75) {
      finalScoreText.textContent = "Très bon résultat. Vous avez les bons réflexes pour aborder le simulateur Dacia dans de bonnes conditions.";
    } else if (percent >= 50) {
      finalScoreText.textContent = "Résultat correct, mais certains réflexes commerciaux et métier méritent encore d’être consolidés avant la simulation.";
    } else {
      finalScoreText.textContent = "Le module est à retravailler. L’objectif est de mieux maîtriser les fondamentaux avant la mise en situation.";
    }

    resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
    } else {
      questionNumber.textContent = "Module terminé";
      questionTheme.textContent = "Résultat";
      questionText.textContent = "Le module Dacia est terminé.";
      answersBox.innerHTML = "";
      feedbackBox.style.display = "none";
      validateBtn.style.display = "none";
      nextBtn.style.display = "none";
      showResults();
    }
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

  renderQuestion();
});
