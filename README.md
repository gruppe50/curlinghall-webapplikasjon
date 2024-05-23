# Rammeverk for å eksperimentere med driftsinnstillinger for å optimalisere stømforbruk

## Generelt

Dette er et bachelorprosjekt av tre studenter ved OsloMet våren 2024.

Fra vår oppdragsgiver har vi fått i oppgave å modernisere styresystemet i en curlinghall. Gjennom prosjektet forsøker vi å gi driftsansvarlig i curlinghallen bedre redskaper for å optimalisere strømbruken.

Dette repoet inneholder kildekoden som er skrevet i forbindelse med prosjektet.

## Om løsningen
Vi har laget en webapplikasjom som gir de ansatte i curlinghallen mulighet til å sette opp eksperimenter av styresystemet. Et eksperiment består av flere tester med instruksjoner til styresystemet som er satt opp til bestemte tider. Når disse testene er ferdig vil det genereres en rapport med data som istemperatur og strømkostnader i eksperimentperioden. Denne informasjonen kan brukes til å optimalisere strømforbruket i fremtiden.

## Om systemet
Webapplikasjonen består av frontend laget med next.js og en backend laget med Spring Boot. Det er en implementasjon av en OPC UA server plassert i hallen som henter verdier ut av PLS og gjør dem tilgjengelig over internett.
I tillegg settes det opp en tidsserie database som samler inn verdier fra hallen. 

## Oppsett av systemet
Frontend som ligger i mappen frontend og Spring-applikasjonen i mappen MiniMes må kjøres.

opcua_server.py i mappen raspberrypi kjører som en service på en Raspberry PI satt opp i curlinghallen. På Raspberry PI-en er det også satt opp en database med mariadb for midlertidig lagring av instruksjoner til PLS.

Tidsserie database er laget med InfluxDB cloud, hvor det er installert en OPC UA telegraf plugin som samler inn data fra hallen. 

## Miljøvariabler
Systemet er avhengig av flere miljøvariabler. Disse må settes for at systemet skal fungere.

### Der Spring-applikasjonen kjører må følgende miljøvariabler settes:
INFLUXDB_CLOUD_URL: Url til InfluxDB cloud
INFLUXDB_TOKEN: Token fra InfluxDB
INFLUX_DB_ORG: Organisasjonsnavn i InfluxDB
INFLUXDB_BUCKET: Bucket i InfluxDB

OPCUA_ENDPOINT: Endepunkt til opc ua server
OPCUA_USERNAME: Brukernavn til opc ua server
OPCUA_PASSWORD: Passord til opc ua server

PowerUsageTOKEN: Autorisasjons token for Kionas Energinet API

### På Raspberry Pi må følgende miljøvariabler settes:
INFLUXDB_TOKEN: Token fra InfluxDB

OPCUA_ENDPOINT: Endepunkt til opc ua server
OPCUA_USERNAME: Brukernavn til opc ua server
OPCUA_PASSWORD: Passord til opc ua server

OPCUA_DB_HOST: Ip til midlertidig database
OPCUA_DB_USER: Brukernavn til midlertidig database
OPCUA_DB_PASSWORD: Passord til midlertidig dataabse
