# **Moonlight Cafe**

A website for small cafe owners. 

> **NOTE:** This repository is for the frontend only. Visit [backend](https://github.com/LyTracey/myrestaurant_backend) to view the repository for the backend of this project.

---

## **Contents**

- [Purpose](#purpose)

- [Tech Stack](#tech-stack)

    - [Backend](#backend)

    - [Frontend](#frontend)

- [Features](#features)

    - [Design](#design)

    - [Security](#security)

    - [Interactivity](#interactivity)

- [Feedback](#feedback)

---

## **Purpose**

Moonlight Cafe was built to practice my full-stack engineering skills. I chose a cafe as a real-world scenario to develop my use cases around from the perspective of managing and running a small cafe shop. Please note that this is a fictitious cafe!

The main use cases I developed this website around are:
> As a manager, I would like to have an overview of the cafe's sales, revenue, profits, and be warned of anything I should be aware of.

> As a sales staff member, I require an application I can use to record orders. I also need an overview of the cafe's sales and be warned of anything that's out of stock.

> As a chef, I need to be able to edit the menu as I curate the menu and need to be able to manage the inventory.

---

## **Tech Stack**
 
### Backend

The backed was built using Django and Django Rest Framework (DRF) connected to a PostgreSQL database. I opted to use DRF wherever possibe as it provides many useful classes that abstracts Django for many common use cases, making the code more maintainable.

The image below depicts the relationships between the user-defined models of the backend.


### Frontend

The frontend was built using React.js, TypeScript, React-Bootstrap, and SCSS. 

---

## **How to Run**

---

## **Features**

### Design

The design theme of this website and cafe is day and night. Select whichever them  you like best using the theme toggle.

### Security

<ins>Authentication</ins>

For 'non-public' pages, JWT is used to authenticate users in the backend, developed using the `Simple JWT` package ([Simple JWT]: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/).

For the frontend, tokens are stored as `SessionTokens` or `HTTP only` cookies.

<ins>Permissions and Customised Views</ins>

### Interactivity

A key aspect of this project is providing an interactive platform for small cafe owners to easily retrieve summary metrics of their business

#### Integrated Data

### Updates
1. 


### Feedback

If you experience any issues with this project, please open an issue.