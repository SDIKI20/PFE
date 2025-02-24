

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'employe', 'client')) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules
CREATE TABLE vehicules (
    id SERIAL PRIMARY KEY,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    annee INT NOT NULL,
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    type_carburant VARCHAR(10) CHECK (type_carburant IN ('essence', 'diesel', 'electrique', 'hybride')) NOT NULL,
    kilometrage INT NOT NULL,
    etat VARCHAR(100) NOT NULL,
    tarif_journalier DECIMAL(10,2) NOT NULL,
    disponibilite BOOLEAN DEFAULT TRUE,
    images TEXT
);

-- Table des clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
    permis_conduire VARCHAR(100) NOT NULL,
    carte_identite VARCHAR(100) NOT NULL
);

-- Table des employés
CREATE TABLE employes (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table des réservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    vehicule_id INT REFERENCES vehicules(id) ON DELETE CASCADE,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(10) CHECK (statut IN ('en attente', 'confirmée', 'annulée', 'terminée')) DEFAULT 'en attente',
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE paiements (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    montant DECIMAL(10,2) NOT NULL,
    methode VARCHAR(15) CHECK (methode IN ('carte bancaire', 'paypal', 'stripe', 'espèces')) NOT NULL,
    statut VARCHAR(10) CHECK (statut IN ('en attente', 'payé', 'remboursé')) DEFAULT 'en attente',
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des cautions
CREATE TABLE cautions (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    montant DECIMAL(10,2) NOT NULL,
    statut VARCHAR(15) CHECK (statut IN ('retenue', 'remboursée', 'en attente')) DEFAULT 'en attente',
    date_operation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des factures
CREATE TABLE factures (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    fichier_facture VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des retours
CREATE TABLE retours (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    etat_retour VARCHAR(100) NOT NULL,
    frais_supplementaires DECIMAL(10,2) DEFAULT 0.00,
    date_retour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des actions des employés
CREATE TABLE actions_employes (
    id SERIAL PRIMARY KEY,
    employe_id INT REFERENCES employes(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
