# Nour Academy — Espace enseignant (Partie 3)

Outil web simple pour les enseignants de Nour Academy : faire l'appel, saisir les notes et suivre le bilan de chaque groupe. Projet individuel en JavaScript natif, sans serveur ni librairie.

> Les parties précédentes : portail parents (Partie 1) et back-office du secrétariat (Partie 2).

## Liens

| Livrable | Lien |
|---|---|
| Site déployé (GitHub Pages) | `https://<TON-USER>.github.io/nour-academy/` |
| Dépôt GitHub | `https://github.com/<TON-USER>/nour-academy` |
| Board Jira | `https://saadelmoudnib2006.atlassian.net/jira/software/projects/NAE/boards` |

## Contexte

Les 40 enseignants des 3 centres notent présences et notes sur papier. Les parents découvrent les absences en fin de mois et le calcul des moyennes prend 2 h par groupe et par mois.

**Objectifs chiffrés**
- Appel en moins de 2 minutes
- Moyenne du groupe en un clic
- Élèves à 3 absences signalés le jour même

**Utilisateurs**
- **Laila**, professeure de maths (2e Bac, Nador Centre) : fait l'appel sur son téléphone en début de séance.
- **M. Bennani**, directeur : veut voir les élèves en alerte et la moyenne de chaque groupe.

## Fonctionnalités

| Ticket | User story | Résumé |
|---|---|---|
| NAE-2 | US1 | Afficher le groupe : nom, absences, moyenne, compteur d'élèves |
| NAE-3 | US2 | Choisir un groupe et rechercher un élève (filtres combinés) |
| NAE-4 | US3 | Marquer un absent, ajouter une note, alerte à 3 absences |
| NAE-5 | US4 | Ajouter un élève avec contrôle en temps réel par Regex |
| NAE-6 | US5 | Bilan du groupe : moyenne, absences, parents à appeler |

États d'interface prévus : aucun résultat, note refusée, élève en alerte, groupe complet, champ en erreur, ajout réussi.

## Captures d'écran

| Mobile (360 px) | Desktop (1440 px) |
|---|---|
| ![Mobile](captures/mobile.png) | ![Desktop](captures/desktop.png) |

> À remplacer par les vraies captures dans le dossier `captures/`.

## Choix de style

**CSS natif**, avec la charte graphique définie dans `:root` (couleurs, espacements).

Justification : le projet est petit (une page, quelques composants), la charte tient dans quelques variables CSS, et cela évite une étape de build (Vite, Tailwind) pour un site déployé tel quel sur GitHub Pages. L'approche est mobile first : styles de base dès 360 px, puis `@media (min-width: 600px)` pour les grands écrans. Les zones tactiles font au moins 44 px.

## Besoin → méthode de tableau utilisée

Aucune boucle `for` n'est utilisée pour chercher, filtrer, transformer ou compter. `forEach` sert uniquement à l'ajout dans le DOM.

| Besoin | Méthode | Pourquoi |
|---|---|---|
| Transformer chaque élève en ligne HTML | `map` | Un tableau d'élèves donne un tableau de lignes |
| Calculer la moyenne d'un élève | `reduce` | Cumuler les notes en une seule valeur |
| Afficher un seul groupe et filtrer par recherche | `filter` (un seul, critères combinés) | Garder les élèves qui respectent les deux critères |
| Retrouver l'élève cliqué via `data-id` | `find` | Un seul élément attendu, pas un tableau |
| Vérifier qu'un élève existe déjà dans le groupe | `some` | Réponse oui/non dès qu'un élément correspond |
| Vérifier que tous les champs sont valides | `every` | Tous doivent respecter la règle |
| Moyenne du groupe et total des absences | `reduce` | Cumul sur tout le groupe |
| Compter les élèves en alerte | `filter` + `length` | Garder ceux à 3 absences ou plus |
| Liste « Parents à appeler » | `filter` + `map` | Sélectionner puis formater « prénom nom — téléphone » |
| Confirmer « Aucun élève en alerte » | `every` | Aucun élève ne doit avoir 3 absences |

## Expressions régulières (Regex)

```js
const regexNom   = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const regexTel   = /^(?:0|\+212)[67]\d{8}$/;
const regexCode  = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
```

| Champ | Cas valides | Cas invalides |
|---|---|---|
| Prénom / nom | `Yassine`, `El Amrani`, `Anne-Marie` | `A`, `Omar2`, chaîne vide |
| Email | `parent@mail.com` | `parent@mail`, `parent mail.com`, `@mail.com` |
| Téléphone | `0661234567`, `0772345678`, `+212661234567` | `0561234567`, `066123456`, `+21266123` |
| Code d'accès | `Nour2026!` | `nour2026!` (pas de majuscule), `Nour!!!!` (pas de chiffre), `Nour1!` (trop court) |

> Cocher chaque cas ci-dessus après l'avoir testé dans le formulaire.

## Protection des données (loi 09-08, CNDP)

- Toutes les données sont **fictives**.
- Le **code d'accès provisoire** n'est ni affiché, ni stocké dans l'objet élève ; le champ est vidé après l'envoi.

## Organisation du travail

- Un ticket Jira (`NAE-x`) par user story, avec ses critères d'acceptation.
- Une branche par story : `feature/NAE-<n>-<description>` (ex. `feature/NAE-4-appel`).
- La clé du ticket figure dans les commits (`NAE-4 ...`) et dans le titre de la PR.
- Une PR décrite par user story, fusionnée dans `main`, puis vérification de la version en ligne.

## Difficultés et solutions

> À compléter avec un bug réellement rencontré (exigé pour l'évaluation CT5N2).

**Bug rencontré** : _décris le symptôme observé_

**Cause** : _explique pourquoi cela arrivait_

**Solution retenue** : _explique la correction et pourquoi ce choix_

Piste fréquente pour cette mission : après un filtrage, les lignes sont recréées ; un écouteur posé sur chaque ligne serait perdu. D'où le choix d'un **seul écouteur sur le conteneur** (délégation avec `closest` et `data-id`).

## Structure du projet

```
nour-academy/
├── index.html
├── style.css
├── data.js      
├── script.js
└── README.md
```

## Sources

- MDN Web Docs : méthodes de tableau (`map`, `filter`, `find`, `some`, `every`, `reduce`), `Element.closest()`, `dataset`, expressions régulières
- Documentation GitHub Pages
- Documentation Jira (GitHub for Jira, Automation)
