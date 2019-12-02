# Abbreviation App

Web app that crowd sources understanding of abbreviations used in medical context.

## Requirements

Download and install the docker community edition.

## Getting started

Bring up the database first:
```
docker-compose -f docker-compose.yml up -d --build postgres
```

Bring up the backend (API) and front-end (APP):
```
docker-compose -f docker-compose.yml up -d --build api app
```

Open up the browser to [localhost:4002](http://localhost:4002/)

View logs:
```
docker-compose -f docker-compose.yml logs --follow api app postgres
```

Open postgres database:
```
docker-compose -f docker-compose.yml exec postgres psql -U project-name project-name
```

## Import abbreviation data

Assumes data is provided in the following format:
1. An expansions text file with each expansion on a new line:
```
...
dipole moment
dexmedetomidine
detarium microcarpum
dietary modification
...
```
2. A text file of sentences with the abbreviation marked by the `<...>`:
```
...
This is an exmaple sentence that uses the abbreviation <dm> to illustrate an example
...
```

To import the data, call the `import-data.js` script with the abbreviation as the first parameter, then the path to the expansions text file, and finall the path to the sentences text file as follows:
```bash
node import-data.js dm ./path-to-expansions.txt ./path-to-sentences.txt
```
