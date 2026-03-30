document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("selected_brand", "renault");

  const questions = [
    {
      theme: "Valeur vs prix",
      question: "Client : « Franchement, votre offre Renault est plus chère que ce que j’imaginais. » Quelle est la meilleure réponse vendeur ?",
      options: [
        "Oui, c’est vrai, mais on peut voir plus tard si vous préférez.",
        "Je comprends. L’enjeu est justement de voir ce que ce tarif vous apporte concrètement en tranquillité, en visibilité et en couverture.",
        "C’est plus cher, mais c’est Renault donc c’est normal.",
        "Si vous trouvez trop cher, ce n’est peut-être pas fait pour vous."
      ],
      correct: 1,
      explanation:
        "La bonne réponse ne nie pas le prix, mais elle déplace immédiatement l’échange vers la valeur perçue. Le vendeur doit faire sortir le client d’une lecture purement tarifaire."
    },
    {
      theme: "Comparaison client",
      question: "Client : « Moi je compare surtout la mensualité. » Quel est le meilleur réflexe commercial ?",
      options: [
        "Rester sur la mensualité uniquement, car c’est le seul sujet qui compte.",
        "Répondre que comparer les mensualités ne sert à rien.",
        "Accepter la comparaison, mais réintroduire ce que couvre réellement l’offre et ce qu’elle permet d’éviter.",
        "Baisser immédiatement la valeur de l’offre pour qu’elle paraisse plus accessible."
      ],
      correct: 2,
      explanation:
        "Le vendeur ne doit ni fuir la comparaison, ni s’y enfermer. Il doit reconnecter le prix à la couverture, à la sérénité et aux coûts évités."
    },
    {
      theme: "Erreur à éviter",
      question: "Quelle formulation affaiblit le plus la valorisation d’une offre Renault plus chère ?",
      options: [
        "Je comprends que vous regardiez le budget global.",
        "L’idée, c’est de voir si le contenu de l’offre a du sens pour vous.",
        "Oui c’est cher, mais bon, après vous faites comme vous voulez.",
        "Si vous voulez, on peut regarder ensemble ce que cette solution vous apporte vraiment."
      ],
      correct: 2,
      explanation:
        "Cette formulation détruit la valeur de l’offre et la posture vendeur. Elle valide unilatéralement que c’est 'cher' et abandonne la défense du produit."
    },
    {
      theme: "Découverte utile",
      question: "Avant de défendre une offre Renault plus chère, quelle question a le plus de valeur ?",
      options: [
        "Vous voulez signer aujourd’hui ou pas ?",
        "Vous regardez juste le prix ou aussi ce que la solution vous apporte dans la durée ?",
        "Vous savez déjà que Renault est plus premium, non ?",
        "Vous comparez beaucoup ou pas ?"
      ],
      correct: 1,
      explanation:
        "Cette question est bonne car elle ouvre la discussion sur le cadre de décision du client : coût immédiat versus valeur dans le temps."
    },
    {
      theme: "Posture premium",
      question: "Quel angle correspond le mieux à une posture vendeur Renault face à une offre plus chère ?",
      options: [
        "Essayer d’aller le plus vite possible pour éviter l’objection prix.",
        "Assumer la valeur de l’offre, puis la relier au besoin réel du client.",
        "Éviter complètement de parler du prix.",
        "Dire que l’offre est meilleure sans l’expliquer."
      ],
      correct: 1,
      explanation:
        "Une offre plus chère doit être portée avec assurance. Le vendeur doit assumer la valeur et la relier au concret, pas fuir le sujet."
    },
    {
      theme: "Objection prix",
      question: "Client : « À ce tarif-là, il faut vraiment que ça vaille le coup. » Quelle est la réponse la plus solide ?",
      options: [
        "Oui, donc prenez le temps et revenez plus tard.",
        "Je suis d’accord, et c’est justement pour ça qu’il faut regarder si cette solution vous apporte une vraie cohérence par rapport à votre usage et à vos attentes.",
        "C’est une offre chère, donc forcément elle vaut le coup.",
        "Si vous hésitez, autant ne rien prendre."
      ],
      correct: 1,
      explanation:
        "La bonne réponse valide l’exigence du client sans céder. Elle recentre sur la cohérence entre usage, besoin et proposition."
    },
    {
      theme: "Client professionnel",
      question: "Avec un client professionnel qui trouve l’offre Renault trop chère, quel angle est le plus pertinent ?",
      options: [
        "L’image de marque uniquement.",
        "Le plaisir de conduite avant tout.",
        "La maîtrise budgétaire, la continuité d’usage et le coût des imprévus évités pour l’activité.",
        "Le fait que tous les professionnels prennent cette offre."
      ],
      correct: 2,
      explanation:
        "Avec un professionnel, la valeur doit être reliée à l’activité : véhicule disponible, imprévus réduits, meilleure visibilité sur les charges."
    },
    {
      theme: "Closing",
      question: "Après avoir bien défendu la valeur d’une offre Renault, quelle conclusion est la plus juste ?",
      options: [
        "Bon, réfléchissez et on verra plus tard.",
        "Je vous laisse décider seul, je ne préfère pas influencer.",
        "Si cette logique de protection et de maîtrise a du sens pour vous, est-ce qu’on le met en place aujourd’hui ?",
        "Je peux peut-être vous faire regretter si vous ne prenez rien."
      ],
      correct: 2,
      explanation:
        "Un bon closing Renault doit prolonger la logique de valeur. Il ne doit ni s’excuser, ni forcer, mais inviter clairement à décider."
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
        `Très bon résultat pour ${seller.fullName}. Vous défendez bien la valeur d’une offre Renault plus chère sans vous dévaloriser trop vite.`;
    } else if (percent >= 50) {
      finalScoreText.textContent =
        `Résultat correct pour ${seller.fullName}, mais la valorisation de l’offre Renault doit encore être consolidée, surtout face à l’objection prix.`;
    } else {
      finalScoreText.textContent =
        `Le module est à retravailler pour ${seller.fullName}. L’objectif est de mieux transformer l’écart de prix en valeur perçue pour le client.`;
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
