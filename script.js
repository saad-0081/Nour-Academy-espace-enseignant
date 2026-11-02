const liste = document.querySelector("#liste");
const compteur = document.querySelector("#compteur");

function calculerMoyenne(notes) {
    if (notes.length === 0) {
        return "—";
    }

    const somme = notes.reduce((total, note) => total + note, 0);
    const moyenne = somme / notes.length;

    return moyenne.toFixed(1).replace(".", ",") + " / 20";
}

function creerLigne(eleve) {
    const li = document.createElement("li");
    li.classList.add("ligne");

    const nom = document.createElement("span");
    nom.textContent = eleve.prenom + " " + eleve.nom;

    const absences = document.createElement("span");
    absences.textContent = eleve.absences + " absence(s)";

    const moyenne = document.createElement("span");
    moyenne.textContent = calculerMoyenne(eleve.notes);

    const bouton = document.createElement("button");
    bouton.textContent = "Absent";

    bouton.addEventListener("click", function() {
        eleve.absences++;
        absences.textContent = eleve.absences + " absence(s)";

        if (eleve.absences >= 3) {
            li.classList.add("alerte");
        }
    });

    if (eleve.absences >= 3) {
        li.classList.add("alerte");
    }

    li.append(nom, absences, moyenne, bouton);

    return li;
}

const lignes = eleves.map(creerLigne);
liste.append(...lignes);

compteur.textContent = eleves.length + " élèves";