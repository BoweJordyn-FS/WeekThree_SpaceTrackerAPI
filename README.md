# Space Tracker

A web app for tracking galaxies, the stars within them, and the planets that orbit those stars, manageable through both an HTML5 browser UI and a JSON API. Built for the Advanced Server-side Languages course (WDV442).

## Data Model

Three resources, plus a join table for the many-to-many relationship between Stars and Planets:

```
Galaxy (1) ──< (many) Star (many) ──< StarsPlanets >── (many) Planets
```

- A **Galaxy** has many **Stars** (`galaxyId` FK on `Stars`)
- A **Star** belongs to one **Galaxy**, and belongs to many **Planets** (via `StarsPlanets`)
- A **Planet** belongs to many **Stars** (via `StarsPlanets`) — e.g. a planet orbiting a binary star system

Galaxies, Stars, and Planets each have an `image` column holding the path to an uploaded photo (e.g. `/uploads/planets/3.png`), or `null` if none has been uploaded yet.

## Getting Started

### Run with Docker (recommended)

```bash
docker compose up
```

This starts two services:

- `wdv442-mysql` — MySQL server, exposes database `wdv442_space_tracker`
- `wdv442-node` — installs dependencies and runs `npm run watch`, mapped to `localhost:3000`

### Run locally

Requires a MySQL instance reachable with the credentials in `config/config.json`.

```bash
npm install
npx sequelize-cli db:migrate   # apply schema migrations
npm run watch                   # starts the Node server and the Tailwind CSS watcher together
```

> Note: `index.js` hardcodes `app.listen(3000)` — there's no `PORT` env override.

## Web UI

Every resource has server-rendered Twig pages, styled with Tailwind CSS:

| Path                  | Page        |
| --------------------- | ----------- |
| `/:resource`          | List all    |
| `/:resource/new`      | Create form |
| `/:resource/:id`      | Detail view |
| `/:resource/:id/edit` | Edit form   |

Create/edit forms upload images via `enctype="multipart/form-data"` with a file input named `image`. Uploaded files are saved under `public/uploads/<resource>/` and served statically.

Since plain HTML forms and links can only send `GET` and `POST`, update and delete use the HTML5-specific routes instead of `PUT`/`DELETE`:

| Action | JSON API route          | HTML route                  |
| ------ | ----------------------- | --------------------------- |
| Update | `PUT /:resource/:id`    | `POST /:resource/:id`       |
| Delete | `DELETE /:resource/:id` | `GET /:resource/:id/delete` |

## API Reference

Base URL: `http://localhost:3000`

Every resource (`/galaxies`, `/stars`, `/planets`, `/starsplanets`) has the same RESTful actions:

| Method | Path             | Action   | Success Status                   |
| ------ | ---------------- | -------- | -------------------------------- |
| GET    | `/:resource`     | List all | 200                              |
| GET    | `/:resource/:id` | Get one  | 200                              |
| POST   | `/:resource`     | Create   | 201 (JSON) / 303 redirect (HTML) |
| PUT    | `/:resource/:id` | Update   | 200 (JSON) / 303 redirect (HTML) |
| DELETE | `/:resource/:id` | Delete   | 200 (JSON) / 303 redirect (HTML) |

Missing records return `404`; invalid input (e.g. no `name`) returns `400`; unhandled errors return `500`. All of these come back as JSON or HTML depending on the request's `Content-Type`, same as above.

### Galaxies

```bash
curl -H "Content-Type: application/json" http://localhost:3000/galaxies

curl -H "Content-Type: application/json" http://localhost:3000/galaxies/1

curl -X POST http://localhost:3000/galaxies -H "Content-Type: application/json" -d '{"name": "Milky Way", "size": 100000, "description": "Our home galaxy"}'

curl -X PUT http://localhost:3000/galaxies/1 -H "Content-Type: application/json" -d '{"name": "Andromeda", "size": 220000, "description": "Nearest major galaxy"}'

curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/galaxies/1
```

`GET /galaxies/:id` additionally embeds the galaxy's stars:

```json
{
	"id": 1,
	"name": "Milky Way",
	"size": 100000,
	"description": "Our home galaxy",
	"image": null,
	"stars": [{ "id": 1, "name": "Sirius", "size": 12, "galaxyId": 1 }]
}
```

### Stars

```bash
curl -H "Content-Type: application/json" http://localhost:3000/stars

curl -H "Content-Type: application/json" http://localhost:3000/stars/1

curl -X POST http://localhost:3000/stars -H "Content-Type: application/json" -d '{"name": "Sirius", "size": 12, "description": "Brightest star in the night sky", "galaxyId": 1}'

curl -X PUT http://localhost:3000/stars/1 -H "Content-Type: application/json" -d '{"name": "Betelgeuse", "size": 900, "description": "Red supergiant"}'

curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/stars/1
```

`GET /stars/:id` embeds the star's planets.

### Planets

```bash
curl -H "Content-Type: application/json" http://localhost:3000/planets

curl -H "Content-Type: application/json" http://localhost:3000/planets/1

curl -X POST http://localhost:3000/planets -H "Content-Type: application/json" -d '{"name": "Earth", "size": 1, "description": "Third planet from the Sun"}'

curl -X PUT http://localhost:3000/planets/1 -H "Content-Type: application/json" -d '{"name": "Mars", "size": 2, "description": "The Red Planet"}'

curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/planets/1
```

`GET /planets/:id` embeds the planet's stars.

### StarsPlanets

Links a planet to a star (many-to-many join table):

```bash
curl -X POST http://localhost:3000/starsplanets \
  -H "Content-Type: application/json" \
  -d '{"starId": 1, "planetId": 1}'
```
