# Project Archive

Project Archive is a static single-page web app for browsing a curated set of capstone and hackathon problem statements. It currently catalogs 587 statements across 5 tracks and lets you search, filter, and inspect each entry in a detail modal.

### Link - https://capstone-hackathon-track-explorer.vercel.app/

## What it does

- Search across titles, descriptions, supervisors, areas, and statement IDs.
- Filter the catalog by track: AI / ML, Data Science & Big Data, IoT / Embedded Systems, Cloud Computing, and DevOps.
- Open any card to view the full record, including description, area, nature, source, supervisor, sitting place, and statement ID.
- Show live counts for the full dataset and the active filter.

## Project Structure

- `index.html` contains the page layout and modal markup.
- `style.css` defines the full visual design and responsive layout.
- `script.js` handles filtering, search, card rendering, and modal behavior.
- `data.js` contains the project dataset used by the app.

## How to Run

This project does not require a build step.

1. Open `index.html` directly in a browser, or
2. Serve the folder with any local static server if you prefer browser reload support.

## Data Notes

The app reads from the `PROJECTS` array in `data.js`. If you update the dataset, the UI will reflect the new entries automatically on reload.

## Purpose

This repository is useful as a searchable archive and as a lightweight front end for reviewing project ideas grouped by technical track.
