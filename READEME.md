INITIALISATION DU PROJET

1- Je vérifie ma version de node
node -v ou node --version
Node.js v22.9.0

Pour créerdossier projet et naviguer dans le bon répertoir de travail
mkdir votre-projet
cd votre-projet

2- j'initialise le projet node
npm init -y 
Je crée un fichier package.json
et j'installe les dépendances
npm install proj4

Je veux créer 2 noveaux dossier dansmon projet
mkdir src data

3- je test et je crée mon point d'entrée app.js
console.log("Bonjour, Node.js!");
puis node app.js
cela s'affiche bien dans ma console de mon terminal vscode
touch src/convert.js src/app.js

4-je créele script pourla conversion nomé convert.js
Résultat un tableau json

5- je test nodeconvert.js
Résultat un tableau json:

[
  {
    "Hole_ID": "RKD002",
    "X": 548314.8,
    "Y": 7476791.8,
    "RL_AHD": 467.4,
    "Depth": 45.2,
    "lon": 117.470807,
    "lat": -22.81574
  },
  {
    "Hole_ID": "RKD004",
    "X": 548095.6,
    "Y": 7476396,
    "RL_AHD": 462.3,
    "Depth": 53,
    "lon": 117.468683,
    "lat": -22.819322
  },
  {
    "Hole_ID": "RKD015",
    "X": 547905,
    "Y": 7476800,
    "RL_AHD": 470,
    "Depth": 41,
    "lon": 117.466813,
    "lat": -22.815678
  },
  {
    "Hole_ID": "RKD005",
    "X": 547505.9,
    "Y": 7475596,
    "RL_AHD": 461.6,
    "Depth": 42.4,
    "lon": 117.462961,
    "lat": -22.826565
  },
  {
    "Hole_ID": "RKD006",
    "X": 547698.1,
    "Y": 7475588.5,
    "RL_AHD": 458.6,
    "Depth": 42.5,
    "lon": 117.464834,
    "lat": -22.826628
  },
  {
    "Hole_ID": "RKD007",
    "X": 547901.7,
    "Y": 7475595.9,
    "RL_AHD": 456.8,
    "Depth": 48.5,
    "lon": 117.466818,
    "lat": -22.826555
  },
  {
    "Hole_ID": "RKD008",
    "X": 548005.2,
    "Y": 7475616.9,
    "RL_AHD": 455.9,
    "Depth": 46.9,
    "lon": 117.467826,
    "lat": -22.826362
  },
  {
    "Hole_ID": "RKD009",
    "X": 548192.1,
    "Y": 7475592.9,
    "RL_AHD": 458.6,
    "Depth": 44,
    "lon": 117.469648,
    "lat": -22.826574
  },
  {
    "Hole_ID": "RKD013",
    "X": 548105,
    "Y": 7474000,
    "RL_AHD": 454,
    "Depth": 30,
    "lon": 117.468849,
    "lat": -22.840966
  },
  {
    "Hole_ID": "RKD003",
    "X": 547999.1,
    "Y": 7476396.3,
    "RL_AHD": 462.9,
    "Depth": 48.56,
    "lon": 117.467743,
    "lat": -22.819322
  }
]

6- J'installe la binliothèque CSV pour pouvoir lire des données depuis un fichier CSV
npm install csv-parse
Cela modifie mon fichier .package-lock.json situé dansle dossier node_modules.

7- Maintenant je peut modifier mon fichier convert.js

8-je renome le fichier CSV fourni coller.csv en input.csv
Je test dans ma console node convert.js
Résultat tableau json complété avec  les données du fichier CSV

Ligne de commande unique pour installer la bibliothèque CSV et les dépendances pour l'API avec Express
npm install proj4 csv-parse express body-parser

___________________________________________________________________________________

9- Pour le BONUS 2 je veux creer une API avec EXPRESS

    1/ Je dois installer les dépendances nécessaires
        npm install express body-parser
        mon dissier node_modules se remplis avec beaucoup de nouveau dossier et notament un dossier bin

    2/ Je modififie mon fichier app.js jusque la vide (juste mon consol.log)
        je test mon app.js => début des erreurs

Je modifie mon code:
convert.js
je m'assure d'avoir les bonnes routes
ligne 5 et 24

app.js
je  m'assure que mon point d'entée app.js est bien initialisé comme une API EXPRESS

Je met à jour mes dépendances: npm install

je test convert.js > j'exécute node src/convert.js
Résultat dans ma console = tableau json

je test app.js > j'exécute node src/app.js
Cela lance le serveur  et je peux accéder à l'API via mon navigateur web
http://localhost:3000/convert

Je viens de comprendre mon erreur je ne renvoie rien au navigateur j'ai oublié de créer un index.html comme pour n'importe quel projet

Pour assurer une bonne maintenablité du code:
je créeun dossier public à la racine du projet
puis dedans:
- index.html
- style.css
- script.js

///////////////////////////////////////////////////////////////////////////////////////////////////////

node src/app.js

Serveur démarré sur http://localhost:3000

-----------------------------------------------------------

VICTOIRE CELA FONCTIONNE

MAINTENANT DESIGN à FAIRE.... et à afficher le résultat dans navigateur

Pour lancer mon localhost je peux utiliser
npm start



UTIL------------------------------------------------
Documentation utile

    Documentation officielle de Node.js : https://nodejs.org/fr/docs/

    Guide de démarrage VS Code avec Node.js : https://code.visualstudio.com/docs/nodejs/nodejs-tutorial
