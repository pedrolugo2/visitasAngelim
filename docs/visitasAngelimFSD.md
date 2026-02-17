# School Visit Scheduling and CRM System Functional Specification Document

**Version:** 1.0
**Date:** 2026-02-13
**Status:** Draft

## 1. Overview

### 1.1 Purpose

This document specifies the functional requirements for a web-based **School Visit Scheduling and CRM System** designed for private educational institutions, with a specific focus on the needs of a Waldorf school. The system aims to streamline the process of scheduling school visits for prospective parents, provide immediate support through an online chat, and offer a simplified Customer Relationship Management (CRM) and sales funnel for lead management to school administrators.

### 1.2 Scope

The project encompasses the development of a web application with three primary components:

*   **Public Parent Portal:** A mobile-first, public-facing web portal allowing parents to self-service schedule school visits, view school information, and interact with an online chat.
*   **Online Chat System:** An integrated chat functionality on the Public Parent Portal to answer basic questions and provide immediate support to prospective parents.
*   **Admin Management Dashboard:** A desktop-oriented, secure administrative interface for school staff to manage visit schedules, define availability slots for different units (Jardim and Fundamental), track leads, and manage a simplified sales funnel.
*   **Backend System:** A backend service to manage data, process scheduling requests, handle chat interactions, and manage user authentication for the admin dashboard.

### 1.3 Definitions

| Term | Definition |
| :--- | :--- |
| **Visit** | A scheduled appointment for prospective parents to tour the school and learn about its programs. |
| **Availability Slot** | A specific date and time range when a school unit (Jardim or Fundamental) is available for parent visits. |
| **Lead** | A prospective parent or family who has shown interest in the school, typically by scheduling a visit or interacting with the chat. |
| **CRM (Customer Relationship Management)** | A system designed to manage and analyze customer interactions and data throughout the customer lifecycle, with the goal of improving business relationships with customers, assisting in customer retention, and driving sales growth. In this context, it's simplified for lead tracking and management. |
| **Sales Funnel** | A visual representation of the journey a prospective parent takes from initial interest to enrollment, allowing administrators to track progress and identify bottlenecks. |
| **Jardim Unit** | Refers to the early childhood education unit (e.g., Kindergarten, Preschool). |
| **Fundamental Unit** | Refers to the elementary education unit (e.g., Primary School). |

## 2. System Architecture

### 2.1 Hardware

The system will be a web-based application accessible from any standard, modern web browser on both desktop and mobile devices. No specialized hardware is required for end-users or administrators.

### 2.2 Software Stack

The proposed software stack leverages modern, scalable, and maintainable technologies suitable for a web application. Given the requirements for a public portal, admin dashboard, and chat, a robust full-stack approach is recommended.

```
+------------------------------------+
|      Public Parent Portal          |
| (React with antd design system)    |
+------------------------------------+
|      Online Chat Interface         |
| (Integrated with Public Portal)    |
+------------------------------------+
|   Admin Management Dashboard       |
| (React with antd design system)    |
+------------------------------------+
|           Backend API              |
|      (cloud functions)             |
+------------------------------------+
|             Database               |
|           (Firestore)              |
+------------------------------------+
|         Authentication             |
|       Firebase auth                |
+------------------------------------+
|        Cloud Platform              |
|      ( Google Cloud)               |
+------------------------------------+
```

### 2.3 Development Environment
Architect should decide
## 3. Functional Requirements

