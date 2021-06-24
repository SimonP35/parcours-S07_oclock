let app = {

    apiRootUrl: "http://localhost:8080",

    init: function () {
        // console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        app.loadVideoGames();
    },
    addAllEventListeners: function () {
        // On récupère l'élément <select> des jeux vidéo
        let selectElement = document.querySelector('.form-control');
        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        selectElement.addEventListener('change', app.handleVideogameSelected);

        // On récupère le bouton pour ajouter un jeu vidéo
        let addVideogameButtonElement = document.getElementById('btnAddVideogame');
        // On ajoute l'écouteur pour l'event "click"
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);

        // Récupération du formulaire d'ajout et ajout de l'écouteur d'évenement
        let formElement = document.querySelector("#addVideogameForm");
        formElement.addEventListener("submit", app.handleFormSubmit);

    },
    handleVideogameSelected: function (evt) {
        // Récupérer la valeur du <select> (id du videogame)
        let selectElementId = evt.currentTarget.value;

        // Vider le contenu de div#review
        let divElement = document.getElementById("review");
        divElement.innerHTML = "";

        // Charger les données pour ce videogame
        let config = {

            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        //? MODIFICATION DE LA REQUETE SUITE A L'ETAPE 1 DU BONUS POUR PLUS DE PRÉCISIONS
        //? MODIFICATION APPORTEE À LA DB POUR QUE LES REVIEWS SOIENT LIÉES À 3 JEUX VIDEOS DIFFÉRENTS (ID 3 === VIDEOGAME_ID 1)
        // On déclenche la requête HTTP via Ajax
        // let promise = fetch(app.apiRootUrl + "/reviews", config);

        // On déclenche la requête HTTP via Ajax
        let promise = fetch(app.apiRootUrl + "/videogames/" + selectElementId + "/reviews", config);

        promise.then(
            function (response) {
                
                if (response.status === 200) {

                    let jsonPromise = response.json();

                    jsonPromise.then(
                        function (jsonResponse) {

                            // console.log(jsonResponse);

                            //? MODIFICATION SUITE A L'ETAPE 1 DU BONUS POUR PLUS DE PRÉCISIONS
                            //? MODIFICATION APPORTEE À LA DB POUR QUE LES REVIEWS SOIENT LIÉES À 3 JEUX VIDEOS DIFFÉRENTS (ID 3 === VIDEOGAME_ID 1)
                            // let i = selectElementId - 1;
                            let i = 0;

                            // Dupliquer la template #reviewTemplate et personnaliser son contenu avec les données

                            // On récupère le template
                            let template = document.querySelector("#reviewTemplate");
                            // On clone le contenu du template en un nouvel élément
                            let newTaskFromTemplate = template.content.cloneNode(true);

                            // Je change les différentes valeurs de mon nouvel élément
                            newTaskFromTemplate.querySelector(".reviewAuthor").textContent = jsonResponse[i].author;
                            newTaskFromTemplate.querySelector(".reviewVideogame").textContent = jsonResponse[i].title;
                            newTaskFromTemplate.querySelector(".reviewEditor").textContent = jsonResponse[i].videogame.editor;
                            newTaskFromTemplate.querySelector(".reviewPlatform").textContent = jsonResponse[i].platform.name;
                            newTaskFromTemplate.querySelector(".reviewText").textContent = jsonResponse[i].text;
                            newTaskFromTemplate.querySelector(".reviewDisplay").textContent = jsonResponse[i].display_note;
                            newTaskFromTemplate.querySelector(".reviewGameplay").textContent = jsonResponse[i].gameplay_note;
                            newTaskFromTemplate.querySelector(".reviewScenario").textContent = jsonResponse[i].scenario_note;
                            newTaskFromTemplate.querySelector(".reviewLifetime").textContent = jsonResponse[i].lifetime_note;
                            newTaskFromTemplate.querySelector(".reviewPublication").textContent = jsonResponse[i].publication_date;

                            // Ajout dans le DOM

                            let divElement = document.getElementById("review");
                            divElement.prepend(newTaskFromTemplate);
                        }
                    )
                }
            }
        )
    },
    handleClickToAddVideogame: function (evt) {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');
    },
    loadVideoGames: function () {
        // Charger toutes les données des videogames
        let config = {

            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // On déclenche la requête HTTP via Ajax
        let promise = fetch(app.apiRootUrl + "/videogames", config);

        promise.then(
            function (response) {

                if (response.status === 200) {

                    let jsonPromise = response.json();

                    jsonPromise.then(
                        function (jsonResponse) {

                            // console.log(jsonResponse);

                            let selectElement = document.getElementById("videogameId");

                            for (i = 0; i < jsonResponse.length; i++) {

                                // Ajouter une balise <option> par videogame
                                optionItem = document.createElement('option');
                                optionItem.textContent = jsonResponse[i].name;
                                optionItem.setAttribute( "value", jsonResponse[i].id );
                                selectElement.appendChild(optionItem);
                            }
                        }
                    )
                }   
            }
        )
    },

    handleFormSubmit: function (evt) 
    {
        // On évite le comportement par défaut du navigateur
        evt.preventDefault();

        // Récupération du formulaire
        let formElement = evt.currentTarget;

        // Récupération des valeurs des input form (Titre du jeu vidéo):
        let videogameNewNameElement = formElement.querySelector("#inputName");
        let videogameNewName = videogameNewNameElement.value;

        // Récupération des valeurs des input form (Editeur du jeu vidéo):
        let videogameNewEditorElement = formElement.querySelector("#inputEditor");
        let videogameNewEditor = videogameNewEditorElement.value;

        const data = {

            name: videogameNewName,
            editor: videogameNewEditor,
            status: 1,
        };
    
        const httpHeaders = new Headers();
        httpHeaders.append("Content-Type", "application/json");
    
        const fetchOptions = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: httpHeaders,
        body: JSON.stringify(data)
        };
    
        fetch(app.apiRootUrl + "/videogames", fetchOptions) 
    
        .then(
            function (response) {
            // Si l'API nous réponds on affiche un message de succès (code 201 Created)
                if (response.status === 201) {

                    alert('Le Jeu Vidéo a bien été créé !');

                    let jsonPromise = response.json();

                    jsonPromise.then(
                        function (jsonResponse) {

                            // console.log(jsonResponse);

                            $('#addVideogameModal').modal('hide');

                            // Réinitialisation des valeurs des input form (Titre du jeu vidéo):
                            let videogameNewNameElement = formElement.querySelector("#inputName");
                            videogameNewNameElement.value = "";

                            // Réinitialisation des valeurs des input form (Editeur du jeu vidéo):
                            let videogameNewEditorElement = formElement.querySelector("#inputEditor");
                            videogameNewEditorElement.value = "";

                            let config = {

                                method: 'GET',
                                mode: 'cors',
                                cache: 'no-cache'
                            };
                    
                            // On déclenche la requête HTTP via Ajax
                            let promise = fetch(app.apiRootUrl + "/videogames/" + jsonResponse.id, config);

                            let selectElement = document.getElementById("videogameId");
                      
                            // Ajouter une balise <option> pour le videogame
                            optionItem = document.createElement('option');
                            optionItem.textContent = jsonResponse.name;
                            optionItem.setAttribute( "value", jsonResponse.id );
                            selectElement.appendChild(optionItem);

                        }
                    )

                } else // Sinon, on affiche un message d'échec
                {
                    alert("La création a échoué !");

                }
            }
        )   
    },
};

document.addEventListener('DOMContentLoaded', app.init);