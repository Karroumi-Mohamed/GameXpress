# 🎨 Frontend Administrateur E-commerce (GameXpress)

## 🚀 Introduction
Ce projet est la **version V1 du back-office** de GameXpress, un tableau de bord administrateur permettant la gestion des produits, des images et des catégories.
Il est développé avec **React.js** pour une expérience utilisateur fluide et réactive.

## 🛠️ Technologies Utilisées
- **Framework Frontend** : React.js
- **UI Library** : Tailwind / bootstrap  CSS
- **Gestion d'état** : UseContext
- **Authentification** : Laravel Sanctum (via API Backend)
- **Requêtes API** : "-- Axios --"
- **Routing** : React Router
- **Gestion des notifications** : "-- React Toastify --"

---

## 📐 Architecture
Le projet suit une **architecture modulaire** avec une séparation des **composants, pages et services API**.


## 🔑 Gestion de l'Authentification
L'authentification est gérée via **Laravel Sanctum** en interagissant avec l'API Backend. Les utilisateurs doivent être connectés pour accéder au back-office.

### 🔹 Fonctionnalités
- **Connexion** via `POST /api/v1/admin/login` `POST /api/v1/admin/register`
- **Déconnexion** via `POST /api/v1/admin/logout`
- **Stockage du token** dans `localStorage`


## 📊 Dashboard Administrateur
Le **tableau de bord** affiche les statistiques principales :
- Nombre de produits
- Nombre de catégories
- Nombre d'utilisateurs 
- Graphiques interactifs (Recharts.js) (bonus)

---

## 🛍️ Gestion des Produits
**Endpoints utilisés** :
- 📜 **Lister** : `GET /api/v1/admin/products`
- ➕ **Créer** : `POST /api/v1/admin/products`
- ✏️ **Modifier** : `PUT /api/v1/admin/products/{id}`
- ❌ **Supprimer** : `DELETE /api/v1/admin/products/{id}`

### 🔹 Fonctionnalités
- Affichage en **tableau dynamique**
- Formulaire de **création & modification**
- Upload **d'images produits**
- Suppression avec **confirmation modale**

---

## 🗂️ Gestion des Catégories
**Endpoints utilisés** :
- 📜 **Lister** : `GET /api/v1/admin/categories`
- ➕ **Créer** : `POST /api/v1/admin/categories`
- ✏️ **Modifier** : `PUT /api/v1/admin/categories/{id}`
- ❌ **Supprimer** : `DELETE /api/v1/admin/categories/{id}`

### 🔹 Fonctionnalités
- Affichage en **tableau**
- Création/modification **avec validation**
- **Gestion des sous-catégories**

---

## 🖼️ Gestion des Images Produits
- Upload d'images  **  -- React Dropzone --**
- **Prévisualisation des images**
- Gestion et Suppression d'images via **API**
- Gestion de l'**image principale** d'un produit

---

## 🔥 Notifications & Feedbacks
- **React Toastify** pour afficher les succès/erreurs
- **Loader visuel** lors des requêtes API
- **Gestion des erreurs avec Axios Interceptors**

---

## 📅 Planning de Développement (Semaine 1)

### 📆 **Jour 1**
✅ Initialisation du projet React.js

✅ Configuration de **Tailwind CSS & React Router**

✅ Mise en place du **système d'authentification** (Register , Login, Logout)

### 📆 **Jour 2**

✅ Implémentation d'authentification  **UseContext**

✅ Développement du **Dashboard Administrateur**

### 📆 **Jour 3**

✅ Création du **module Produits** (CRUD + Images)

✅ Intégration de Validation  -- Yup --

### 📆 **Jour 4**

✅ Création du **module Catégories** (CRUD + sous-category)

✅ Intégration de Validation  -- Yup --

### 📆 **Jour 5**

✅ Intégration des **notifications & feedbacks**

✅ Notifications en temps  réel & optimisations

---

## 🚀 Déploiement (optionel)
Le projet sera hébergé sur **Vercel** ou **Netlify** après validation de la V1.

### 📤 Étapes
1. `npm run build`
2. Déploiement via GitHub Actions ou Vercel
3. Configuration du `.env` pour les variables d'API

---


