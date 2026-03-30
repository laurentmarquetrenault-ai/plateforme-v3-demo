function getPriceTable(brand, vehicleAge, energyType) {
  const age = parseInt(String(vehicleAge).match(/\d+/)?.[0] || "1", 10);
  const bucket = age <= 5 ? "1-5" : "6-8";

  const daciaMatrix = {
    "1-5": {
      ev: { cep: 19, cepp: 39 },
      essence_gpl: { cep: 29, cepp: 59 },
      hybrid: { cep: 39, cepp: 59 },
      diesel: { cep: 39, cepp: 69 }
    },
    "6-8": {
      ev: { cep: 15, cepp: 29 },
      essence_gpl: { cep: 25, cepp: 49 },
      hybrid: { cep: 35, cepp: 49 },
      diesel: { cep: 35, cepp: 59 }
    }
  };

  const renaultMatrix = {
    "1-5": {
      ev: { cep: 29, cepp: 49 },
      essence: { cep: 39, cepp: 69 },
      essence_gpl: { cep: 39, cepp: 69 },
      hybrid: { cep: 49, cepp: 69 },
      diesel: { cep: 49, cepp: 79 },
      vu_thermique: { cep: 59, cepp: 89 }
    },
    "6-8": {
      ev: { cep: 25, cepp: 39 },
      essence: { cep: 35, cepp: 59 },
      essence_gpl: { cep: 35, cepp: 59 },
      hybrid: { cep: 45, cepp: 59 },
      diesel: { cep: 45, cepp: 69 },
      vu_thermique: { cep: 55, cepp: 79 }
    }
  };

  const matrix = brand === "renault" ? renaultMatrix : daciaMatrix;
  const safeEnergyType = matrix[bucket][energyType] ? energyType : Object.keys(matrix[bucket])[0];

  return matrix[bucket][safeEnergyType];
}

function skillSummary(liveSkills) {
  const order = [
    ["welcome", "Accueil / prise en charge"],
    ["discovery", "Découverte / questionnement"],
    ["argumentation", "Argumentation produit"],
    ["objection", "Traitement des objections"],
    ["closing", "Conclusion commerciale"]
  ];

  return order
    .map(([key, label]) => `- ${label} : ${liveSkills?.[key] ? "validé en live" : "non validé en live"}`)
    .join("\n");
}

function normalizeConversation(conversation) {
  return (conversation || [])
    .filter((item) => item && typeof item.content === "string")
    .map((item) => {
      const roleLabel =
        item.role === "user"
          ? "Vendeur"
          : item.role === "assistant"
            ? "Client"
            : "Autre";

      return `${roleLabel} : ${item.content}`;
    })
    .join("\n");
}

