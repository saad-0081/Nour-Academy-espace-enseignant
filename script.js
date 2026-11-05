const liste = document.querySelector("#liste");
const compteur = document.querySelector("#compteur");
const tri = document.querySelector("#tri");
const selectGroupe = document.querySelector("#groupe");
const recherche = document.querySelector("#recherche");
const vide = document.querySelector("#vide");

function calculerMoyenne(notes) {
    if (notes.length === 0) {
        return "—";
    }

    const somme = notes.reduce(
        (total, note) => total + note, 0
    );

    const moyenne = somme / notes.length;

    return moyenne.toFixed(1).replace(".", ",") + " / 20";
}

function moyenneNombre(notes) {
    if (notes.length === 0) {
        return -1;
    }

    const somme = notes.reduce(
        (total, note) => total + note, 0
    );

    return somme / notes.length;
}

function texteAbsences(nombre) {
    return nombre + (nombre > 1 ? " absences" : " absence");
}

function normaliser(texte) {
    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function majAlerte(li, eleve) {
    if (eleve.absences >= 3) {
        li.classList.add("alerte");

        if (!li.querySelector(".badge-alerte")) {
            const badge = document.createElement("span");

            badge.classList.add("badge-alerte");
            badge.textContent = "Prévenir les parents";

            li.append(badge);
        }
    }
}

function creerLigne(eleve) {
    const li = document.createElement("li");
    li.classList.add("ligne");
    li.dataset.id = eleve.id;

    const nom = document.createElement("span");
    nom.classList.add("nom");
    nom.textContent = eleve.prenom + " " + eleve.nom;

    const infos = document.createElement("div");
    infos.classList.add("infos");

    const absences = document.createElement("span");
    absences.classList.add("absences");
    absences.textContent = texteAbsences(eleve.absences);

    const moyenne = document.createElement("span");
    moyenne.classList.add("moyenne");
    moyenne.textContent = calculerMoyenne(eleve.notes);

    infos.append(absences, moyenne);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const boutonAbsent = document.createElement("button");
    boutonAbsent.type = "button";
    boutonAbsent.textContent = "Absent";
    boutonAbsent.dataset.action = "absence";

    const boutonNote = document.createElement("button");
    boutonNote.type = "button";
    boutonNote.textContent = "Ajouter la note";
    boutonNote.dataset.action = "note";

    actions.append(boutonAbsent, boutonNote);

    li.append(nom, infos, actions);

    majAlerte(li, eleve);

    return li;
}

function creerOption(groupe) {
    const option = document.createElement("option");

    option.value = groupe.id;
    option.textContent = groupe.nom + " — " + groupe.cours;

    return option;
}

const optionTous = document.createElement("option");

optionTous.value = "";
optionTous.textContent = "Tous les groupes";

selectGroupe.append(optionTous);

groupes.forEach(function(groupe) {
    selectGroupe.append(creerOption(groupe));
});

function afficher() {
    const groupeChoisi = selectGroupe.value;
    const texte = normaliser(recherche.value.trim());

    const resultats = eleves.filter(function(eleve) {
        const bonGroupe =
            groupeChoisi === "" ||
            eleve.groupeId === Number(groupeChoisi);

        const nomComplet = normaliser(
            eleve.prenom + " " + eleve.nom
        );

        const bonNom = nomComplet.includes(texte);

        return bonGroupe && bonNom;
    });

    resultats.sort(function(a, b) {
        if (tri.value === "nom") {
            const nomA = a.prenom + " " + a.nom;
            const nomB = b.prenom + " " + b.nom;

            return nomA.localeCompare(nomB, "fr");
        }

        if (tri.value === "moyenne") {
            return moyenneNombre(b.notes) - moyenneNombre(a.notes);
        }

        if (tri.value === "absences") {
            return b.absences - a.absences;
        }

        return 0;
    });

    liste.replaceChildren();
    liste.append(...resultats.map(creerLigne));
    compteur.textContent = resultats.length +
        (resultats.length > 1 ? " élèves" : " élève");

    vide.hidden = resultats.length > 0;
}

liste.addEventListener("click", function(event) {
    const bouton = event.target.closest("button");

    if (!bouton) return;

    const li = bouton.closest(".ligne");

    if (!li) return;

    const id = Number(li.dataset.id);

    const eleve = eleves.find(function(eleve) {
        return eleve.id === id;
    });

    if (!eleve) return;

    if (bouton.dataset.action === "absence") {
        eleve.absences++;

        li.querySelector(".absences").textContent =
            texteAbsences(eleve.absences);

        majAlerte(li, eleve);
    }

    if (bouton.dataset.action === "note") {
        const saisie = prompt("Entrer une note entre 0 et 20 :");

        if (saisie === null) return;

        const note = Number(saisie.trim().replace(",", "."));

        if (
            saisie.trim() === "" ||
            !Number.isFinite(note) ||
            note < 0 ||
            note > 20
        ) {
            alert("Note invalide ! Entrez un nombre entre 0 et 20.");
            return;
        }

        eleve.notes.push(note);

        li.querySelector(".moyenne").textContent =
            calculerMoyenne(eleve.notes);
    }
});

selectGroupe.addEventListener("change", afficher);
recherche.addEventListener("input", afficher);
tri.addEventListener("change", afficher);

afficher();
const formulaire = document.querySelector("#form-eleve");

const prenom = document.querySelector("#prenom");
const nom = document.querySelector("#nom");
const groupeEleve = document.querySelector("#groupe-eleve");
const emailParent = document.querySelector("#email-parent");
const telephoneParent = document.querySelector("#telephone-parent");
const codeAcces = document.querySelector("#code-acces");

const messageForm = document.querySelector("#message-form");

groupes.forEach(function(groupe) {
    groupeEleve.append(creerOption(groupe));
});

const regexNom = /^[\p{L}]+(?:[ -][\p{L}]+)*$/u;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
const regexTelephone = /^(?:(?:06|07|05)\d{8}|\+212[567]\d{8})$/;
const regexCode = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function verifierChamp(champ) {

    const valeur = champ.value.trim();

    let valide = false;
    let message = "";

    if (champ === prenom) {
        valide = regexNom.test(valeur) &&
            valeur.replace(/[^\p{L}]/gu, "").length >= 2;

        message = valide ?
            "Prénom valide." :
            "Minimum 2 lettres, sans chiffres.";
    } else if (champ === nom) {
        valide = regexNom.test(valeur) &&
            valeur.replace(/[^\p{L}]/gu, "").length >= 2;

        message = valide ?
            "Nom valide." :
            "Minimum 2 lettres, sans chiffres.";
    } else if (champ === groupeEleve) {
        valide = valeur !== "";
        message = valide ?
            "Groupe sélectionné." :
            "Veuillez choisir un groupe.";
    } else if (champ === emailParent) {
        valide = regexEmail.test(valeur);
        message = valide ?
            "Email valide." :
            "Veuillez saisir un email valide.";
    } else if (champ === telephoneParent) {
        valide = regexTelephone.test(valeur);
        message = valide ?
            "Téléphone valide." :
            "Numéro marocain invalide.";
    } else if (champ === codeAcces) {
        valide = regexCode.test(valeur);
        message = valide ?
            "Code valide." :
            "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.";
    }

    const messageChamp = document.querySelector(
        "#message-" + champ.id
    );

    champ.classList.toggle("valide", valide);
    champ.classList.toggle("invalide", !valide);

    messageChamp.textContent = message;
    messageChamp.classList.toggle("succes", valide);
    messageChamp.classList.toggle("erreur", !valide);

    return valide;
}

const champs = [
    prenom,
    nom,
    groupeEleve,
    emailParent,
    telephoneParent,
    codeAcces
];

champs.forEach(function(champ) {

    champ.addEventListener("input", function() {
        verifierChamp(champ);
    });

    champ.addEventListener("change", function() {
        verifierChamp(champ);
    });

});

formulaire.addEventListener("submit", function(event) {

    event.preventDefault();

    messageForm.textContent = "";
    messageForm.className = "message-form";

    const resultats = champs.map(function(champ) {
        return verifierChamp(champ);
    });

    const tousValides = resultats.every(function(resultat) {
        return resultat === true;
    });

    if (!tousValides) {

        const premierInvalide = champs.find(function(champ) {
            return !verifierChamp(champ);
        });

        premierInvalide.focus();
        return;
    }

    const groupeId = Number(groupeEleve.value);

    const existeDeja = eleves.some(function(eleve) {

        return (
            eleve.groupeId === groupeId &&
            normaliser(eleve.prenom) === normaliser(prenom.value.trim()) &&
            normaliser(eleve.nom) === normaliser(nom.value.trim())
        );

    });

    if (existeDeja) {

        const message = document.querySelector("#message-prenom");

        message.textContent = "Cet eleve existe deja .";
        message.className = "message erreur";

        prenom.classList.add("invalide");
        prenom.focus();

        return;
    }

    const nombreEleves = eleves.filter(function(eleve) {
        return eleve.groupeId === groupeId;
    }).length;

    if (nombreEleves >= 15) {

        const message = document.querySelector("#message-groupe-eleve");

        message.textContent = "Ce groupe contient deja 15 eleve.";
        message.className = "message erreur";

        groupeEleve.classList.add("invalide");
        groupeEleve.focus();

        return;
    }

    const nouvelEleve = {

        id: Math.max(...eleves.map(function(eleve) {
            return eleve.id;
        })) + 1,

        prenom: prenom.value.trim(),
        nom: nom.value.trim(),
        groupeId: groupeId,
        emailParent: emailParent.value.trim(),
        telephoneParent: telephoneParent.value.trim(),
        absences: 0,
        notes: []

    };

    eleves.push(nouvelEleve);

    selectGroupe.value = String(groupeId);
    afficher();

    formulaire.reset();

    champs.forEach(function(champ) {

        champ.classList.remove("valide", "invalide");

        const message = document.querySelector(
            "#message-" + champ.id
        );

        message.textContent = "";
        message.className = "message";

    });

    messageForm.textContent = "eleve est ajouter ";
    messageForm.classList.add("succes");

});