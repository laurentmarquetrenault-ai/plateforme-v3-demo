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

  const sellerFirstName = localStorage.getItem("seller_first_name") || "Prénom";
  const sellerLastName = localStorage.getItem("seller_last_name") || "Nom";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  certificateRecipient.textContent = `${sellerFirstName} ${sellerLastName}`;
  certificateDateValue.textContent = formattedDate;

  let qcmPercent = null;
  let simLast = null;
  let simBest = null;

  if (qcmRaw && qcmPercentRaw && qcmTotalRaw) {
    qcmPercent = Number(qcmPercentRaw);
    qcmScoreText.textContent = `Score enregistré : ${qcmRaw}/${qcmTotalRaw} (${qcmPercent}%).`;
    certificateQcmValue.textContent = `${qcmRaw}/${qcmTotalRaw}`;
  } else {
    qcmScoreText.textContent = "Aucun score QCM enregistré pour le moment.";
    certificateQcmValue.textContent = "--";
  }

  if (simLastRaw) {
    simLast = Number(simLastRaw);
    simScoreText.textContent = `Dernier score simulateur enregistré : ${simLast}/100.`;
    certificateSimValue.textContent = `${simLast}/100`;
  } else {
    simScoreText.textContent = "Aucun score simulateur enregistré pour le moment.";
    certificateSimValue.textContent = "--";
  }

  if (simBestRaw) {
    simBest = Number(simBestRaw);
    bestSimScoreText.textContent = `Meilleur score simulateur enregistré : ${simBest}/100.`;
    certificateBestSimValue.textContent = `${simBest}/100`;
  } else {
    bestSimScoreText.textContent = "Aucun meilleur score simulateur enregistré pour le moment.";
    certificateBestSimValue.textContent = "--";
  }

  const qcmValidated = qcmPercent !== null && qcmPercent >= 75;
  const simValidated = simBest !== null && simBest >= 75;

  if (qcmValidated && simValidated) {
    certStatusText.textContent = "Certification débloquée. Les seuils de validation sont atteints.";
    globalStatusBadge.textContent = "Débloquée";
    certificateResultBadge.textContent = "VENDEUR CERTIFIÉ";
  } else if (qcmPercent !== null || simBest !== null) {
    certStatusText.textContent = "Certification en cours. Certaines briques sont renseignées, mais les seuils ne sont pas encore tous atteints.";
    globalStatusBadge.textContent = "En cours";
    certificateResultBadge.textContent = "EN COURS DE VALIDATION";
  } else {
    certStatusText.textContent = "Certification verrouillée. Aucun résultat exploitable n’est encore enregistré.";
    globalStatusBadge.textContent = "Verrouillée";
    certificateResultBadge.textContent = "NON DÉBLOQUÉE";
  }

  downloadPdfBtn.addEventListener("click", () => {
    window.print();
  });
});
