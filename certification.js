document.addEventListener("DOMContentLoaded", () => {
  const qcmDaciaScoreText = document.getElementById("qcmDaciaScoreText");
  const simDaciaScoreText = document.getElementById("simDaciaScoreText");
  const bestDaciaSimScoreText = document.getElementById("bestDaciaSimScoreText");
  const certStatusText = document.getElementById("certStatusText");
  const globalStatusBadge = document.getElementById("globalStatusBadge");

  const sellerIdentityBadge = document.getElementById("sellerIdentityBadge");
  const sellerIdentityText = document.getElementById("sellerIdentityText");
  const sellerEmailText = document.getElementById("sellerEmailText");

  const certificateRecipient = document.getElementById("certificateRecipient");
  const certificateEmail = document.getElementById("certificateEmail");

  const certificateQcmDaciaValue = document.getElementById("certificateQcmDaciaValue");
  const certificateSimDaciaValue = document.getElementById("certificateSimDaciaValue");
  const certificateBestDaciaSimValue = document.getElementById("certificateBestDaciaSimValue");
  const certificateGlobalValue = document.getElementById("certificateGlobalValue");
  const certificateResultBadge = document.getElementById("certificateResultBadge");
  const certificateDateValue = document.getElementById("certificateDateValue");

  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const emailNote = document.getElementById("emailNote");

  const sellerFirstName = (localStorage.getItem("seller_first_name") || "").trim();
  const sellerLastName = (localStorage.getItem("seller_last_name") || "").trim();
  const sellerEmail = (localStorage.getItem("seller_email") || "").trim();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  const dacia = {
    qcmScore: toNumber(localStorage.getItem("qcm_dacia_score")),
    qcmPercent: toNumber(localStorage.getItem("qcm_dacia_percent")),
    qcmTotal: toNumber(localStorage.getItem("qcm_dacia_total")),
    simLast: toNumber(localStorage.getItem("simulator_last_score")),
    simBest: toNumber(localStorage.getItem("simulator_best_score"))
  };

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

  function hasAnyDaciaResult() {
    return (
      dacia.qcmScore !== null ||
      dacia.qcmPercent !== null ||
      dacia.qcmTotal !== null ||
      dacia.simLast !== null ||
      dacia.simBest !== null
    );
  }

  function isDaciaValidated() {
    const qcmValidated = dacia.qcmPercent !== null && dacia.qcmPercent >= 75;
    const simValidated = dacia.simBest !== null && dacia.simBest >= 75;
    return qcmValidated && simValidated;
  }

  function computeGlobalAverage() {
    const values = [];

    if (dacia.qcmPercent !== null) {
      values.push(dacia.qcmPercent);
    }

    if (dacia.simBest !== null) {
      values.push(dacia.simBest);
    }

    if (!values.length) {
      return null;
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total / values.length);
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

  function renderDaciaScores() {
    if (dacia.qcmScore !== null && dacia.qcmPercent !== null && dacia.qcmTotal !== null) {
      qcmDaciaScoreText.textContent =
        `Score enregistré : ${dacia.qcmScore}/${dacia.qcmTotal} (${Math.round(dacia.qcmPercent)}%).`;
      certificateQcmDaciaValue.textContent = `${dacia.qcmScore}/${dacia.qcmTotal}`;
    } else {
      qcmDaciaScoreText.textContent = "Aucun score QCM Dacia enregistré pour le moment.";
      certificateQcmDaciaValue.textContent = "--";
    }

    if (dacia.simLast !== null) {
      simDaciaScoreText.textContent =
        `Dernier score simulateur Dacia enregistré : ${Math.round(dacia.simLast)}/100.`;
      certificateSimDaciaValue.textContent = formatScoreOver100(dacia.simLast);
    } else {
      simDaciaScoreText.textContent = "Aucun score simulateur Dacia enregistré pour le moment.";
      certificateSimDaciaValue.textContent = "--";
    }

    if (dacia.simBest !== null) {
      bestDaciaSimScoreText.textContent =
        `Meilleur score simulateur Dacia enregistré : ${Math.round(dacia.simBest)}/100.`;
      certificateBestDaciaSimValue.textContent = formatScoreOver100(dacia.simBest);
    } else {
      bestDaciaSimScoreText.textContent = "Aucun meilleur score Dacia enregistré pour le moment.";
      certificateBestDaciaSimValue.textContent = "--";
    }
  }

  function renderGlobalStatus() {
    const sellerReady = hasSellerIdentity();
    const daciaValidated = isDaciaValidated();
    const daciaHasResults = hasAnyDaciaResult();
    const globalAverage = computeGlobalAverage();

    certificateGlobalValue.textContent = globalAverage !== null ? `${globalAverage}%` : "--";

    if (!sellerReady) {
      certStatusText.textContent =
        "Certification bloquée tant que l’identité vendeur n’est pas correctement renseignée sur le portail.";
      setBadgeText(globalStatusBadge, "Identité requise");
      setBadgeText(certificateResultBadge, "IDENTITÉ VENDEUR MANQUANTE");
      applyStatusClass(globalStatusBadge, "status-locked");
      applyStatusClass(certificateResultBadge, "status-locked");
      return;
    }

    if (daciaValidated) {
      certStatusText.textContent =
        "Certification vendeur validée. Les seuils sont atteints sur le QCM Dacia et sur la simulation.";
      setBadgeText(globalStatusBadge, "Validé");
      setBadgeText(certificateResultBadge, "VENDEUR CERTIFIÉ DACIA");
      applyStatusClass(globalStatusBadge, "status-certified");
      applyStatusClass(certificateResultBadge, "status-certified");
      return;
    }

    if (daciaHasResults) {
      const missingBlocks = [];

      if (!(dacia.qcmPercent !== null && dacia.qcmPercent >= 75)) {
        missingBlocks.push(`QCM insuffisant (${formatPercent(dacia.qcmPercent)})`);
      }

      if (!(dacia.simBest !== null && dacia.simBest >= 75)) {
        missingBlocks.push(`simulation insuffisante (${formatScoreOver100(dacia.simBest)})`);
      }

      certStatusText.textContent =
        `Certification en cours. Des résultats existent mais les seuils ne sont pas encore atteints : ${missingBlocks.join(" • ")}.`;
      setBadgeText(globalStatusBadge, "En cours");
      setBadgeText(certificateResultBadge, "EN COURS DE VALIDATION");
      applyStatusClass(globalStatusBadge, "status-progress");
      applyStatusClass(certificateResultBadge, "status-progress");
      return;
    }

    certStatusText.textContent =
      "Certification non démarrée. Aucun résultat exploitable n’est encore enregistré sur le parcours Dacia.";
    setBadgeText(globalStatusBadge, "Non démarré");
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
  renderDaciaScores();
  renderGlobalStatus();
  setupPdfDownload();
  setupEmailButton();
});
