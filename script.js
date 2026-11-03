const liste = document.querySelector("#liste");
const compteur = document.querySelector("#compteur");

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

function texteAbsences(nombre) {
    return nombre + (nombre > 1 ? " absences" : " absence");
}

function normaliser(texte) {

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}



function creerLigne(eleve) {

    const li = document.createElement("li");
    li.classList.add("ligne");

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

    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.classList.add("btn-absent");
    bouton.textContent = "Absent";

    bouton.addEventListener("click", function() {

        eleve.absences++;

        absences.textContent = texteAbsences(eleve.absences);

        if (eleve.absences >= 3) {
            li.classList.add("alerte");
        }

    });

    if (eleve.absences >= 3) {
        li.classList.add("alerte");
    }

    li.append(nom, infos, bouton);

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

    liste.replaceChildren(...resultats.map(creerLigne));

    compteur.textContent =
        resultats.length +
        (resultats.length > 1 ? " élèves" : " élève");

    vide.hidden = resultats.length > 0;
}

selectGroupe.addEventListener("change", afficher);

recherche.addEventListener("input", afficher);

afficher();
