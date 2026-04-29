# DBSDER-API

dbsder-api est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet aux applications composant Judilibre d'interagir avec la base de données DBSDER. Cette base de données contient notamment les décisions de justice collectées auprès des différentes juridictions.

Ce repo contient aussi les types representant les objets stockées dans la base de donnée. Ces types sont définis par des schémas [zod](https://www.npmjs.com/package/zod). Ces types (dbsder-api-types) sont publiés sur [npmjs](https://www.npmjs.com/package/dbsder-api-types) afin de pouvoir être utilisés dans les projets qui consomment cette API.

[![npm](https://img.shields.io/npm/v/dbsder-api-types)](https://www.npmjs.com/package/dbsder-api-types)

## Dépendances

L'application nécessite node ainsi qu'une base de donnée mongo, n'hésitez pas à jeter un coup d'oeil à [juridependencies](https://github.com/Cour-de-cassation/juridependencies) qui contient nottament des données permettant de peupler votre base de donnée.

La version de Node utilisée par ce projet est indiquée dans le fichier [.nvmrc](.nvmrc).

## Installation

```bash
npm install
```

## Utilisation de l'application

Configurer les variables d'environnement :

- Dupliquer le fichier `.env.example` et le renommer `.env`, adapter les variables d'environnement si besoin

### Avec Docker

```bash
npm run start:docker
```

### Sans Docker

Vous pouvez également lancer l'application sans utiliser docker avec la commande suivante :

```bash
npm run start:watch
```

### Tests

```bash
npm run test
```

## Librairie de types

### Publication automatique des types sur npmjs

Le package est publié automatiquement sur npmjs lorsqu'un tag est ajouté. Le tag doit respecter le format [0-9]+.[0-9]+.[0-9]+. Pour clarifier le suivi il est préconisé d'ajouter le tag via une release github une fois la branche mergée sur master.

### Utilisation des types dans un autre projet

```bash
npm install dbsder-api-types
```

### Utilisation de la librairie en local

Dans ce repo :

```bash
npm run types:link
```

Dans le repo utilisant les types :

```bash
npm link dbsder-api-types
```

⚠️ Attention : cette méthode ne fonctionne que si les 2 projets utilisent la même version de node car `npm link` crée un lien symbolique vers le dossier global de npm, qui est propre à chaque version de Node

Sinon vous pouvez également utiliser cette méthode :

Dans ce repo :

```bash
npm run types:build
```

Dans le projet qui utilise les types :

```bash
npm link PATH/TO/DBSDER-API/dist-types
```
