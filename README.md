# API DBSDER

L'API DBSDER est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet aux applications composant Judilibre d'interagir avec la base de données DBSDER. 
Elle offre la possibilité de stocker, lire et mettre à jour des décisions de justice pour les Tribunaux Judiciaires, Cour d'Appel et Cour de Cassation. 

### Pré-requis
- Installer [nvm](https://github.com/nvm-sh/nvm) afin d'avoir la version utilisée pour cette application et lancer la commande :
```bash
nvm install
```

### Installation 

Pour installer les packages nécessaires au bon fonctionnement de l'application, ouvrir un terminal et entrer la commande suivante : 
```bash
npm install
```  
N'oubliez pas d'installer **husky** pour obtenir les hooks de commit/push
```bash
npx husky install
```

### Démarrer l'application

Pour démarrer l'application, écrire dans un terminal : 

 ```bash
npm run start:dev # for the dev environment
 ```

### Tests

Pour lancer les tests, écrire dans un terminal : 

 ```bash
npm run test
 ```

### Variables d'environnement : 

Créer un fichier `.env` à la racine du dossier avec les variables suivantes :

```.env
## Clés API des consommateurs de l'API DBSDER
LABEL_API_KEY=some_uuid
```

### Démarrer l'application via Docker

Démarrer l'application nécessite au préalable d'initaliser les fichiers de variables d'environnement. 

Pour lancer l'ensemble de DBSDER-api avec Docker, écrire dans un terminal : 

```bash
npm run docker:build
npm run docker:start
```

Pour lancer l'API en phase de développement et afin de disposer d'une mise à jour à chaud du serveur à chaque changement, écrire dans un terminal : 
```bash
npm run docker:build
npm run docker:start:db
npm run start:dev
```

### Documentation complémentaire 

Le dossier `/documentation` contient : 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)
