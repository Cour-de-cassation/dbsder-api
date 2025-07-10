# API DBSDER

L'API DBSDER est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet aux applications composant Judilibre d'interagir avec la base de données DBSDER. Cette base de donnée contient nottament les décisions de justice collectée auprès des différentes juridictions.

## Pré-requis

La version de Node utilisé par ce projet est indiquée dans le fichier [.nvmrc](.nvmrc).
Vous pouvez installer [nvm](https://github.com/nvm-sh/nvm) afin d'avoir la version utilisée pour cette application et lancer la commande :

```bash
nvm install
```

## Installation

```bash
npm install
```

## Utilisation de l'application

Configurer les variables d'environnement:

- Dupliquer le fichier `docker.env.example` et le rennomer `docker.env`, adapter les variables d'environnement si besoin
- Dupliquer le fichier `.env.example` et le rennomer `.env`, adapter les variables d'environnement si besoin

### Avec Docker

1. Construire l'image docker:

```bash
npm run docker:build
```

2. Lancer la base de donnée et l'application

```bash
npm run docker:start
```

### Sans Docker

Vous pouvez également lancer l'application sans utiliser docker avec la commande suivante :

```bash
npm run start:watch
```

Dans ce cas la, l'application a besoin d'une base de donnée mongo, vous pouvez en lancer une via la commande :

```bash
npm run docker:start:db
```

### Tests

```bash
npm run test
```

## Seeds

Pour peupler votre base de donnée vous pouvez utiliser les scripts présents dans le dossier a la racine du projet. Ces scripts utilisent la variable d'environement `MONGO_DB_URL` que vous devez définir dans le fichier `.env`

Peupler la base de donnée :

```bash
node seeds/load.js
```

Vider la base de donnée :

```bash
node seeds/clean.js
```

Mettre a jour les dates avec des dates récentes :

```bash
node seeds/refreshDate.js
```

Sauvegarder les données présente dans la base de donnée dans les fichiers de seeds :

```bash
node seeds/save.js
```
