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
Vous pouvez installer **husky** pour obtenir les hooks de commit/push
```bash
npx husky install
```

### Démarrer l'application

Pour démarrer l'application:

1. Compiler l'image docker:
 ```bash
npm run docker:build
 ```
2. Lancer l'image docker mongodb:
 ```bash
npm run docker:start:db
 ```
3. Configurer les variables d'environnement:
    - Dupliquer le fichier `docker.env.example` et le rennomer `docker.env`, adapter les variables d'environnement si besoin
    - Dupliquer le fichier `.env.example` et le rennomer `.env`, adapter les variables d'environnement si besoin

4. Lancer l'API:
    - Pour lancer l'API avec docker :
        ```bash
        npm run docker:start
        ```
    - Pour lancer l'API en phase de développement et afin de disposer d'une mise à jour à chaud du serveur à chaque changement:
         ```bash
        npm run docker:start:db
        npm run start:dev
        ```

### Tests

Pour lancer les tests, écrire dans un terminal : 

 ```bash
npm run test
 ```

### Postman 

Le dossier `/documentation` contient : 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)

### Swagger 
Un Swagger est disponible à l'url `/doc` ou via `/doc-json`
il vous suffit d'entrer les variables que vous avez en `DOC_LOGIN` et `DOC_PASSWORD`