### 3.1 Public Parent Portal (Mobile-First)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-PUB-01 | The portal shall allow prospective parents to view available school visit slots for both Jardim and Fundamental units. | Must |
| FR-PUB-02 | Parents shall be able to select a preferred date and time slot for a school visit. | Must |
| FR-PUB-03 | The system shall collect necessary parent and child information (e.g., name, contact, child's age/grade of interest) during the booking process. | Must |
| FR-PUB-04 | Upon successful booking, parents shall receive a confirmation email with visit details. | Must |
| FR-PUB-05 | The portal shall feature an integrated online chat interface for parents to ask basic questions. | Must |
| FR-PUB-06 | The design shall be mobile-first and fully responsive, ensuring a seamless experience on all device sizes. | Must |
| FR-PUB-07 | The visual identity (colors, fonts, imagery) shall align with the school's brand and Waldorf philosophy. | Must |

### 3.2 Online Chat System

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-CHAT-01 | The chat system shall provide automated responses to frequently asked questions (FAQs). | Must |
| FR-CHAT-02 | The chat system shall allow parents to submit questions that can be reviewed and answered by school staff if not covered by automated responses. | Should |
| FR-CHAT-03 | Chat interactions shall be logged and accessible via the Admin Management Dashboard. | Must |

### 3.3 Admin Management Dashboard (Desktop-Oriented)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-ADM-01 | The dashboard shall require secure user authentication (email and password) for access. | Must |
| FR-ADM-02 | Admins shall be able to view, edit, and cancel scheduled school visits. | Must |
| FR-ADM-03 | Admins shall be able to define and manage availability slots for school visits for both Jardim and Fundamental units. | Must |
| FR-ADM-04 | Admins shall be able to view a calendar-based overview of all scheduled visits and available slots. | Must |
| FR-ADM-05 | The dashboard shall provide a simplified CRM for lead management, allowing admins to track prospective parents. | Must |
| FR-ADM-06 | Admins shall be able to update the status of leads within a sales funnel (e.g., New Lead, Contacted, Visit Scheduled, Enrolled, Lost). | Must |
| FR-ADM-07 | Admins shall be able to add notes and update lead information (e.g., contact details, child's interests, communication history). | Must |
| FR-ADM-08 | The dashboard shall provide basic reporting on lead status and conversion rates. | Should |
| FR-ADM-09 | Admins shall be able to manage automated chat responses and review unanswered chat questions. | Must |
| FR-ADM-10 | The system shall provide a password reset functionality for admin users via email. | Must |
| FR-ADM-11 | The interface shall be designed for usability on desktop screens. | Must |
| FR-ADM-12 | Non-logged web page that teachers can register their availabity to guide visits so it can be used as slot freeing time from the administrative staff | Must |

### 3.4 Backend System

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-BCK-01 | The system shall securely manage authentication and authorization for admin users. | Must |
| FR-BCK-02 | The system shall provide APIs for all CRUD (Create, Read, Update, Delete) operations related to visits, availability slots, leads, and chat logs. | Must |
| FR-BCK-03 | All data must be stored securely in a database (e.g., PostgreSQL). | Must |
| FR-BCK-04 | The system shall send automated email confirmations and reminders for scheduled visits. | Must |
| FR-BCK-05 | The backend must ensure data consistency and integrity across all modules. | Must |
| FR-BCK-06 | The system shall serve all data required by the Public Parent Portal and Admin Dashboard in an efficient manner. | Must |
| FR-BCK-07 | The system shall integrate with a chat service (e.g., custom solution or third-party API) to handle real-time communication. | Must |

## 4. Interface Specifications

### 4.1 Suggested Data Model

**`admins` collection/table:**
*   **ID:** `uid` (from Authentication System)
*   **Fields:**
    *   `email`: (string) Admin's email address.
    *   `name`: (string) Admin's full name.
    *   `createdAt`: (timestamp) Account creation timestamp.

**`units` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `name`: (string) Name of the unit (e.g., "Jardim", "Fundamental").
    *   `description`: (string, optional) Description of the unit.

**`availability_slots` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `unitId`: (string) Reference to the `units` collection/table.
    *   `startTime`: (timestamp) Start time of the availability slot.
    *   `endTime`: (timestamp) End time of the availability slot.
    *   `capacity`: (number) Maximum number of visits allowed for this slot.
    *   `isBookable`: (boolean) Whether the slot is currently open for booking.
    *   `tag`: (string, optional) Label for the slot (e.g., teacher name) to help identify who is available.

**`visits` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `parentId`: (string, optional) Reference to parent if user accounts are implemented.
    *   `parentName`: (string) Name of the parent.
    *   `parentEmail`: (string) Email of the parent.
    *   `parentPhone`: (string, optional) Phone number of the parent.
    *   `childName`: (string, optional) Name of the child.
    *   `childAge`: (number, optional) Age of the child.
    *   `childGradeOfInterest`: (string, optional) Grade level the child is interested in.
    *   `unitId`: (string) Reference to the `units` collection/table for the chosen unit.
    *   `slotId`: (string) Reference to the `availability_slots` collection/table.
    *   `visitDateTime`: (timestamp) The actual date and time of the visit.
    *   `status`: (string) Current status of the visit (e.g., "Scheduled", "Confirmed", "Completed", "Cancelled").
    *   `notes`: (string, optional) Internal notes about the visit.
    *   `createdAt`: (timestamp) Visit creation timestamp.

**`leads` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `parentName`: (string) Name of the prospective parent.
    *   `parentEmail`: (string) Email of the prospective parent.
    *   `parentPhone`: (string, optional) Phone number of the prospective parent.
    *   `childName`: (string, optional) Name of the child.
    *   `childAge`: (number, optional) Age of the child.
    *   `childGradeOfInterest`: (string, optional) Grade level the child is interested in.
    *   `source`: (string, optional) How the lead was acquired (e.g., "Website Visit", "Chat", "Referral").
    *   `status`: (string) Current status in the sales funnel (e.g., "New Lead", "Contacted", "Visit Scheduled", "Enrolled", "Lost").
    *   `lastContactDate`: (timestamp, optional) Date of the last contact with the lead.
    *   `nextFollowUpDate`: (timestamp, optional) Date for the next planned follow-up.
    *   `notes`: (string, optional) Internal notes about the lead and communication history.
    *   `visitId`: (string, optional) Reference to the `visits` collection/table if a visit is scheduled.
    *   `createdAt`: (timestamp) Lead creation timestamp.
    *   `updatedAt`: (timestamp) Last update timestamp.

**`chat_logs` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `sessionId`: (string) Unique identifier for the chat session.
    *   `participantType`: (string) "Parent" or "Admin".
    *   `message`: (string) The content of the chat message.
    *   `timestamp`: (timestamp) Time the message was sent.
    *   `leadId`: (string, optional) Reference to the `leads` collection/table if the chat is associated with a lead.

**`chat_faqs` collection/table:**
*   **ID:** Auto-generated ID.
*   **Fields:**
    *   `question`: (string) The FAQ question.
    *   `answer`: (string) The automated answer.
    *   `keywords`: (array of strings, optional) Keywords for matching questions.

### 4.2 API Endpoints (Illustrative)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/units` | GET | Retrieves a list of all school units. |
| `/api/availability-slots` | GET | Retrieves available slots for a given unit and date range. |
| `/api/visits` | POST | (Public) Schedules a new school visit. |
| `/api/visits/:id` | GET | (Admin) Retrieves details of a specific visit. |
| `/api/visits/:id` | PUT | (Admin) Updates the status or details of a visit. |
| `/api/visits/:id` | DELETE | (Admin) Cancels a visit. |
| `/api/admin/visits` | GET | (Admin) Retrieves a list of all scheduled visits. |
| `/api/admin/availability-slots` | POST | (Admin) Creates new availability slots. |
| `/api/admin/availability-slots/:id` | PUT | (Admin) Updates an existing availability slot. |
| `/api/admin/availability-slots/:id` | DELETE | (Admin) Deletes an availability slot. |
| `/api/leads` | GET | (Admin) Retrieves a list of all leads. |
| `/api/leads/:id` | GET | (Admin) Retrieves details of a specific lead. |
| `/api/leads/:id` | PUT | (Admin) Updates lead information and status. |
| `/api/chat/message` | POST | (Public/Admin) Sends a chat message. |
| `/api/chat/history/:sessionId` | GET | (Admin) Retrieves chat history for a session. |
| `/api/admin/faqs` | GET | (Admin) Retrieves a list of all FAQs. |
| `/api/admin/faqs` | POST | (Admin) Creates a new FAQ. |
| `/api/admin/faqs/:id` | PUT | (Admin) Updates an existing FAQ. |
| `/api/admin/faqs/:id` | DELETE | (Admin) Deletes an FAQ. |
| `/api/auth/login` | POST | (Admin) Authenticates an admin user. |
| `/api/auth/reset-password` | POST | (Admin) Initiates password reset for an admin user. |

## 5. Design and Visual Identity

### 5.1 Color Palette

The user interface will adopt a warm, natural, and inviting color palette, reflecting the Waldorf educational philosophy. The design should evoke a sense of calm, creativity, and connection to nature. Specific colors will be chosen to align with the school's existing branding, if available, or inspired by typical Waldorf aesthetics.

*   **Primary Tones:** Earthy Greens, Warm Oranges, Soft Yellows
*   **Secondary Tones:** Sky Blues, Gentle Pinks, Muted Purples
*   **Accent & Text:** Deep Browns, Forest Greens
reference: https://www.escolaangelim.com.br

### 5.2 Typography

*   **Headings:** use Baar Antropos a typical waldorf font.
*   **Body Text:** A highly readable serif or sans-serif font suitable for longer text blocks, ensuring comfort for parents reading information.
*   **Branding Elements:** Consideration for a handwritten or artistic font for specific decorative elements, aligning with the Waldorf emphasis on artistry and individuality.

### 5.3 Layout

*   **Public Parent Portal:** A mobile-first, intuitive layout with clear navigation. Emphasis will be on ease of scheduling, clear presentation of school information, and accessible chat functionality. Visuals should be engaging and reflect the school's environment.
*   **Admin Management Dashboard:** A clean, organized, desktop-first layout designed for efficiency. It will feature a clear sidebar for navigation between visits, availability, leads, and chat management. Data will be presented in easily digestible tables and calendar views, with forms for managing entries.

## 6. Non-Functional Requirements

### 6.1 Performance

*   The system shall be responsive, with page load times under 3 seconds for 90% of users under normal load conditions.
*   The system shall support at least 100 concurrent users without significant degradation in performance.

### 6.2 Security

*   All data transmission between the client and server shall be encrypted using HTTPS.
*   Admin authentication credentials shall be securely stored (e.g., hashed and salted).
*   The system shall implement role-based access control to ensure admins only access authorized features.
*   Personal identifiable information (PII) of parents and children shall be handled in compliance with relevant data protection regulations (e.g., GDPR, LGPD).

### 6.3 Scalability

*   The system architecture shall be designed to scale horizontally to accommodate an increasing number of users and data.
*   The database should be capable of handling a growing volume of visits, leads, and chat logs.

### 6.4 Usability

*   The Public Parent Portal shall be intuitive and easy to navigate for parents with varying technical proficiencies.
*   The Admin Management Dashboard shall be efficient for school staff to manage their daily tasks with minimal training.
*   Error messages shall be clear, concise, and provide actionable guidance.

### 6.5 Reliability

*   The system shall have a high uptime, aiming for 99.9% availability.
*   Data backups shall be performed regularly to prevent data loss.

### 6.6 Maintainability

*   The codebase shall be well-documented and follow established coding standards.
*   The system architecture shall be modular to facilitate future enhancements and bug fixes.

## 7. Future Enhancements (Optional)

*   Integration with school's existing Student Information System (SIS).
*   Automated chat using RAG.
*   Automated SMS reminders for visits.
*   Advanced analytics and reporting for lead conversion.
*   Multi-language support for the Public Parent Portal.
*   Parent accounts for managing their scheduled visits and communication history.
*   Integration with external calendars (e.g., Google Calendar, Outlook Calendar) for admin staff.

