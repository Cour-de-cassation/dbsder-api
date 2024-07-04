# Règles de filtrage pour les décision insérées dans la base SDER via l'API

## Introduction

- Les règles de filtrage décrite ci-dessous sont appliquées à toutes les décisions qui sont insérées dans la base de donnée mongodb maintenue par le SDER via le endpoint `/decisions`
- A date, seule les décisions des tribunaux judiciaire sont insérée via cette API, l'insertion dans la base de donnée des décisions de Cour de cassation et de Cour d'appel via cette API interviendra suite a l'adaptation du projet [open-justice-sder](https://github.com/Cour-de-cassation/openjustice-sder/).
- Certains filtres appliqués dépendent de métadonnées associées au code NAC (nature d'affaire civile) de la décision, contenue dans la table `codenacs` de notre base de donnée, mise à jour régulièrement en fonction de la création ou de la suppression de codes.
- Certains filtres appliqués dépendent de la réponse de l'API de zonage sur la décision. Le zonage est un outil interne qui permet de délimiter les zones d'une décision de justice (introduction, motivation, etc.). Par analyse du texte, le zonage fournit également un indicateur permettant d'évaluer la publicité et la publicité des débats d'une décision. Le zonage étant nécessaire pour le filtrage, une décision est rejetée par l'API si on ne peut pas calculer son zonage (API de zonage indisponible, texte mal encodé, etc.)

## Description des règles de filtrage

Le blocage de la décision s'effectue via son champ `labelStatus`. Si une décision est présente dans notre base de donnée avec un `labelStatus` différent de `toBeTreated` alors elle ne sera pas traitée et restera bloquée jusqu'à un éventuel déblocage.
Etant donné qu'une décision ne peut avoir qu'une seule raison de blocage, le filtrage est effectué de manière séquentielle. Si une décision est bloquée selon un filtre alors les filtres suivants ne sont pas évalués et la décision est bloquée avec le `labelStatus` associé au premier blocage rencontré. Les règles de filtrage présentées ici sont implémentées dans le fichier [computeLabelStatus](../src/domain/business-rules/computeLabelStatus.rules.ts)

1. Si le code NAC de la décision est absent de la collection `codenacs` : `labelStatus = ignored_codeNACInconnu`
2. Si la juridiction a indiqué que cette décision n'était pas publique : `labelStatus = ignored_decisionNonPublique`
3. Si les métadonnées du code NAC indiquent que la décision n'est pas publique : `labelStatus = ignored_codeNACdeDecisionNonPublique`
4. Si le zonage, par recherche de mots clefs dans le texte de la décision, indique que la décision n'est pas publique : `labelStatus = ignored_decisionNonPubliqueParZonage`
5. Si le bloc d'occultation de la décision ou ses catégories à ne pas occulter (données issues du code NAC) ne sont pas définies : `labelStatus = ignored_blocOcculationNonDefini`
6. Si les débats de la décision sont marqués comme publics (Si les débats sont non publics alors la décision sera publiée en occultant les motivations, les 2 filtres suivants visent à pallier d'éventuelles erreurs de saisie des juridiction en bloquant les décisions dont la publicité des débats aurait été mal renseignée):
   - Si les métadonnées du code NAC indiquent que les débats de la décision ne sont pas publics : `labelStatus = ignored_codeNACdeDecisionPartiellementPublique`
   - Si le zonage, par recherche de mots clefs dans le texte de la décision, indique que les débats de la décision ne sont pas publics : `labelStatus = ignored_decisionPartiellementPubliqueParZonage`

Si une décision passe avec succès tous ces filtres alors elle est insérée dans notre base de donnée avec `labelStatus = toBeTreated` et sera pseudonymisée puis publiée sur le moteur de recherche [Judilibre](https://www.courdecassation.fr/acces-rapide-judilibre) et sur l'[API Judilibre](https://api.gouv.fr/les-api/api-judilibre)
