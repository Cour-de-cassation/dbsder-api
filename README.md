# API DBSDER

L'API DBSDER est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet aux applications composant Judilibre d'interagir avec la base de données DBSDER. 
Elle offre la possibilité de stocker, lire et mettre à jour des décisions de justice pour les Tribunaux Judiciaires, Cour d'Appel et Cour de Cassation. 

### Pré-requis
- Installer [nvm](https://github.com/nvm-sh/nvm) afin d'avoir la version utilisée pour cette application et lancer la commande :
```bash
nvm install
```
- Puis lancer la commande :
```bash
 nvm use
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

Pour démarrer l'application:

1. Compiler l'image docker mongodb:
 ```bash
npm run docker:build
 ```
2. Lancer l'image docker mongodb:
 ```bash
npm run docker:start:db
 ```
3. Créer un .env en copiant le docker.env et modifier la variable MONGO_DB_URL:
```text
MONGO_DB_URL=mongodb://localhost:55433
```
4. Lancer l'application
 ```bash
npm run start:dev
 ```

### Tests

Pour lancer les tests, écrire dans un terminal : 

 ```bash
npm run test
 ```

### Variables d'environnement en local 

Créer un fichier `.env` à la racine du dossier avec les variables suivantes :

```.env
### Pour désactiver la coloration des logs
NO_COLOR=true 

## Clés API des consommateurs de l'API DBSDER
LABEL_API_KEY=some_uuid
NORMALIZATION_API_KEY=some_uuid
OPENSDER_API_KEY=some_uuid
OPS_API_KEY=some_uuid
PUBLICATION_API_KEY=some_uuid
ATTACHMENTS_API_KEY=some_uuid
INDEX_API_KEY=some_uuid

## Identifiants Swagger
DOC_LOGIN=login
DOC_PASSWORD=pwd

## Mongo URL
MONGO_DB_URL=mongodb://<URL>:<PORT>/<DB_NAME>
```

Un exemple de fichier `.env` est nommé `.env.example`


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

### Swagger 
Un Swagger est disponible à l'url `/doc` ou via `/doc-json`
il vous suffit d'entrer les variables que vous avez en `DOC_LOGIN` et `DOC_PASSWORD`