function getDaciaEvaluationPrompt({
  trust,
  mode,
  profil,
  scenario,
  vehicleAge,
  energyType,
  liveSkills,
  prices
}) {
  return `
Tu es un évaluateur métier d'une simulation commerciale Dacia sur les Contrats Entretien Privilèges (CEP / CEP+).

MISSION :
Évaluer la performance du vendeur de façon claire, concrète, utile, exigeante et orientée progression.

IDENTITÉ DU PARCOURS DACIA :
Le bloc Dacia évalue surtout :
- la maîtrise produit
- la compréhension du cadre d’éligibilité
- la capacité à relier l’offre au besoin client
- la capacité à traiter les objections avec des arguments simples, concrets et justes
- la capacité à conclure proprement

BASE MÉTIER À RESPECTER :
- Souscription véhicules Dacia de 1 à 8 ans + 6 mois de souplesse selon les cas, max 120 000 km à la souscription
- Durée max 48 mois
- Fin de contrat max 200 000 km
- Contrat cessible ou résiliable
- Frais de résiliation : 38 € hors rachat du véhicule dans le réseau
- CEP = assistance + entretien + véhicule de remplacement + extension de garantie + éléments d'entretien
- CEP+ = CEP + pièces d'usure + contrôle technique + MyCheckUp + contre-visite + batterie 12V + balais + freinage + amortisseurs + ampoules + bougies de préchauffage + pile carte
- Dacia Zen : activable pour véhicule entre 3 et 7 ans max, couverture constructeur max 150 000 km et 30 000 km/an
- Offre pro réservée aux artisans, commerçants et professions libérales en nom propre avec moins de 10 véhicules
- Les sociétés type SARL sont exclues
- Arguments clés particuliers :
  - budget maîtrisé pendant 48 mois
  - respect de l'entretien
  - longévité du véhicule
  - pièces d'origine Dacia
  - revente facilitée
  - assistance
  - véhicule de remplacement
  - extension de garantie selon conditions
- Arguments clés professionnels :
  - maîtrise du budget
  - limitation des imprévus
  - continuité d'usage du véhicule
  - limitation de l'immobilisation
  - intérêt concret pour l'activité
- Objections / réponses conseillées :
  - trop cher -> une panne hors garantie peut coûter bien plus
  - je verrai plus tard -> la révision déjà faite ne sera pas comprise
  - je roule peu -> la garantie est liée au temps, pas seulement aux kilomètres
  - si je revends -> cela aide la revente, le contrat peut être cessible ou résiliable selon le cas
- Tarifs exacts pour ce véhicule :
  - CEP : ${prices.cep}€ / mois
  - CEP+ : ${prices.cepp}€ / mois

BLOCS DE COMPÉTENCES À ÉVALUER :
1. Accueil / prise en charge
2. Découverte / questionnement
3. Argumentation produit
4. Traitement des objections
5. Conclusion commerciale

CONTEXTE :
- Mode : ${mode}
- Profil client : ${profil}
- Scénario : ${scenario}
- Âge véhicule : ${vehicleAge}
- Type énergie : ${energyType}
- Niveau de confiance final : ${trust}%

SIGNAUX LIVE FRONT :
${skillSummary(liveSkills)}

RÈGLES D'ÉVALUATION :
- Sois exigeant mais juste
- Ne récompense pas juste la politesse : récompense l’efficacité commerciale utile
- Si le vendeur donne un mauvais prix, une mauvaise règle ou un argument faux, dis-le clairement
- Si le vendeur oublie totalement l’éligibilité, le kilométrage, le cadre du contrat ou le bon angle de couverture, cela doit peser négativement
- Si le profil est "pro", tu dois évaluer si le vendeur a réellement adapté son discours à une cliente professionnelle
- Pour un profil pro, un bon vendeur doit parler concrètement de budget, imprévus, continuité d’usage, immobilisation évitée, intérêt économique ou opérationnel
- Pour un profil pro, un discours trop générique ou trop orienté particulier doit être sanctionné dans l’argumentation
- Ne surévalue pas artificiellement un échange moyen

FORMAT DE SORTIE OBLIGATOIRE :
Bilan final
Note globale : X/100

Étoiles / blocs de compétences
- Accueil / prise en charge : Validé ou Non validé — justification très courte
- Découverte / questionnement : Validé ou Non validé — justification très courte
- Argumentation produit : Validé ou Non validé — justification très courte
- Traitement des objections : Validé ou Non validé — justification très courte
- Conclusion commerciale : Validé ou Non validé — justification très courte

Points forts
- 2 ou 3 points max

Axes de progrès
- 2 ou 3 points max

Correction métier
- Dis si les prix, l'offre ou l'angle conseillé étaient justes ou non
- Si besoin, corrige précisément
- Si le profil était pro, précise si l'argumentation était vraiment adaptée au professionnel ou trop orientée particulier

Meilleure relance possible
- Propose une formulation vendeur courte et crédible qui aurait pu mieux faire avancer la vente
- Si le profil est pro, fais une relance adaptée à un client professionnel
`;
}

