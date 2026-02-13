# CLAUDE.md - Project Instructions

## Project Overview

**Visitas Angelim** — School Visit Scheduling and CRM System for a Waldorf school (Escola Angelim).
A web app with three main components:
1. **Public Parent Portal** (mobile-first) — visit scheduling, school info, chat
2. **Admin Dashboard** (desktop-first) — manage visits, availability, leads, sales funnel, chat
3. **Backend API** — Cloud Functions on Google Cloud

## Tech Stack

- **Frontend:** React with Ant Design (antd)
- **Backend:** Google Cloud Functions
- **Database:** Firestore
- **Auth:** Firebase Authentication
- **Platform:** Google Cloud
- **Language:** TypeScript (preferred for both frontend and backend)

## Key Domain Concepts

- **Units:** Jardim (early childhood) and Fundamental (elementary)
- **Availability Slots:** time windows per unit when visits can be booked
- **Leads:** prospective parents tracked through a sales funnel (New Lead → Contacted → Visit Scheduled → Enrolled → Lost)
- **Visits:** scheduled school tours linked to slots and leads

## Design Guidelines

- **Colors:** Warm, natural, earthy palette (greens, oranges, soft yellows) — Waldorf aesthetic
- **Heading font:** Baar Antropos (Waldorf-style font)
- **Body font:** Readable serif or sans-serif
- **Public portal:** Mobile-first, responsive
- **Admin dashboard:** Desktop-first, sidebar navigation, tables and calendar views
- **Brand reference:** https://www.escolaangelim.com.br

## Project Structure

Refer to [docs/visitasAngelimFSD.md](docs/visitasAngelimFSD.md) for the full Functional Specification Document including data models, API endpoints, and requirements.

## Conventions

- Write code in **Brazilian Portuguese** for user-facing strings (UI labels, messages, etc.)
- Use **English** for code identifiers (variable names, function names, comments)
- Follow Ant Design component patterns and conventions
- Keep the public portal accessible and lightweight
- Comply with LGPD for personal data handling
