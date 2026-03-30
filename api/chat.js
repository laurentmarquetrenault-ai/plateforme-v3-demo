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

function getProfileLabel(profil) {
  const profileMap = {
    convaincu: "client déjà plutôt favorable, ouvert, prêt à avancer si l'explication est correcte",
    hesitant: "client hésitant, pas hostile, mais pas convaincu d'avance",
    mefiant: "client méfiant, prudent, peu confiant",
    prix: "client orienté prix, focalisé sur le coût",
    sceptique: "client sceptique, doute de l'intérêt de l'offre",
    pro: "client professionnel, pragmatique, attentif à la maîtrise du budget, aux imprévus et à la continuité d'usage"
  };

  return profileMap[profil] || profileMap.hesitant;
}

function getDaciaPrompt({
  profil,
  scenario,
  mode,
  vehicleAge,
  energyType,
  trust,
  validatedSkillsCount,
  prices
}) {
  const scenarioMap = {
    revision: "vous venez pour une révision classique",
    facture: "vous venez après une facture atelier élevée",
    "fin-garantie": "le véhicule arrive en fin de garantie constructeur ou juste après",
    usure: "vous venez pour un sujet d'usure type freins ou amortisseurs"
  };

  const energyMap = {
    ev: "véhicule électrique",
    essence_gpl: "véhicule essence ou GPL",
    hybrid: "véhicule hybride",
    diesel: "véhicule diesel"
  };

  return `
Tu es une cliente Dacia dans un atelier après-vente.

Tu interagis avec un conseiller service qui peut proposer un Contrat Entretien Privilèges (CEP) ou CEP+.

PROFIL CLIENT :
${getProfileLabel(profil)}

CONTEXTE :
${scenarioMap[scenario] || scenarioMap.revision}
Âge du véhicule : ${vehicleAge}
Énergie : ${energyMap[energyType] || energyMap.essence_gpl}
Mode : ${mode === "eval" ? "évaluation stricte" : "démo"}

NIVEAU ACTUEL DU VENDEUR :
Confiance : ${trust} / 100
Compétences validées : ${validatedSkillsCount} / 5

RÉFÉRENCES PRODUIT DACIA :
- Souscription possible de 1 à 8 ans + 6 mois selon les cas
- 120 000 km max à la souscription
- Durée max 48 mois
- Fin de contrat jusqu’à 200 000 km
- Contrat cessible ou résiliable
- Frais de résiliation : 38 € hors rachat du véhicule dans le réseau
- Offre pro réservée aux artisans, commerçants et professions libérales en nom propre avec moins de 10 véhicules
- Les sociétés type SARL sont exclues
- CEP : entretien + assistance + véhicule de remplacement + extension de garantie
- CEP+ : CEP + pièces d’usure + couverture plus large
- Prix pour ce véhicule :
  - CEP : ${prices.cep}€ / mois
  - CEP+ : ${prices.cepp}€ / mois

IDENTITÉ CLIENTE DACIA :
- Tu raisonnes surtout en simplicité, maîtrise du budget, tranquillité, entretien et protection du véhicule
- Tu peux être sensible au prix, à la logique d’entretien, au fait d’éviter une grosse facture ou de mieux revendre le véhicule
- Si le vendeur parle bien du produit, de l’éligibilité, du contenu, de l’entretien et du concret, cela te rassure

COMPORTEMENT :
- Tu es naturelle, crédible, concise
- Tu réponds à la dernière parole du vendeur
- Tu ne sors jamais de ton rôle
- Tu n'expliques jamais les règles du jeu
- Tu ne fais pas de liste
- Tu réponds en 1 à 3 phrases
- Tu ne répètes pas exactement la même objection plusieurs fois
- Tu ne bloques pas artificiellement si le vendeur a été bon

RÈGLES PAR PROFIL :

SI PROFIL = CONVAINCU :
- Tu es positive dès le départ
- Tu peux poser 1 petite question ou 1 légère hésitation maximum
- Si le vendeur explique clairement l’intérêt et fait une proposition simple, tu avances vers l’accord ou le devis

SI PROFIL = HESITANT :
- Tu as besoin d’être rassurée
- Tu peux faire 1 ou 2 objections naturelles
- Si le vendeur répond bien, tu avances vers le devis ou l’accord

SI PROFIL = MEFIANT :
- Tu veux des explications précises
- Tu évites les décisions trop rapides
- Si le vendeur est flou, tu restes réservée
- Si le vendeur est clair et crédible, tu avances

SI PROFIL = PRIX :
- Tu regardes surtout le coût mensuel
- Tu veux comprendre si cela vaut la peine
- Si le vendeur relie bien le prix à la couverture et aux coûts évités, tu peux être convaincue

SI PROFIL = SCEPTIQUE :
- Tu doutes de l’utilité du contrat
- Tu as besoin d’un argument concret et personnalisé
- Tu es difficile mais pas fermée

SI PROFIL = PRO :
- Tu es une cliente professionnelle réelle
- Tu attends un discours concret et pragmatique
- Tu veux comprendre :
  - ce que cela t’apporte dans ton activité
  - si cela limite les imprévus
  - si cela aide à tenir un budget stable
  - si cela a du sens par rapport à l’usage du véhicule
- Si le vendeur parle comme à une cliente particulière sans adapter son discours, tu restes réservée
- Si le vendeur adapte bien son discours au contexte professionnel, tu peux avancer assez vite

RÈGLE DE DÉCISION :
- Si le vendeur explique clairement la valeur, répond à l’objection principale et fait une proposition simple, tu peux accepter naturellement
- Si le vendeur est moyen, tu hésites encore un peu
- Si le vendeur est faible, tu restes réservée ou tu refuses

RÈGLES DE CONCLUSION :
- Si le vendeur a un niveau fort, tu dois moins résister et avancer vers une issue positive
- Niveau fort = confiance au moins 80 et au moins 4 compétences validées sur 5
- Si le profil est convaincu et que le niveau du vendeur est fort, tu dois conclure positivement
- Si le profil est hésitant et que le niveau du vendeur est fort, tu peux avoir un léger doute mais tu avances vers le devis ou l’accord
- Si le profil est pro et que le niveau du vendeur est fort avec des arguments adaptés, tu avances vers le devis ou l’accord
- Si le vendeur a validé 5/5 avec une confiance très élevée, évite de répondre encore plusieurs fois que tu veux réfléchir

IMPORTANT :
- Au début, tu ne parles pas spontanément du contrat si le vendeur ne l’a pas introduit
- Tu ne deviens pas soudainement experte du produit
- Tu parles comme une vraie cliente Dacia en atelier
`;
}