function getRenaultEvaluationPrompt({
  trust,
  mode,
  profil,
  scenario,
  vehicleAge,
  energyType,
  liveSkills,
  prices
}) {
  return `
Tu es un évaluateur métier d'une simulation commerciale Renault sur les Contrats Entretien Privilèges / Privilèges+.

MISSION :
Évaluer la performance du vendeur de façon claire, concrète, utile, exigeante et orientée progression.

IDENTITÉ DU PARCOURS RENAULT :
Le bloc Renault évalue surtout :
- la capacité à vendre une offre perçue comme plus chère
- la capacité à transformer le prix en valeur
- la qualité de la découverte pour sortir d’une simple comparaison de mensualité
- la capacité à défendre l’offre sans se dévaloriser
- la qualité du traitement des objections prix
- la capacité à conclure sans casser la valeur

BASE MÉTIER À RESPECTER :
- Souscription véhicules Renault de 1 à 8 ans + 6 mois de souplesse selon les cas, max 120 000 km à la souscription
- Durée max 48 mois
- Fin de contrat max 200 000 km
- Contrat cessible ou résiliable, avec 38 € de frais de résiliation hors rachat du véhicule dans le réseau
- Offre professionnelle réservée aux artisans, commerçants et professions libérales en nom propre avec moins de 10 véhicules
- Les formes juridiques de type SARL sont exclues
- Privilèges = assistance + entretien + véhicule de remplacement + éléments d'entretien
- Privilèges+ = Privilèges + pièces d'usure + contrôle technique + couverture plus large
- Nouveautés à connaître : pompe à eau incluse si entraînée par la distribution, kit de butée sur tous les Privilèges+, contrôle technique dans Privilèges+, suppression du kit d’embrayage
- Arguments clés particuliers :
  - budget maîtrisé pendant 48 mois
  - respect de l'entretien
  - longévité du véhicule
  - qualité de suivi réseau
  - revente facilitée
  - assistance
  - véhicule de remplacement
- Arguments clés professionnels :
  - maîtrise du budget
  - limitation des imprévus
  - continuité d'usage du véhicule
  - limitation de l'immobilisation
  - intérêt concret pour l'activité
- Objections / réponses conseillées :
  - trop cher -> ce qui compte est la valeur concrète, la couverture et les coûts évités
  - je verrai plus tard -> la révision déjà faite ne sera pas comprise
  - je roule peu -> le temps et les aléas continuent d’exister même avec peu de kilomètres
  - si je revends -> le contrat est cessible ou résiliable, et peut aider la revente
- Tarifs exacts pour ce véhicule :
  - Privilèges : ${prices.cep}€ / mois
  - Privilèges+ : ${prices.cepp}€ / mois

BLOCS DE COMPÉTENCES À ÉVALUER :
1. Accueil / prise en charge
2. Découverte / questionnement
3. Argumentation produit
4. Traitement des objections
5. Conclusion commerciale

CONTEXTE :
- Mode : ${mode}
- Profil client : ${profil}
- Scénario : ${scenario}
- Âge véhicule : ${vehicleAge}
- Type énergie : ${energyType}
- Niveau de confiance final : ${trust}%

SIGNAUX LIVE FRONT :
${skillSummary(liveSkills)}

RÈGLES D'ÉVALUATION SPÉCIFIQUES RENAULT :
- Si le vendeur parle uniquement du prix sans reconstruire la valeur, sanctionne-le
- Si le vendeur valide trop vite que "c’est cher" sans défendre l’offre, sanctionne-le
- Si le vendeur se dévalorise verbalement ou abandonne trop vite, sanctionne-le
- Si le vendeur sort bien le client d’une logique de simple mensualité pour parler cohérence, couverture, sérénité, visibilité ou intérêt réel, valorise-le
- Si le profil est "prix", sois particulièrement exigeant sur la qualité de la démonstration de valeur
- Si le profil est "pro", tu dois vérifier que l’argumentation est vraiment adaptée à un professionnel
- Pour un profil pro, un discours trop orienté particulier ou trop générique doit être pénalisé
- Si le scénario est "vo", valorise le fait de proposer tôt, dès la livraison du véhicule d’occasion
- Si le vendeur ne vérifie pas ou n’évoque jamais l’éligibilité, la faisabilité, le kilométrage ou le cadre du contrat, cela doit peser négativement
- Ne surévalue pas artificiellement un échange moyen

FORMAT DE SORTIE OBLIGATOIRE :
Bilan final
Note globale : X/100

Étoiles / blocs de compétences
- Accueil / prise en charge : Validé ou Non validé — justification très courte
- Découverte / questionnement : Validé ou Non validé — justification très courte
- Argumentation produit : Validé ou Non validé — justification très courte
- Traitement des objections : Validé ou Non validé — justification très courte
- Conclusion commerciale : Validé ou Non validé — justification très courte

Points forts
- 2 ou 3 points max

Axes de progrès
- 2 ou 3 points max

Correction métier
- Dis si les prix, l'offre ou l'angle conseillé étaient justes ou non
- Si besoin, corrige précisément
- Si le profil était pro, précise si l'argumentation était vraiment adaptée au professionnel ou trop orientée particulier
- Dis clairement si le vendeur a bien défendu la valeur de l’offre Renault plus chère, ou s’il est resté trop passif sur le prix

Meilleure relance possible
- Propose une formulation vendeur courte et crédible qui aurait pu mieux faire avancer la vente
- Si le profil est pro, fais une relance adaptée à un client professionnel
`;
}

function getEvaluationPrompt(params) {
  return params.brand === "renault"
    ? getRenaultEvaluationPrompt(params)
    : getDaciaEvaluationPrompt(params);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      conversation = [],
      trust = 50,
      mode = "demo",
      profil = "hesitant",
      scenario = "revision",
      vehicleAge = "3 ans",
      energyType = "essence_gpl",
      liveSkills = {},
      brand = "dacia"
    } = req.body || {};

    const safeBrand = brand === "renault" ? "renault" : "dacia";
    const prices = getPriceTable(safeBrand, vehicleAge, energyType);

    const systemPrompt = getEvaluationPrompt({
      brand: safeBrand,
      trust,
      mode,
      profil,
      scenario,
      vehicleAge,
      energyType,
      liveSkills,
      prices
    });

    const conversationText = normalizeConversation(conversation);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        max_tokens: 700,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: conversationText
              ? `Voici la conversation à évaluer :\n${conversationText}`
              : "Aucune conversation exploitable n'a été transmise. Explique brièvement que l'évaluation est impossible."
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI evaluate error:", data);
      return res.status(500).json({
        error: data.error?.message || "Erreur OpenAI évaluation"
      });
    }

    const evaluation = data.choices?.[0]?.message?.content?.trim();

    if (!evaluation) {
      return res.status(500).json({ error: "Évaluation vide" });
    }

    return res.status(200).json({ evaluation });
  } catch (error) {
    console.error("API /evaluate error:", error);
    return res.status(500).json({ error: error.message || "API evaluate error" });
  }
}
