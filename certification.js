document.addEventListener("DOMContentLoaded", () => {
  const qcmDaciaScoreText = document.getElementById("qcmDaciaScoreText");
  const simDaciaScoreText = document.getElementById("simDaciaScoreText");
  const bestDaciaSimScoreText = document.getElementById("bestDaciaSimScoreText");
  const daciaStatusBadge = document.getElementById("daciaStatusBadge");

  const qcmRenaultScoreText = document.getElementById("qcmRenaultScoreText");
  const simRenaultScoreText = document.getElementById("simRenaultScoreText");
  const bestRenaultSimScoreText = document.getElementById("bestRenaultSimScoreText");
  const renaultStatusBadge = document.getElementById("renaultStatusBadge");

  const sellerIdentityBadge = document.getElementById("sellerIdentityBadge");
  const sellerIdentityText = document.getElementById("sellerIdentityText");
  const sellerEmailText = document.getElementById("sellerEmailText");

  const certificateRecipient = document.getElementById("certificateRecipient");
  const certificateEmail = document.getElementById("certificateEmail");
  const certificateQcmDaciaValue = document.getElementById("certificateQcmDaciaValue");
  const certificateSimDaciaValue = document.getElementById("certificateSimDaciaValue");
  const certificateQcmRenaultValue = document.getElementById("certificateQcmRenaultValue");
  const certificateSimRenaultValue = document.getElementById("certificateSimRenaultValue");
  const certificateBestDaciaSimValue = document.getElementById("certificateBestDaciaSimValue");
  const certificateBestRenaultSimValue = document.getElementById("certificateBestRenaultSimValue");
  const certificateGlobalValue = document.getElementById("certificateGlobalValue");
  const certificateResultBadge = document.getElementById("certificateResultBadge");
  const certificateDateValue = document.getElementById("certificateDateValue");
  const globalStatusBadge = document.getElementById("globalStatusBadge");

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

  const renault = {
    qcmScore: toNumber(localStorage.getItem("qcm_renault_score")),
    qcmPercent: toNumber(localStorage.getItem("qcm_renault_percent")),
    qcmTotal: toNumber(localStorage.getItem("qcm_renault_total")),
    simLast: toNumber(localStorage.getItem("simulator_renault_last_score")),
    simBest: toNumber(localStorage.getItem("simulator_renault_best_score"))
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

  function isBrandValidated(brandData) {
    const qcmValidated = brandData.qcmPercent !== null && brandData.qcmPercent >= 75;
    const simValidated = brandData.simBest !== null && brandData.simBest >= 75;
    return qcmValidated && simValidated;
  }

  function hasAnyBrandResult(brandData) {
    return (
      brandData.qcmScore !== null ||
      brandData.qcmPercent !== null ||
      brandData.qcmTotal !== null ||
      brandData.simLast !== null ||
      brandData.simBest !== null
    );
  }

  function computeGlobalAverage() {
    const values = [];

    if (dacia.qcmPercent !== null) values.push(dacia.qcmPercent);
    if (dacia.simBest !== null) values.push(dacia.simBest);
    if (renault.qcmPercent !== null) values.push(renault.qcmPercent);
    if (renault.simBest !== null) values.push(renault.simBest);

    if (!values.length) return null;

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
      qcmDaciaScoreText.textContent = `Score enregistré : ${dacia.qcmScore}/${dacia.qcmTotal} (${Math.round(dacia.qcmPercent)}%).`;
      certificateQcmDaciaValue.textContent = `${dacia.qcmScore}/${dacia.qcmTotal}`;
    } else {
      qcmDaciaScoreText.textContent = "Aucun score QCM Dacia enregistré pour le moment.";
      certificateQcmDaciaValue.textContent = "--";
    }

    if (dacia.simLast !== null) {
      simDaciaScoreText.textContent = `Dernier score simulateur Dacia enregistré : ${Math.round(dacia.simLast)}/100.`;
      certificateSimDaciaValue.textContent = formatScoreOver100(dacia.simLast);
    } else {
      simDaciaScoreText.textContent = "Aucun score simulateur Dacia enregistré pour le moment.";
      certificateSimDaciaValue.textContent = "--";
    }

    if (dacia.simBest !== null) {
      bestDaciaSimScoreText.textContent = `Meilleur score simulateur Dacia enregistré : ${Math.round(dacia.simBest)}/100.`;
      certificateBestDaciaSimValue.textContent = formatScoreOver100(dacia.simBest);
    } else {
      bestDaciaSimScoreText.textContent = "Aucun meilleur score Dacia enregistré pour le moment.";
      certificateBestDaciaSimValue.textContent = "--";
    }
  }

  function renderRenaultScores() {
    if (renault.qcmScore !== null && renault.qcmPercent !== null && renault.qcmTotal !== null) {
      qcmRenaultScoreText.textContent = `Score enregistré : ${renault.qcmScore}/${renault.qcmTotal} (${Math.round(renault.qcmPercent)}%).`;
      certificateQcmRenaultValue.textContent = `${renault.qcmScore}/${renault.qcmTotal}`;
    } else {
      qcmRenaultScoreText.textContent = "Aucun score QCM Renault enregistré pour le moment.";
      certificateQcmRenaultValue.textContent = "--";
    }

    if (renault.simLast !== null) {
      simRenaultScoreText.textContent = `Dernier score simulateur Renault enregistré : ${Math.round(renault.simLast)}/100.`;
      certificateSimRenaultValue.textContent = formatScoreOver100(renault.simLast);
    } else {
      simRenaultScoreText.textContent = "Aucun score simulateur Renault enregistré pour le moment.";
      certificateSimRenaultValue.textContent = "--";
    }

    if (renault.simBest !== null) {
      bestRenaultSimScoreText.textContent = `Meilleur score simulateur Renault enregistré : ${Math.round(renault.simBest)}/100.`;
      certificateBestRenaultSimValue.textContent = formatScoreOver100(renault.simBest);
    } else {
      bestRenaultSimScoreText.textContent = "Aucun meilleur score Renault enregistré pour le moment.";
      certificateBestRenaultSimValue.textContent = "--";
    }
  }

  function renderBrandStatus(brandName, brandData, badgeElement) {
    const sellerReady = hasSellerIdentity();
    const qcmValidated = brandData.qcmPercent !== null && brandData.qcmPercent >= 75;
    const simValidated = brandData.simBest !== null && brandData.simBest >= 75;
    const hasAnyResult = hasAnyBrandResult(brandData);

    if (!sellerReady) {
      setBadgeText(badgeElement, "Identité requise");
      applyStatusClass(badgeElement, "status-locked");
      return;
    }

    if (qcmValidated && simValidated) {
      setBadgeText(badgeElement, "Validé");
      applyStatusClass(badgeElement, "status-certified");
      return;
    }

    if (hasAnyResult) {
      setBadgeText(badgeElement, "En cours");
      applyStatusClass(badgeElement, "status-progress");
      return;
    }

    setBadgeText(badgeElement, "Non démarré");
    applyStatusClass(badgeElement, "status-locked");
  }

  function renderGlobalStatus() {
    const sellerReady = hasSellerIdentity();
    const daciaValidated = isBrandValidated(dacia);
    const renaultValidated = isBrandValidated(renault);
    const daciaHasResults = hasAnyBrandResult(dacia);
    const renaultHasResults = hasAnyBrandResult(renault);
    const globalAverage = computeGlobalAverage();

    certificateGlobalValue.textContent = globalAverage !== null ? `${globalAverage}%` : "--";

    if (!sellerReady) {
      setBadgeText(globalStatusBadge, "Identité requise");
      setBadgeText(certificateResultBadge, "IDENTITÉ VENDEUR MANQUANTE");
      applyStatusClass(globalStatusBadge, "status-locked");
      applyStatusClass(certificateResultBadge, "status-locked");
      return;
    }

    if (daciaValidated && renaultValidated) {
      setBadgeText(globalStatusBadge, "Certifié");
      setBadgeText(certificateResultBadge, "VENDEUR CERTIFIÉ MULTI-MARQUES");
      applyStatusClass(globalStatusBadge, "status-certified");
      applyStatusClass(certificateResultBadge, "status-certified");
      return;
    }

    if (daciaValidated && !renaultValidated) {
      setBadgeText(globalStatusBadge, "Dacia validé");
      setBadgeText(certificateResultBadge, "VALIDÉ DACIA • RENAULT EN COURS");
      applyStatusClass(globalStatusBadge, "status-progress");
      applyStatusClass(certificateResultBadge, "status-progress");
      return;
    }

    if (!daciaValidated && renaultValidated) {
      setBadgeText(globalStatusBadge, "Renault validé");
      setBadgeText(certificateResultBadge, "VALIDÉ RENAULT • DACIA EN COURS");
      applyStatusClass(globalStatusBadge, "status-progress");
      applyStatusClass(certificateResultBadge, "status-progress");
      return;
    }

    if (daciaHasResults || renaultHasResults) {
      setBadgeText(globalStatusBadge, "En cours");
      setBadgeText(certificateResultBadge, "EN COURS DE VALIDATION");
      applyStatusClass(globalStatusBadge, "status-progress");
      applyStatusClass(certificateResultBadge, "status-progress");
      return;
    }

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
          `Email prêt côté interface pour ${sellerEmail}. L’envoi réel nécessitera maintenant un backend ou une API mail.`;
      }
    });
  }

  renderSellerIdentity();
  renderDaciaScores();
  renderRenaultScores();
  renderBrandStatus("Dacia", dacia, daciaStatusBadge);
  renderBrandStatus("Renault", renault, renaultStatusBadge);
  renderGlobalStatus();
  setupPdfDownload();
  setupEmailButton();
});