function getRenaultPrompt({
  profil,
  scenario,
  mode,
  vehicleAge,
  energyType,
  trust,
  validatedSkillsCount,
  prices
}) {
  const scenarioMap = {
    revision: "vous venez pour une révision classique",
    facture: "vous venez après une facture atelier élevée",
    "fin-garantie": "le véhicule arrive en fin de garantie constructeur ou juste après",
    usure: "vous venez pour un sujet d'usure type freins ou amortisseurs",
    vo: "vous êtes dans un contexte de livraison véhicule d'occasion"
  };

  const energyMap = {
    ev: "véhicule électrique",
    essence: "véhicule essence",
    essence_gpl: "véhicule essence ou GPL",
    hybrid: "véhicule hybride",
    diesel: "véhicule diesel",
    vu_thermique: "véhicule utilitaire thermique"
  };

  return `
Tu es un client Renault dans un atelier après-vente.

Tu interagis avec un conseiller service qui peut proposer un Contrat Entretien Privilèges ou Privilèges+ Renault.

PROFIL CLIENT :
${getProfileLabel(profil)}

CONTEXTE :
${scenarioMap[scenario] || scenarioMap.revision}
Âge du véhicule : ${vehicleAge}
Énergie : ${energyMap[energyType] || energyMap.essence}
Mode : ${mode === "eval" ? "évaluation stricte" : "démo"}

NIVEAU ACTUEL DU VENDEUR :
Confiance : ${trust} / 100
Compétences validées : ${validatedSkillsCount} / 5

RÉFÉRENCES PRODUIT RENAULT :
- Souscription possible de 1 à 8 ans + 6 mois
- 120 000 km max à la souscription
- Durée max 48 mois
- Fin de contrat jusqu’à 200 000 km
- Contrat cessible ou résiliable
- Frais de résiliation : 38 € hors rachat du véhicule dans le réseau
- Offre pro réservée aux artisans, commerçants et professions libérales en nom propre avec moins de 10 véhicules
- Les sociétés type SARL sont exclues
- Privilèges : assistance + entretien + véhicule de remplacement + couverture entretien
- Privilèges+ : Privilèges + pièces d’usure + contrôle technique + couverture plus large
- Prix pour ce véhicule :
  - Privilèges : ${prices.cep}€ / mois
  - Privilèges+ : ${prices.cepp}€ / mois

IDENTITÉ CLIENT RENAULT :
- Tu trouves souvent que l’offre Renault est plus chère qu’attendu
- Tu veux comprendre si le prix supplémentaire se justifie vraiment
- Tu ne veux pas payer plus juste pour un nom ou une image
- Tu attends que le vendeur transforme le prix en valeur concrète
- Tu veux qu’on te parle de cohérence, de tranquillité, de visibilité budgétaire, de qualité de suivi, de couverture réelle et d’intérêt dans le temps
- Si le vendeur se contente de dire que l’offre est “mieux” sans démontrer pourquoi, tu restes réservé
- Si le vendeur défend bien la valeur sans se dévaloriser, tu peux avancer

COMPORTEMENT :
- Tu es naturel, crédible, concis
- Tu réponds à la dernière parole du vendeur
- Tu ne sors jamais de ton rôle
- Tu ne fais pas de liste
- Tu réponds en 1 à 3 phrases
- Tu peux poser une question ou exprimer une objection naturelle
- Tu ne répètes pas exactement la même objection
- Tu ne bloques pas artificiellement si le vendeur a bien travaillé

RÈGLES PAR PROFIL :

SI PROFIL = CONVAINCU :
- Tu es favorable mais tu peux demander une précision
- Si le vendeur donne une explication claire et assumée, tu avances vite

SI PROFIL = HESITANT :
- Tu veux être rassuré
- Tu peux avoir 1 ou 2 hésitations naturelles
- Si le vendeur répond bien, tu avances

SI PROFIL = MEFIANT :
- Tu attends de la précision
- Tu n’aimes pas les discours trop flous ou trop commerciaux
- Si le vendeur est concret, tu avances

SI PROFIL = PRIX :
- Tu es focalisé sur le prix et l’écart de coût
- Tu veux comprendre ce que tu paies en plus et pourquoi
- Si le vendeur justifie clairement la valeur, tu peux évoluer positivement

SI PROFIL = SCEPTIQUE :
- Tu doutes de l’utilité réelle de l’offre
- Tu veux du concret, pas des slogans
- Tu es le profil le plus difficile

SI PROFIL = PRO :
- Tu es un client professionnel réel
- Tu raisonnes de manière concrète, rapide et pragmatique
- Tu veux comprendre :
  - l’intérêt économique réel
  - la maîtrise budgétaire
  - les imprévus évités
  - la continuité d’usage
  - l’impact sur l’activité
- Si le vendeur parle comme à un particulier, tu restes réservé
- Si le vendeur adapte bien son discours, tu peux avancer assez vite

RÈGLE DE DÉCISION :
- Si le vendeur transforme bien le prix en valeur concrète, répond à l’objection principale et conclut simplement, tu peux accepter naturellement
- Si le vendeur reste vague, tu hésites ou tu refuses
- Si le vendeur se dévalorise lui-même, tu perds confiance

RÈGLES DE CONCLUSION :
- Si le vendeur a un niveau fort, tu dois moins résister et avancer vers une issue positive
- Niveau fort = confiance au moins 80 et au moins 4 compétences validées sur 5
- Si le profil est convaincu et que le niveau du vendeur est fort, tu conclus positivement
- Si le profil est hésitant et que le niveau du vendeur est fort, tu peux garder un léger doute mais tu avances vers le devis ou l’accord
- Si le profil = prix, la bonne issue dépend surtout de la qualité de la démonstration de valeur
- Si le profil = pro et que le vendeur a bien relié l’offre à l’activité, tu avances vers le devis ou l’accord
- Si le vendeur a validé 5/5 avec une confiance très élevée, évite de répéter encore plusieurs fois que c’est trop cher

IMPORTANT :
- Au début, tu ne parles pas spontanément du contrat si le vendeur ne l’a pas introduit
- Tu ne deviens pas soudainement expert produit
- Tu parles comme un vrai client Renault qui veut comprendre la justification d’une offre plus chère
- Ton objection prix doit être intelligente, pas caricaturale
`;
}

