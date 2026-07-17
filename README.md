# Space Tracker API

A RESTful API for tracking galaxies, the stars within them, and the planets that orbit those stars. Built for the Advanced Server-side Languages course (WDV442).

## Data Model

Three resources, plus a join table for the many-to-many relationship between Stars and Planets:

```
Galaxy (1) ──< (many) Star (many) ──< StarsPlanets >── (many) Planets
```

- A **Galaxy** has many **Stars** (`galaxyId` FK on `Stars`)
- A **Star** belongs to one **Galaxy**, and belongs to many **Planets** (via `StarsPlanets`)
- A **Planet** belongs to many **Stars** (via `StarsPlanets`) — e.g. a planet orbiting a binary star system

## Getting Started

### Run with Docker (recommended)

```bash
docker-compose up
```

This starts two services:

- `wdv442-mysql` — MySQL server, exposes database `wdv442_space_tracker`
- `wdv442-node` — installs dependencies and runs `npm run watch`, mapped to `localhost:3000`

### Run locally

Requires a MySQL instance reachable with the credentials in `config/config.json`.

```bash
npm install
npx sequelize-cli db:migrate   # apply schema migrations
npm run watch                   # starts the app with nodemon on :3000
```

> Note: `index.js` hardcodes `app.listen(3000)` — there's no `PORT` env override.

## API Reference

Base URL: `http://localhost:3000`

Every resource (`/galaxies`, `/stars`, `/planets`, `/starsplanets`) has the same RESTful actions:

| Method | Path             | Action   | Success Status                     |
| ------ | ---------------- | -------- | ---------------------------------- |
| GET    | `/:resource`     | List all | 200                                |
| GET    | `/:resource/:id` | Get one  | 200                                |
| POST   | `/:resource`     | Create   | 201 (redirect to `/:resource/:id`) |
| PUT    | `/:resource/:id` | Update   | 202                                |
| DELETE | `/:resource/:id` | Delete   | 200                                |

### Galaxies

```bash
curl http://localhost:3000/galaxies

curl http://localhost:3000/galaxies/1

curl -X POST http://localhost:3000/galaxies -H "Content-Type: application/json" -d '{"name": "Milky Way", "size": 100000, "description": "Our home galaxy"}'

curl -X PUT http://localhost:3000/galaxies/1 -H "Content-Type: application/json" -d '{"name": "Andromeda", "size": 220000, "description": "Nearest major galaxy"}'

curl -X DELETE http://localhost:3000/galaxies/1
```

`GET /galaxies/:id` additionally embeds the galaxy's stars:

```json
{
	"id": 1,
	"name": "Milky Way",
	"size": 100000,
	"description": "Our home galaxy",
	"stars": [{ "id": 1, "name": "Sirius", "size": 12, "galaxyId": 1 }]
}
```

### Stars

```bash
curl http://localhost:3000/stars

curl http://localhost:3000/stars/1

curl -X POST http://localhost:3000/stars -H "Content-Type: application/json" -d '{"name": "Sirius", "size": 12, "description": "Brightest star in the night sky", "galaxyId": 1}'

curl -X PUT http://localhost:3000/stars/1 -H "Content-Type: application/json" -d '{"name": "Betelgeuse", "size": 900, "description": "Red supergiant"}'

curl -X DELETE http://localhost:3000/stars/1
```

`GET /stars/:id` embeds the star's planets.

### Planets

```bash
curl http://localhost:3000/planets

curl http://localhost:3000/planets/1

curl -X POST http://localhost:3000/planets -H "Content-Type: application/json" -d '{"name": "Earth", "size": 1, "description": "Third planet from the Sun"}'

curl -X PUT http://localhost:3000/planets/1 -H "Content-Type: application/json" -d '{"name": "Mars", "size": 2, "description": "The Red Planet"}'

curl -X DELETE http://localhost:3000/planets/1
```

`GET /planets/:id` embeds the planet's stars.

### StarsPlanets

Links a planet to a star (many-to-many join table):

```bash
curl -X POST http://localhost:3000/starsplanets \
  -H "Content-Type: application/json" \
  -d '{"starId": 1, "planetId": 1}'
```
