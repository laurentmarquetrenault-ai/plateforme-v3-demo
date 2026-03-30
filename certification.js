document.addEventListener("DOMContentLoaded", () => {
  const qcmScoreText = document.getElementById("qcmScoreText");
  const simScoreText = document.getElementById("simScoreText");
  const bestSimScoreText = document.getElementById("bestSimScoreText");
  const certStatusText = document.getElementById("certStatusText");
  const globalStatusBadge = document.getElementById("globalStatusBadge");

  const certificateRecipient = document.getElementById("certificateRecipient");
  const certificateQcmValue = document.getElementById("certificateQcmValue");
  const certificateSimValue = document.getElementById("certificateSimValue");
  const certificateBestSimValue = document.getElementById("certificateBestSimValue");
  const certificateResultBadge = document.getElementById("certificateResultBadge");
  const certificateDateValue = document.getElementById("certificateDateValue");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  const qcmRaw = localStorage.getItem("qcm_dacia_score");
  const qcmPercentRaw = localStorage.getItem("qcm_dacia_percent");
  const qcmTotalRaw = localStorage.getItem("qcm_dacia_total");

  const simLastRaw = localStorage.getItem("simulator_last_score");
  const simBestRaw = localStorage.getItem("simulator_best_score");

  const sellerFirstName = (localStorage.getItem("seller_first_name") || "Prénom").trim();
  const sellerLastName = (localStorage.getItem("seller_last_name") || "Nom").trim();

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

  qcmScore = toNumber(qcmRaw);
  qcmPercent = toNumber(qcmPercentRaw);
  qcmTotal = toNumber(qcmTotalRaw);
  simLast = toNumber(simLastRaw);
  simBest = toNumber(simBestRaw);

  certificateRecipient.textContent = `${sellerFirstName} ${sellerLastName}`;
  certificateDateValue.textContent = formattedDate;

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
    bestSimScoreText.textContent = "Aucun meilleur score simulateur enregistré pour le moment.";
    certificateBestSimValue.textContent = "--";
  }

  const qcmValidated = qcmPercent !== null && qcmPercent >= 75;
  const simValidated = simBest !== null && simBest >= 75;
  const hasAnyResult =
    qcmScore !== null ||
    qcmPercent !== null ||
    qcmTotal !== null ||
    simLast !== null ||
    simBest !== null;

  if (qcmValidated && simValidated) {
    certStatusText.textContent =
      "Certification débloquée. Les seuils de validation sont atteints sur le QCM et sur la simulation.";
    setBadgeText(globalStatusBadge, "Débloquée");
    setBadgeText(certificateResultBadge, "VENDEUR CERTIFIÉ");
    applyStatusClass(globalStatusBadge, "status-certified");
    applyStatusClass(certificateResultBadge, "status-certified");
  } else if (hasAnyResult) {
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
  } else {
    certStatusText.textContent =
      "Certification verrouillée. Aucun résultat exploitable n’est encore enregistré.";
    setBadgeText(globalStatusBadge, "Verrouillée");
    setBadgeText(certificateResultBadge, "NON DÉBLOQUÉE");
    applyStatusClass(globalStatusBadge, "status-locked");
    applyStatusClass(certificateResultBadge, "status-locked");
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