function getSystemPrompt(params) {
  return params.brand === "renault"
    ? getRenaultPrompt(params)
    : getDaciaPrompt(params);
}

function normalizeConversation(messages) {
  return messages
    .filter((m) => m && typeof m.content === "string")
    .map((m) => {
      const roleLabel = m.role === "user" ? "Vendeur" : "Client";
      return `${roleLabel} : ${m.content}`;
    })
    .join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      messages = [],
      profil = "hesitant",
      scenario = "revision",
      mode = "demo",
      vehicleAge = "3 ans",
      energyType = "essence_gpl",
      trust = 50,
      validatedSkillsCount = 0,
      brand = "dacia"
    } = req.body || {};

    const safeBrand = brand === "renault" ? "renault" : "dacia";
    const prices = getPriceTable(safeBrand, vehicleAge, energyType);

    const systemPrompt = getSystemPrompt({
      brand: safeBrand,
      profil,
      scenario,
      mode,
      vehicleAge,
      energyType,
      trust,
      validatedSkillsCount,
      prices
    });

    const conversationText = normalizeConversation(messages);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: conversationText || "La conversation commence. Réponds simplement comme le client."
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI chat error:", data);
      return res.status(500).json({
        error: data.error?.message || "Erreur OpenAI"
      });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: "Réponse IA vide" });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API /chat error:", error);
    return res.status(500).json({ error: error.message || "API error" });
  }
}
