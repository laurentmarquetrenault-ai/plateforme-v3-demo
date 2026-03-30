document.addEventListener("DOMContentLoaded", () => {
  const qcmScoreText = document.getElementById("qcmScoreText");
  const simScoreText = document.getElementById("simScoreText");
  const bestSimScoreText = document.getElementById("bestSimScoreText");
  const certStatusText = document.getElementById("certStatusText");
  const globalStatusBadge = document.getElementById("globalStatusBadge");

  const sellerIdentityBadge = document.getElementById("sellerIdentityBadge");
  const sellerIdentityText = document.getElementById("sellerIdentityText");
  const sellerEmailText = document.getElementById("sellerEmailText");

  const certificateRecipient = document.getElementById("certificateRecipient");
  const certificateEmail = document.getElementById("certificateEmail");
  const certificateQcmValue = document.getElementById("certificateQcmValue");
  const certificateSimValue = document.getElementById("certificateSimValue");
  const certificateBestSimValue = document.getElementById("certificateBestSimValue");
  const certificateResultBadge = document.getElementById("certificateResultBadge");
  const certificateDateValue = document.getElementById("certificateDateValue");

  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const emailNote = document.getElementById("emailNote");

  const qcmRaw = localStorage.getItem("qcm_dacia_score");
  const qcmPercentRaw = localStorage.getItem("qcm_dacia_percent");
  const qcmTotalRaw = localStorage.getItem("qcm_dacia_total");

  const simLastRaw = localStorage.getItem("simulator_last_score");
  const simBestRaw = localStorage.getItem("simulator_best_score");

  const sellerFirstName = (localStorage.getItem("seller_first_name") || "").trim();
  const sellerLastName = (localStorage.getItem("seller_last_name") || "").trim();
  const sellerEmail = (localStorage.getItem("seller_email") || "").trim();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  let qcmScore = null;
  let qcmPercent = null;
  let qcmTotal = null;
  let simLast = null;
  let simBest = null;

  function toNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatPercent(value) {
    if (value === null) return "--";
    return `${Math.round(value)}%`;
  }

  function formatScoreOver100(value) {
    if (value === null) return "--";
    return `${Math.round(value)}/100`;
  }

  function setBadgeText(element, text) {
    if (!element) return;
    element.textContent = text;
  }

  function applyStatusClass(element, status) {
    if (!element) return;
    element.classList.remove("status-locked", "status-progress", "status-certified");
    element.classList.add(status);
  }

  function getSellerFullName() {
    const fullName = `${sellerFirstName} ${sellerLastName}`.trim();
    return fullName || "Prénom Nom";
  }

  function hasSellerIdentity() {
    return Boolean(sellerFirstName && sellerLastName);
  }

  function hasSellerEmail() {
    return Boolean(sellerEmail);
  }

  function renderSellerIdentity() {
    if (hasSellerIdentity()) {
      sellerIdentityText.textContent = `Vendeur actif : ${getSellerFullName()}.`;
      setBadgeText(sellerIdentityBadge, "Identité prête");
      applyStatusClass(sellerIdentityBadge, "status-certified");
    } else {
      sellerIdentityText.textContent =
        "Aucun vendeur complet enregistré. Retournez sur le portail pour renseigner le prénom et le nom.";
      setBadgeText(sellerIdentityBadge, "Identité manquante");
      applyStatusClass(sellerIdentityBadge, "status-locked");
    }

    if (hasSellerEmail()) {
      sellerEmailText.textContent = sellerEmail;
    } else {
      sellerEmailText.textContent =
        "Aucune adresse email enregistrée. Vous pouvez la renseigner depuis le portail vendeur.";
    }

    certificateRecipient.textContent = getSellerFullName();
    certificateEmail.textContent = hasSellerEmail() ? sellerEmail : "email non renseigné";
    certificateDateValue.textContent = formattedDate;
  }

  function renderScores() {
    qcmScore = toNumber(qcmRaw);
    qcmPercent = toNumber(qcmPercentRaw);
    qcmTotal = toNumber(qcmTotalRaw);
    simLast = toNumber(simLastRaw);
    simBest = toNumber(simBestRaw);

    if (qcmScore !== null && qcmPercent !== null && qcmTotal !== null) {
      qcmScoreText.textContent = `Score enregistré : ${qcmScore}/${qcmTotal} (${Math.round(qcmPercent)}%).`;
      certificateQcmValue.textContent = `${qcmScore}/${qcmTotal}`;
    } else {
      qcmScoreText.textContent = "Aucun score QCM enregistré pour le moment.";
      certificateQcmValue.textContent = "--";
    }

    if (simLast !== null) {
      simScoreText.textContent = `Dernier score simulateur enregistré : ${Math.round(simLast)}/100.`;
      certificateSimValue.textContent = formatScoreOver100(simLast);
    } else {
      simScoreText.textContent = "Aucun score simulateur enregistré pour le moment.";
      certificateSimValue.textContent = "--";
    }

    if (simBest !== null) {
      bestSimScoreText.textContent = `Meilleur score simulateur enregistré : ${Math.round(simBest)}/100.`;
      certificateBestSimValue.textContent = formatScoreOver100(simBest);
    } else {
      bestSimScoreText.textContent = "Aucun meilleur score enregistré pour le moment.";
      certificateBestSimValue.textContent = "--";
    }
  }

  function renderCertificationStatus() {
    const qcmValidated = qcmPercent !== null && qcmPercent >= 75;
    const simValidated = simBest !== null && simBest >= 75;
    const sellerReady = hasSellerIdentity();

    const hasAnyResult =
      qcmScore !== null ||
      qcmPercent !== null ||
      qcmTotal !== null ||
      simLast !== null ||
      simBest !== null;

    if (!sellerReady) {
      certStatusText.textContent =
        "Certification bloquée tant que l’identité vendeur n’est pas correctement renseignée sur le portail.";
      setBadgeText(globalStatusBadge, "Identité requise");
      setBadgeText(certificateResultBadge, "IDENTITÉ VENDEUR MANQUANTE");
      applyStatusClass(globalStatusBadge, "status-locked");
      applyStatusClass(certificateResultBadge, "status-locked");
      return;
    }

    if (qcmValidated && simValidated) {
      certStatusText.textContent =
        "Certification débloquée. Les seuils de validation sont atteints sur le QCM et sur la simulation.";
      setBadgeText(globalStatusBadge, "Débloquée");
      setBadgeText(certificateResultBadge, "VENDEUR CERTIFIÉ");
      applyStatusClass(globalStatusBadge, "status-certified");
      applyStatusClass(certificateResultBadge, "status-certified");
      return;
    }

    if (hasAnyResult) {
      const missingBlocks = [];

      if (!qcmValidated) {
        missingBlocks.push(`QCM insuffisant (${formatPercent(qcmPercent)})`);
      }

      if (!simValidated) {
        missingBlocks.push(`simulation insuffisante (${formatScoreOver100(simBest)})`);
      }

      certStatusText.textContent =
        `Certification en cours. Résultats partiellement renseignés ou seuils non atteints : ${missingBlocks.join(" • ")}.`;
      setBadgeText(globalStatusBadge, "En cours");
      setBadgeText(certificateResultBadge, "EN COURS DE VALIDATION");
      applyStatusClass(globalStatusBadge, "status-progress");
      applyStatusClass(certificateResultBadge, "status-progress");
      return;
    }

    certStatusText.textContent =
      "Certification verrouillée. Aucun résultat exploitable n’est encore enregistré.";
    setBadgeText(globalStatusBadge, "Verrouillée");
    setBadgeText(certificateResultBadge, "NON DÉBLOQUÉE");
    applyStatusClass(globalStatusBadge, "status-locked");
    applyStatusClass(certificateResultBadge, "status-locked");
  }

  function setupPdfDownload() {
    if (!downloadPdfBtn) return;

    downloadPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }

  function setupEmailButton() {
    if (!sendEmailBtn) return;

    sendEmailBtn.addEventListener("click", () => {
      if (!hasSellerEmail()) {
        if (emailNote) {
          emailNote.textContent =
            "Impossible de préparer l’envoi : aucune adresse email vendeur n’est enregistrée sur le portail.";
        }
        return;
      }

      if (emailNote) {
        emailNote.textContent =
          `Email prêt côté interface pour ${sellerEmail}. L’envoi réel du certificat nécessitera maintenant un backend ou une API mail.`;
      }
    });
  }

  renderSellerIdentity();
  renderScores();
  renderCertificationStatus();
  setupPdfDownload();
  setupEmailButton();
});
