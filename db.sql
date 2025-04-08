-- Enums------------------------------------------------------------------------------------

DROP TYPE fuel_type;
DROP TYPE transmission_type;
DROP TYPE body_type;
DROP TYPE user_roles;

-- ENUM types
CREATE TYPE fuel_type AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Gasoline', 'Natural', 'LGP', 'E85');
CREATE TYPE transmission_type AS ENUM ('Manual', 'Automatic');
CREATE TYPE body_type AS ENUM ('Sport', 'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Off-Road', 'Truck', 'Van');
CREATE TYPE user_roles AS ENUM ('Admin', 'Employe', 'Client');

-- Tabels------------------------------------------------------------------------------

DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS wilaya;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS office;
DROP TABLE IF EXISTS user_tokens;
DROP TABLE IF EXISTS users_documents;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	fname VARCHAR(20) NOT NULL,
	lname VARCHAR(20) NOT NULL,
	address VARCHAR(30) NOT NULL,
	country VARCHAR(30) NOT NULL DEFAULT 'Algeria',
	wilaya VARCHAR(30) NOT NULL,
	city VARCHAR(30) NOT NULL,
	zipcode VARCHAR(10) NOT NULL,
	image VARCHAR(255) NOT NULL DEFAULT '/assets/images/user.jpg',
	phone VARCHAR(20) UNIQUE NOT NULL,
	account_status BOOLEAN NOT NULL DEFAULT FALSE,
	phone_status BOOLEAN NOT NULL DEFAULT FALSE,
	birthdate DATE NOT NULL,
	role user_roles NOT NULL DEFAULT 'Client',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users documents
CREATE TABLE users_documents (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	image_front VARCHAR(255) NOT NULL,
	image_back VARCHAR(255) NOT NULL,
	upload_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User tokens
CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Brands
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    logo VARCHAR(255) NOT NULL DEFAULT '/assets/cars/default_logo.png',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Office
CREATE TABLE office (
  id SERIAL PRIMARY KEY,
  country VARCHAR(20) NOT NULL,
  wilaya VARCHAR(30) NOT NULL,
  city VARCHAR(30) NOT NULL,
  address VARCHAR(50) NOT NULL,
  open_time TIME DEFAULT '08:00:00',
  close_time TIME DEFAULT '22:00:00',
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

-- Vehicles
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  model VARCHAR(30) NOT NULL,
  fab_year SMALLINT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  color VARCHAR(20) NOT NULL,
  capacity SMALLINT NOT NULL DEFAULT 4,
  doors SMALLINT NOT NULL DEFAULT 4,
  fuel fuel_type NOT NULL,
  transmission transmission_type NOT NULL,
  availability BOOLEAN NOT NULL DEFAULT TRUE,
  body body_type NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  location INTEGER NOT NULL REFERENCES office(id) ON DELETE CASCADE,
  units SMALLINT NOT NULL DEFAULT 0,
  speed SMALLINT NOT NULL DEFAULT 0,
  horsepower SMALLINT NOT NULL DEFAULT 0,
  engine_type VARCHAR(20) NOT NULL DEFAULT 'unknown',
  rental_type VARCHAR(2) NOT NULL DEFAULT 'h',
  image VARCHAR(255) NOT NULL DEFAULT '/assets/cars/default.png',
  prevImage1 VARCHAR(255) NOT NULL DEFAULT '/assets/cars/default_prev.png',
  prevImage2 VARCHAR(255) NOT NULL DEFAULT '/assets/cars/default_prev.png',
  prevImage3 VARCHAR(255) NOT NULL DEFAULT '/assets/cars/default_prev.png',
  description VARCHAR(100) NOT NULL DEFAULT 'There is no description for this car.'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rentals
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rental_id INT NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    stars SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wilaya & City tables
CREATE TABLE wilaya (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE city (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  wilaya_id INT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE vehicle_features (
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (vehicle_id, feature_id)
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,                              
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,     
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE, 
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, vehicle_id)                      
);


-- Indexes--------------------------------------------------------------
CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rental ON reviews(rental_id);
CREATE INDEX idx_rentals_vehicle ON rentals(vehicle_id);
CREATE INDEX idx_rentals_user ON rentals(user_id);
CREATE INDEX idx_vehicles_brand ON vehicles(brand_id);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_location ON vehicles(location);
CREATE INDEX idx_vehicles_engine_type ON vehicles(engine_type);
CREATE INDEX idx_vehicles_speed ON vehicles(speed);
CREATE INDEX idx_vehicles_horsepower ON vehicles(horsepower);
CREATE INDEX idx_vehicle_features_vehicle_id ON vehicle_features(vehicle_id);
CREATE INDEX idx_vehicle_features_feature_id ON vehicle_features(feature_id);
CREATE INDEX idx_vehicle_features_combo ON vehicle_features(vehicle_id, feature_id);
CREATE INDEX idx_favorites_added_at ON favorites(added_at);


--Triggers--------------------------------------------------------

-- update vehicle availability
CREATE OR REPLACE FUNCTION update_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vehicles
    SET availability = (units > 0 AND (
        SELECT COUNT(*) FROM rentals WHERE rentals.vehicle_id = vehicles.id AND rentals.status IN ('pending', 'active')
    ) < units)
    WHERE id = NEW.vehicle_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on rentals
CREATE TRIGGER rental_update_trigger
AFTER INSERT OR UPDATE OR DELETE ON rentals
FOR EACH ROW
EXECUTE FUNCTION update_vehicle_availability();

-- Trigger on vehicles
CREATE TRIGGER vehicle_update_trigger
AFTER UPDATE OF units ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_vehicle_availability();

-- Prevent Overlapping Rentals for the Same Vehicle
CREATE OR REPLACE FUNCTION prevent_overlapping_rentals()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM rentals
        WHERE vehicle_id = NEW.vehicle_id
        AND status IN ('pending', 'active')
        AND (NEW.start_date BETWEEN start_date AND end_date
             OR NEW.end_date BETWEEN start_date AND end_date)
    ) THEN
        RAISE EXCEPTION 'This vehicle is already rented during the selected period.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rental_overlap_trigger
BEFORE INSERT OR UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION prevent_overlapping_rentals();


--Inserts------------------------------------------------------------------

INSERT INTO wilaya (name) VALUES 
('Adrar'), ('Chlef'), ('Laghouat'), ('Oum El Bouaghi'), ('Batna'), ('Béjaïa'), ('Biskra'), ('Béchar'), ('Blida'), ('Bouira'),
('Tamanrasset'), ('Tébessa'), ('Tlemcen'), ('Tiaret'), ('Tizi Ouzou'), ('Algiers'), ('Djelfa'), ('Jijel'), ('Sétif'), ('Saïda'),
('Skikda'), ('Sidi Bel Abbès'), ('Annaba'), ('Guelma'), ('Constantine'), ('Médéa'), ('Mostaganem'), ('M''Sila'), ('Mascara'), ('Ouargla'),
('Oran'), ('El Bayadh'), ('Illizi'), ('Bordj Bou Arréridj'), ('Boumerdès'), ('El Tarf'), ('Tindouf'), ('Tissemsilt'), ('El Oued'), ('Khenchela'),
('Souk Ahras'), ('Tipaza'), ('Mila'), ('Aïn Defla'), ('Naâma'), ('Aïn Témouchent'), ('Ghardaïa'), ('Relizane'), ('Timimoun'), ('Bordj Badji Mokhtar'),
('Ouled Djellal'), ('Béni Abbès'), ('In Salah'), ('In Guezzam'), ('Touggourt'), ('Djanet'), ('El MGhair'), ('El Meniaa');

INSERT INTO city (name, wilaya_id) VALUES 
('Adrar', 1), ('Tamest', 1), ('Zaouiet Kounta', 1), ('Aoulef', 1), ('Timimoun', 1), ('Charouine', 1), ('Reggane', 1), ('In Zghmir', 1), ('Tit', 1), ('Tsabit', 1), ('Ouled Ahmed Timmi', 1), ('Bouda', 1);
INSERT INTO city (name, wilaya_id) VALUES 
('Chlef', 2), ('Ténès', 2), ('Benairia', 2), ('El Karimia', 2), ('Oued Fodda', 2), ('Ouled Fares', 2), ('Zeboudja', 2), ('Boukadir', 2), ('Beni Haoua', 2), ('Talassa', 2), ('Harchoun', 2), ('Ouled Abbes', 2), ('El Marsa', 2), ('Chettia', 2), ('Sidi Akkacha', 2), ('Taougrit', 2), ('Abou El Hassen', 2), ('El Hadjadj', 2), ('Labiod Medjadja', 2), ('Oued Sly', 2), ('Herenfa', 2), ('Ouled Ben Abdelkader', 2), ('Sendjas', 2), ('Sidi Abderrahmane', 2), ('Beni Rached', 2), ('Oum Drou', 2), ('Breira', 2), ('Beni Bouateb', 2);
INSERT INTO city (name, wilaya_id) VALUES 
('Laghouat', 3), ('Ksar El Hirane', 3), ('Benacer Ben Chohra', 3), ('Hassi Delaa', 3), ('Hassi R''Mel', 3), ('Ain Madhi', 3), ('Tadjemout', 3), ('Kheneg', 3), ('Gueltat Sidi Saad', 3), ('Ain Sidi Ali', 3), ('Beidha', 3), ('Brida', 3), ('El Ghicha', 3), ('Hadj Mechri', 3), ('Oued Morra', 3), ('Tadjrouna', 3), ('Taouiala', 3);
INSERT INTO city (name, wilaya_id) VALUES 
('Oum El Bouaghi', 4), ('Ain Beida', 4), ('Ain Babouche', 4), ('Ain Diss', 4), ('Ain Fakroun', 4), ('Ain Kercha', 4), ('Ain M''Lila', 4), ('Ain Zitoun', 4), ('Behir Chergui', 4), ('Berriche', 4), ('Bir Chouhada', 4), ('Dhalaa', 4), ('El Amiria', 4), ('El Belala', 4), ('El Djazia', 4), ('El Fedjoudj', 4), ('El Harmilia', 4), ('Fkirina', 4), ('Hanchir Toumghani', 4), ('Ksar Sbahi', 4), ('Meskiana', 4), ('Oued Nini', 4), ('Ouled Gacem', 4), ('Ouled Hamla', 4), ('Ouled Zouai', 4), ('Rahia', 4), ('Sigus', 4), ('Souk Naamane', 4), ('Zorg', 4);
INSERT INTO city (name, wilaya_id) VALUES 
('Batna', 5), ('Merouana', 5), ('Seriana', 5), ('M''Doukal', 5), ('Barika', 5), ('Djezzar', 5), ('Timgad', 5), ('Ras El Aioun', 5), ('N''Gaous', 5), ('Ouled Selam', 5), ('Tazoult', 5), ('Arris', 5), ('Kais', 5), ('Seggana', 5), ('Ichmoul', 5), ('Menaa', 5), ('El Madher', 5), ('Lazrou', 5), ('Bouzina', 5), ('Chemora', 5), ('Oued El Ma', 5), ('Talkhamt', 5), ('Teniet El Abed', 5), ('Ouyoun El Assafir', 5), ('T''Kout', 5), ('Ain Djasser', 5), ('Ouled Aouf', 5), ('Boumagueur', 5), ('Bitam', 5), ('Fesdis', 5), ('Ain Touta', 5), ('Ain Yagout', 5), ('Hidoussa', 5), ('Ouled Fadel', 5), ('Ouled Si Slimane', 5), ('Taxlent', 5), ('Gosbat', 5), ('Ouled Ammar', 5), ('Boumia', 5), ('Djerma', 5), ('Guigba', 5), ('Inoughissen', 5), ('Maafa', 5), ('Ouled Ameur', 5), ('Ouled Maouhoub', 5), ('Ouled Sidi Brahim', 5), ('Tighanimine', 5), ('Tilatou', 5), ('Zanat El Beida', 5);
INSERT INTO city (name, wilaya_id) VALUES 
('Béjaïa', 6), ('Amizour', 6), ('Aokas', 6), ('Barbacha', 6), ('Beni Djellil', 6), ('Beni Ksila', 6), ('Boudjellil', 6), ('Bouhamza', 6), ('Chemini', 6), ('Darguina', 6), ('El Kseur', 6), ('Feraoun', 6), ('Ighil Ali', 6), ('Kendira', 6), ('Seddouk', 6), ('Sidi Aich', 6), ('Souk El Tenine', 6), ('Tazmalt', 6), ('Tichy', 6), ('Timezrit', 6), ('Toudja', 6), ('Adekar', 6), ('Akbou', 6), ('Akfadou', 6), ('Amalou', 6), ('Ait R''Zine', 6), ('Ait Smail', 6), ('Bougie', 6), ('Draa El Kaid', 6), ('Ifri', 6), ('Ighram', 6), ('Kherrata', 6), ('M''Cisna', 6), ('Melbou', 6), ('Oued Ghir', 6), ('Souk Oufella', 6), ('Taourit Ighil', 6), ('Taskriout', 6), ('Tibane', 6), ('Tifra', 6), ('Tizi N''Berber', 6), ('Tala Hamza', 6);
INSERT INTO city (name, wilaya_id) VALUES 
('Biskra', 7), ('Djemorah', 7), ('El Outaya', 7), ('Foughala', 7), ('Branis', 7), ('Chetma', 7), ('El Kantara', 7), ('Ain Naga', 7), ('El Haouch', 7), ('Ain Zaatout', 7), ('El Mizaraa', 7), ('Bouchagroun', 7), ('M''Chouneche', 7), ('Ouled Djellal', 7), ('Ras El Miad', 7), ('Sidi Khaled', 7), ('Sidi Okba', 7), ('Tolga', 7), ('Zeribet El Oued', 7), ('Lichana', 7), ('Oumache', 7), ('M''Lili', 7), ('El Feidh', 7), ('El Ghrous', 7), ('Khenguet Sidi Nadji', 7);
INSERT INTO city (name, wilaya_id) VALUES 
('Béchar', 8), ('Erg Ferradj', 8), ('Kenadsa', 8), ('Meridja', 8), ('Taghit', 8), ('Beni Ounif', 8), ('Mogheul', 8), ('Abadla', 8), ('Boukais', 8), ('El Ouata', 8), ('Kerkoub', 8), ('Ouled Khoudir', 8), ('Tabelbala', 8), ('Tamtert', 8), ('Beni Abbes', 8), ('Timoudi', 8);
INSERT INTO city (name, wilaya_id) VALUES 
('Blida', 9), ('Bouarfa', 9), ('Bouinan', 9), ('Bougara', 9), ('Boufarik', 9), ('Chebli', 9), ('Chiffa', 9), ('Chrea', 9), ('El Affroun', 9), ('Guerrouaou', 9), ('Hammam Melouane', 9), ('Larbaa', 9), ('Meftah', 9), ('Mouzaia', 9), ('Oued Alleug', 9), ('Ouled Yaich', 9), ('Souhane', 9), ('Soumaa', 9), ('Beni Tamou', 9), ('Beni Mered', 9), ('Beni Misra', 9), ('Beni Sala', 9), ('Birkhadem', 9), ('Bouinan', 9), ('Djebabra', 9), ('Oued Djer', 9), ('Ouled Slama', 9), ('Tablat', 9);
INSERT INTO city (name, wilaya_id) VALUES 
('Bouira', 10), ('Ain Bessem', 10), ('Ahl El Ksar', 10), ('Ain El Hadjar', 10), ('Ain Turk', 10), ('Ait Laaziz', 10), ('Ath Mansour', 10), ('Bechloul', 10), ('Bir Ghbalou', 10), ('Bordj Okhriss', 10), ('Bouderbala', 10), ('Boukram', 10), ('Chorfa', 10), ('Dechmia', 10), ('Dirrah', 10), ('Djebahia', 10), ('El Adjiba', 10), ('El Asnam', 10), ('El Hachimia', 10), ('El Khabouzia', 10), ('El Mokrani', 10), ('Haizer', 10), ('Hadjera Zerga', 10), ('Kadiria', 10), ('Lakhdaria', 10), ('M''Chedallah', 10), ('Maala', 10), ('Maamora', 10), ('Oued El Berdi', 10), ('Ouled Rached', 10), ('Raouraoua', 10), ('Ridane', 10), ('Saharidj', 10), ('Souk El Khemis', 10), ('Sour El Ghozlane', 10), ('Taghzout', 10), ('Taguedit', 10), ('Zbarbar', 10);
INSERT INTO city (name, wilaya_id) VALUES 
('Tamanrasset', 11), ('Abalessa', 11), ('In Ghar', 11), ('In Guezzam', 11), ('In Salah', 11), ('Tazrouk', 11), ('Tin Zaouatine', 11), ('Idles', 11), ('Tahifet', 11), ('Ain Guezam', 11), ('Ain Salah', 11);
INSERT INTO city (name, wilaya_id) VALUES 
('Tébessa', 12), ('Bir El Ater', 12), ('Cheria', 12), ('Stah Guentis', 12), ('El Aouinet', 12), ('El Kouif', 12), ('El Ma Labiodh', 12), ('El Meridj', 12), ('El Ogla', 12), ('El Ogla El Malha', 12), ('Guorriguer', 12), ('Hammamet', 12), ('Morsott', 12), ('Negrine', 12), ('Ouenza', 12), ('Oum Ali', 12), ('Safsaf El Ouesra', 12), ('Souk Ahras', 12), ('Tlidjene', 12), ('Ain Zerga', 12), ('Bekkaria', 12), ('Bir Dheheb', 12), ('El Malabiodh', 12), ('Ferkane', 12), ('M''Daourouche', 12), ('Oued El Kebir', 12), ('Oum Laadham', 12), ('Sidi Fredj', 12), ('Tebessa', 12);
INSERT INTO city (name, wilaya_id) VALUES 
('Tlemcen', 13), ('Ain Fezza', 13), ('Ain Ghoraba', 13), ('Ain Kebira', 13), ('Ain Nehala', 13), ('Ain Tallout', 13), ('Ain Youcef', 13), ('Amieur', 13), ('Azails', 13), ('Bab El Assa', 13), ('Beni Bahdel', 13), ('Beni Boussaid', 13), ('Beni Mester', 13), ('Beni Ouarsous', 13), ('Beni Snous', 13), ('Bensekrane', 13), ('Bouhlou', 13), ('Chetouane', 13), ('El Aricha', 13), ('El Bouihi', 13), ('El Fehoul', 13), ('El Gor', 13), ('Hennaya', 13), ('Honaïne', 13), ('Maghnia', 13), ('Marsa Ben M''Hidi', 13), ('Nedroma', 13), ('Oued Chouly', 13), ('Ouled Mimoun', 13), ('Remchi', 13), ('Sabra', 13), ('Sebbaa Chioukh', 13), ('Sebdou', 13), ('Sidi Abdelli', 13), ('Sidi Djillali', 13), ('Sidi Medjahed', 13), ('Souahlia', 13), ('Souani', 13), ('Terny', 13), ('Zenata', 13);
INSERT INTO city (name, wilaya_id) VALUES 
('Tiaret', 14), ('Ain Bouchekif', 14), ('Ain Deheb', 14), ('Ain El Hadid', 14), ('Ain Kermes', 14), ('Ain Zarit', 14), ('Bougara', 14), ('Chehaima', 14), ('Dahmouni', 14), ('Djebilet Rosfa', 14), ('Faidja', 14), ('Frenda', 14), ('Guertoufa', 14), ('Hamadia', 14), ('Ksar Chellala', 14), ('Madna', 14), ('Mahdia', 14), ('Mechraa Safa', 14), ('Medroussa', 14), ('Meghila', 14), ('Mellakou', 14), ('Nadorah', 14), ('Naima', 14), ('Oued Lilli', 14), ('Rahouia', 14), ('Rechaiga', 14), ('Sebaine', 14), ('Sebt', 14), ('Serghine', 14), ('Si Abdelghani', 14), ('Sidi Abderrahmane', 14), ('Sidi Ali Mellal', 14), ('Sidi Bakhti', 14), ('Sidi Hosni', 14), ('Sougueur', 14), ('Tagdemt', 14), ('Takhemaret', 14), ('Tidda', 14), ('Tousnina', 14), ('Zmalet El Emir Abdelkader', 14);
INSERT INTO city (name, wilaya_id) VALUES 
('Tizi Ouzou', 15), ('Ain El Hammam', 15), ('Ain Zaouia', 15), ('Azazga', 15), ('Azeffoun', 15), ('Beni Douala', 15), ('Beni Yenni', 15), ('Boghni', 15), ('Bounouh', 15), ('Bouzeguene', 15), ('Draa Ben Khedda', 15), ('Draa El Mizan', 15), ('Freha', 15), ('Frikat', 15), ('Iboudraren', 15), ('Idjeur', 15), ('Iferhounene', 15), ('Ifigha', 15), ('Iflissen', 15), ('Illilten', 15), ('Illoula Oumalou', 15), ('Imsouhal', 15), ('Irdjen', 15), ('Larba Nath Irathen', 15), ('Maatkas', 15), ('Makouda', 15), ('Mekla', 15), ('Mizrana', 15), ('Ouacif', 15), ('Ouadhia', 15), ('Ouaguenoun', 15), ('Sidi Namane', 15), ('Souk El Thenine', 15), ('Tadmait', 15), ('Tigzirt', 15), ('Timizart', 15), ('Tirmitine', 15), ('Tizi Gheniff', 15), ('Tizi N''Tleta', 15), ('Tizi Rached', 15), ('Yakouren', 15), ('Yatafen', 15), ('Zekri', 15);
INSERT INTO city (name, wilaya_id) VALUES 
('Algiers', 16), ('Ain Benian', 16), ('Ain Taya', 16), ('Bab Ezzouar', 16), ('Baba Hassen', 16), ('Bachdjerrah', 16), ('Baraki', 16), ('Ben Aknoun', 16), ('Birkhadem', 16), ('Bordj El Bahri', 16), ('Bordj El Kiffan', 16), ('Bourouba', 16), ('Casbah', 16), ('Cheraga', 16), ('Dar El Beida', 16), ('Dely Ibrahim', 16), ('Djasr Kasentina', 16), ('Douera', 16), ('Draria', 16), ('El Achour', 16), ('El Biar', 16), ('El Harrach', 16), ('El Madania', 16), ('El Magharia', 16), ('El Marsa', 16), ('El Mouradia', 16), ('Hamma Annassers', 16), ('Hammamet', 16), ('Herraoua', 16), ('Hussein Dey', 16), ('Hydra', 16), ('Kouba', 16), ('Les Eucalyptus', 16), ('Mahelma', 16), ('Mohammadia', 16), ('Oued Koriche', 16), ('Oued Smar', 16), ('Ouled Chebel', 16), ('Ouled Fayet', 16), ('Rais Hamidou', 16), ('Reghaia', 16), ('Rouiba', 16), ('Sidi M''Hamed', 16), ('Sidi Moussa', 16), ('Souidania', 16), ('Staoueli', 16), ('Tessala El Merdja', 16), ('Zeralda', 16);
INSERT INTO city (name, wilaya_id) VALUES 
('Djelfa', 17), ('Ain Chouhada', 17), ('Ain El Ibel', 17), ('Ain Feka', 17), ('Ain Maabed', 17), ('Ain Oussera', 17), ('Amourah', 17), ('Benhar', 17), ('Birine', 17), ('Bouira Lahdab', 17), ('Charef', 17), ('Dar Chioukh', 17), ('Deldoul', 17), ('Douis', 17), ('El Guedid', 17), ('El Idrissia', 17), ('El Khemis', 17), ('Faidh El Botma', 17), ('Guernini', 17), ('Had Sahary', 17), ('Hassi Bahbah', 17), ('Hassi El Euch', 17), ('Hassi Fedoul', 17), ('Messad', 17), ('M''Liliha', 17), ('Oum Laadham', 17), ('Sed Rahal', 17), ('Selmana', 17), ('Sidi Baizid', 17), ('Sidi Ladjel', 17), ('Tadmit', 17), ('Zaafrane', 17), ('Zaccar', 17);
INSERT INTO city (name, wilaya_id) VALUES 
('Jijel', 18), ('Ain El Kebira', 18), ('Ain Errich', 18), ('Ain Kechra', 18), ('Ain Sefra', 18), ('Ain Zeroual', 18), ('Bordj T''har', 18), ('Boudria Beni Yadjis', 18), ('Bouraoui Belhadef', 18), ('Chekfa', 18), ('Djemaa Beni Habibi', 18), ('El Ancer', 18), ('El Aouana', 18), ('El Kennar Nouchfi', 18), ('El Milia', 18), ('Emir Abdelkader', 18), ('Eraguene', 18), ('Ghebala', 18), ('Jijel', 18), ('Kaous', 18), ('Kemir', 18), ('Oudjana', 18), ('Ouled Rabah', 18), ('Ouled Yahia Khadrouch', 18), ('Selma Benziada', 18), ('Settara', 18), ('Sidi Abdelaziz', 18), ('Sidi Maarouf', 18), ('Taher', 18), ('Texenna', 18), ('Ziama Mansouriah', 18);
INSERT INTO city (name, wilaya_id) VALUES 
('Sétif', 19), ('Ain Abessa', 19), ('Ain Arnat', 19), ('Ain Azel', 19), ('Ain El Kebira', 19), ('Ain Lahdjar', 19), ('Ain Legraj', 19), ('Ain Oulmene', 19), ('Ain Roua', 19), ('Ain Sebt', 19), ('Ain Taghrout', 19), ('Amoucha', 19), ('Babor', 19), ('Bazer Sakhra', 19), ('Beidha Bordj', 19), ('Belaa', 19), ('Beni Aziz', 19), ('Beni Chebana', 19), ('Beni Fouda', 19), ('Beni Hocine', 19), ('Beni Ourtilane', 19), ('Bir El Arch', 19), ('Bir Haddada', 19), ('Bouandas', 19), ('Bougaa', 19), ('Bousselam', 19), ('Boutaleb', 19), ('Dehamcha', 19), ('Djemila', 19), ('Draa Kebila', 19), ('El Eulma', 19), ('El Ouricia', 19), ('Guellal', 19), ('Guelta Zerka', 19), ('Hamma', 19), ('Hammam Guergour', 19), ('Harbil', 19), ('Ksar El Abtal', 19), ('Maaouia', 19), ('Maoklane', 19), ('Mezloug', 19), ('Oued El Barad', 19), ('Ouled Addouane', 19), ('Ouled Sabor', 19), ('Ouled Si Ahmed', 19), ('Ouled Tebben', 19), ('Rasfa', 19), ('Salah Bey', 19), ('Serdj El Ghoul', 19), ('Tachouda', 19), ('Talaifacene', 19), ('Taya', 19), ('Tella', 19), ('Tizi N''Bechar', 19);
INSERT INTO city (name, wilaya_id) VALUES 
('Saïda', 20), ('Ain El Hadjar', 20), ('Ain Soltane', 20), ('Doui Thabet', 20), ('El Hassasna', 20), ('Hounet', 20), ('Maamora', 20), ('Ouled Brahim', 20), ('Ouled Khaled', 20), ('Sidi Ahmed', 20), ('Sidi Amar', 20), ('Sidi Boubekeur', 20), ('Tircine', 20), ('Youb', 20);
INSERT INTO city (name, wilaya_id) VALUES 
('Skikda', 21), ('Ain Bouziane', 21), ('Ain Charchar', 21), ('Ain Kechra', 21), ('Ain Zouit', 21), ('Azzaba', 21), ('Bekkouche Lakhdar', 21), ('Ben Azzouz', 21), ('Beni Bechir', 21), ('Beni Oulbane', 21), ('Beni Zid', 21), ('Bin El Ouiden', 21), ('Bouchtata', 21), ('Cheraia', 21), ('Collo', 21), ('Djendel Saadi Mohamed', 21), ('El Ghedir', 21), ('El Hadaiek', 21), ('El Marsa', 21), ('Emdjez Edchich', 21), ('Essebt', 21), ('Filfila', 21), ('Hamadi Krouma', 21), ('Kanoua', 21), ('Kerkera', 21), ('Kheneg Mayoum', 21), ('Oued Zehour', 21), ('Ouldja Boulballout', 21), ('Ouled Attia', 21), ('Ouled Hbaba', 21), ('Oum Toub', 21), ('Ramdane Djamel', 21), ('Salah Bouchaour', 21), ('Sidi Mezghiche', 21), ('Tamalous', 21), ('Zerdazas', 21), ('Zitouna', 21);
INSERT INTO city (name, wilaya_id) VALUES 
('Sidi Bel Abbès', 22), ('Ain Adden', 22), ('Ain El Berd', 22), ('Ain Kada', 22), ('Ain Thrid', 22), ('Ain Tindamine', 22), ('Amarnas', 22), ('Badredine El Mokrani', 22), ('Benachiba Chelia', 22), ('Bir El Hammam', 22), ('Boudjebaa El Bordj', 22), ('Boukhanafis', 22), ('Chetouane Belaila', 22), ('Dhaya', 22), ('El Hacaiba', 22), ('Hassi Dahou', 22), ('Hassi Zehana', 22), ('Lamtar', 22), ('M''Cid', 22), ('Makedra', 22), ('Marhoum', 22), ('Merine', 22), ('Mezaourou', 22), ('Mostefa Ben Brahim', 22), ('Moulay Slissen', 22), ('Oued Sebaa', 22), ('Oued Sefioun', 22), ('Oued Taourira', 22), ('Ras El Ma', 22), ('Redjem Demouche', 22), ('Sehala Thaoura', 22), ('Sfisef', 22), ('Sidi Ali Benyoub', 22), ('Sidi Ali Boussidi', 22), ('Sidi Brahim', 22), ('Sidi Chaib', 22), ('Sidi Dahou Debdou', 22), ('Sidi Hamadouche', 22), ('Sidi Khaled', 22), ('Sidi Lahcene', 22), ('Sidi Yacoub', 22), ('Tabia', 22), ('Tafissour', 22), ('Taoudmout', 22), ('Teghalimet', 22), ('Tenira', 22), ('Tessala', 22), ('Tilmouni', 22), ('Zerouala', 22);
INSERT INTO city (name, wilaya_id) VALUES 
('Annaba', 23), ('Ain Berda', 23), ('Ain El Assel', 23), ('Ain Kerma', 23), ('Annaba', 23), ('Berrahal', 23), ('Chetaibi', 23), ('Cheurfa', 23), ('El Bouni', 23), ('El Hadjar', 23), ('Eulma', 23), ('Oued El Aneb', 23), ('Seraidi', 23), ('Sidi Amar', 23), ('Treat', 23);
INSERT INTO city (name, wilaya_id) VALUES 
('Guelma', 24), ('Ain Ben Beida', 24), ('Ain Hessania', 24), ('Ain Larbi', 24), ('Ain Makhlouf', 24), ('Ain Reggada', 24), ('Ain Sandel', 24), ('Belkheir', 24), ('Ben Djarah', 24), ('Beni Mezline', 24), ('Bordj Sabat', 24), ('Bou Hachana', 24), ('Bou Hamdane', 24), ('Bouati Mahmoud', 24), ('Bouchegouf', 24), ('Boumahra Ahmed', 24), ('Dahouara', 24), ('Djeballah Khemissi', 24), ('El Fedjoudj', 24), ('Guellat Bou Dbaa', 24), ('Hammam Debagh', 24), ('Hammam Maskhoutine', 24), ('Hammam N''Bails', 24), ('Heliopolis', 24), ('Khezarra', 24), ('Medjez Amar', 24), ('Medjez Sfa', 24), ('Nechmaya', 24), ('Oued Cheham', 24), ('Oued Fragha', 24), ('Oued Zenati', 24), ('Ras El Agba', 24), ('Roknia', 24), ('Sellaoua Announa', 24), ('Tamlouka', 24);
INSERT INTO city (name, wilaya_id) VALUES 
('Constantine', 25), ('Ain Abid', 25), ('Ain Smara', 25), ('Ben Badis', 25), ('Didouche Mourad', 25), ('El Khroub', 25), ('Hamma Bouziane', 25), ('Ibn Ziad', 25), ('Zighoud Youcef', 25), ('Ouled Rahmoune', 25), ('Ain Kerma', 25), ('Ain Netta', 25), ('Ain Sghir', 25), ('Bellevue', 25), ('Boumerdes', 25), ('Chelghoum Laid', 25), ('Draa Ben Khedda', 25), ('El Haria', 25), ('El Meridj', 25), ('Emir Abdelkader', 25), ('Ibn Ziad', 25), ('Meskiana', 25), ('Oued Athmania', 25), ('Ouled Chebel', 25), ('Ouled Djellal', 25), ('Oum El Bouaghi', 25), ('Ras El Oued', 25), ('Sigus', 25), ('Tassala', 25), ('Tebessa', 25), ('Telerghma', 25), ('Tiddis', 25), ('Zighoud Youcef', 25);
INSERT INTO city (name, wilaya_id) VALUES 
('Médéa', 26), ('Ain Boucif', 26), ('Ain Ouksir', 26), ('Aissaouia', 26), ('Aziz', 26), ('Baata', 26), ('Benchicao', 26), ('Beni Slimane', 26), ('Berrouaghia', 26), ('Bir Ben Laabed', 26), ('Boghar', 26), ('Bouaiche', 26), ('Bouaichoune', 26), ('Bouchrahil', 26), ('Boughezoul', 26), ('Bouskene', 26), ('Chahbounia', 26), ('Chellalat El Adhaoura', 26), ('Cheniguel', 26), ('Derrag', 26), ('Djouab', 26), ('Draa Essamar', 26), ('El Azizia', 26), ('El Omaria', 26), ('El Guelbelkebir', 26), ('Hannacha', 26), ('Kef Lakhdar', 26), ('Khams Djouamaa', 26), ('Ksar Boukhari', 26), ('Meghraoua', 26), ('Meftaha', 26), ('Mihoub', 26), ('Ouamri', 26), ('Oued Harbil', 26), ('Ouled Antar', 26), ('Ouled Bouachra', 26), ('Ouled Brahim', 26), ('Ouled Deide', 26), ('Ouled Hellal', 26), ('Ouled Maaref', 26), ('Oum El Djalil', 26), ('Rebaia', 26), ('Saneg', 26), ('Sedraia', 26), ('Seghouane', 26), ('Si Mahdjoub', 26), ('Sidi Damed', 26), ('Sidi Errabia', 26), ('Sidi Naamane', 26), ('Sidi Zahar', 26), ('Sidi Ziane', 26), ('Souagui', 26), ('Tablat', 26), ('Tafraout', 26), ('Tamesguida', 26), ('Tizi Mahdi', 26), ('Zoubiria', 26);
INSERT INTO city (name, wilaya_id) VALUES 
('Mostaganem', 27), ('Ain Boudinar', 27), ('Ain Nouissy', 27), ('Ain Sidi Cherif', 27), ('Ain Tadles', 27), ('Benabdelmalek Ramdane', 27), ('Bouguirat', 27), ('El Hassaine', 27), ('Fornaka', 27), ('Hadjadj', 27), ('Hassi Mameche', 27), ('Kheir Eddine', 27), ('Mansourah', 27), ('Mesra', 27), ('Mazagran', 27), ('Nekmaria', 27), ('Oued El Kheir', 27), ('Ouled Boughalem', 27), ('Ouled Maallah', 27), ('Safsaf', 27), ('Sayada', 27), ('Sidi Ali', 27), ('Sidi Belattar', 27), ('Sidi Lakhdar', 27), ('Sidi Mohamed', 27), ('Souaflia', 27), ('Sour', 27), ('Stidia', 27), ('Tazgait', 27), ('Touahria', 27), ('Abdelmalek Ramdane', 27);
INSERT INTO city (name, wilaya_id) VALUES 
('M''Sila', 28), ('Ain El Hadjel', 28), ('Ain El Melh', 28), ('Ain Fares', 28), ('Ain Khadra', 28), ('Ain Rich', 28), ('Ain Timguenai', 28), ('Belaiba', 28), ('Ben Srour', 28), ('Beni Ilmane', 28), ('Benzouh', 28), ('Berhoum', 28), ('Bir Foda', 28), ('Bou Saada', 28), ('Bouti Sayah', 28), ('Chellal', 28), ('Dehahna', 28), ('Djebel Messaad', 28), ('El Hamel', 28), ('El Houamed', 28), ('Hammam Dhalaa', 28), ('Khettouti Sed El Djir', 28), ('Khoubana', 28), ('Maadid', 28), ('Maarif', 28), ('Magra', 28), ('Medjedel', 28), ('M''Sila', 28), ('M''Tarfa', 28), ('Ouanougha', 28), ('Ouled Addi Guebala', 28), ('Ouled Atia', 28), ('Ouled Derradj', 28), ('Ouled Madhi', 28), ('Ouled Mansour', 28), ('Ouled Sidi Brahim', 28), ('Ouled Slimane', 28), ('Oultene', 28), ('Sidi Aissa', 28), ('Sidi Ameur', 28), ('Sidi Hadjeres', 28), ('Sidi M''Hamed', 28), ('Slim', 28), ('Souamaa', 28), ('Tamsa', 28), ('Tarmount', 28), ('Zarzour', 28);
INSERT INTO city (name, wilaya_id) VALUES 
('Mascara', 29), ('Ain Fares', 29), ('Ain Fekan', 29), ('Ain Ferah', 29), ('Ain Fras', 29), ('Alaimia', 29), ('Aouf', 29), ('Beniane', 29), ('Bou Hanifia', 29), ('Bou Henni', 29), ('Chorfa', 29), ('El Bordj', 29), ('El Gaada', 29), ('El Ghomri', 29), ('El Guettana', 29), ('El Keurt', 29), ('El Menaouer', 29), ('Ferraguig', 29), ('Froha', 29), ('Gharrous', 29), ('Guerdjoum', 29), ('Hachem', 29), ('Hacine', 29), ('Khalouia', 29), ('Makdha', 29), ('Maoussa', 29), ('Mascara', 29), ('Matemore', 29), ('Mocta Douz', 29), ('Nesmoth', 29), ('Oggaz', 29), ('Oued El Abtal', 29), ('Oued Taria', 29), ('Ras Ain Amirouche', 29), ('Sedjerara', 29), ('Sehailia', 29), ('Sidi Abdeldjebar', 29), ('Sidi Abdelmoumen', 29), ('Sidi Boussaid', 29), ('Sidi Kada', 29), ('Sig', 29), ('Tighennif', 29), ('Tizi', 29), ('Zahana', 29), ('Zelameta', 29);
INSERT INTO city (name, wilaya_id) VALUES 
('Ouargla', 30), ('Ain Beida', 30), ('Benaceur', 30), ('El Allia', 30), ('El Borma', 30), ('El Hadjira', 30), ('El Khoub', 30), ('Hassi Ben Abdellah', 30), ('Hassi Messaoud', 30), ('Megarine', 30), ('N''Goussa', 30), ('Ouargla', 30), ('Rouissat', 30), ('Sidi Khouiled', 30), ('Sidi Slimane', 30), ('Taibet', 30), ('Tebesbest', 30), ('Touggourt', 30), ('Zaouia El Abidia', 30);
INSERT INTO city (name, wilaya_id) VALUES 
('Oran', 31), ('Ain El Turk', 31), ('Arzew', 31), ('Ben Freha', 31), ('Bethioua', 31), ('Bir El Djir', 31), ('Boufatis', 31), ('Bousfer', 31), ('Boutlelis', 31), ('El Ancor', 31), ('El Braya', 31), ('El Karma', 31), ('El Kemri', 31), ('Es Senia', 31), ('Gdyel', 31), ('Hassi Bounif', 31), ('Hassi Ben Okba', 31), ('Hassi Mefsoukh', 31), ('Mers El Kebir', 31), ('Misserghin', 31), ('Oran', 31), ('Oued Tlelat', 31), ('Sidi Benyebka', 31), ('Sidi Chami', 31), ('Tafraoui', 31);
INSERT INTO city (name, wilaya_id) VALUES 
('El Bayadh', 32), ('Arbaouat', 32), ('Boualem', 32), ('Bougtoub', 32), ('Boussemghoun', 32), ('Brezina', 32), ('Chellala', 32), ('Cheguig', 32), ('El Abiodh Sidi Cheikh', 32), ('El Bnoud', 32), ('El Kheiter', 32), ('El Mehara', 32), ('Ghassoul', 32), ('Kef El Ahmar', 32), ('Rogassa', 32), ('Sidi Ameur', 32), ('Sidi Slimane', 32), ('Sidi Tifour', 32), ('Stitten', 32), ('Tousmouline', 32), ('El Bayadh', 32);
INSERT INTO city (name, wilaya_id) VALUES 
('Illizi', 33), ('Bordj Omar Driss', 33), ('Debdeb', 33), ('In Amenas', 33), ('Illizi', 33);
INSERT INTO city (name, wilaya_id) VALUES 
('Bordj Bou Arréridj', 34), ('Ain Taghrout', 34), ('Ain Tesra', 34), ('Belimour', 34), ('Ben Daoud', 34), ('Bir Kasdali', 34), ('Bordj Bou Arreridj', 34), ('Bordj Ghdir', 34), ('Bordj Zemoura', 34), ('Colla', 34), ('Djaafra', 34), ('El Ach', 34), ('El Achir', 34), ('El Anseur', 34), ('El Hamadia', 34), ('El Main', 34), ('El M''Hir', 34), ('Ghailasa', 34), ('Haraza', 34), ('Hasnaoua', 34), ('Khelil', 34), ('Ksour', 34), ('Mansoura', 34), ('Medjana', 34), ('Ouled Brahem', 34), ('Ouled Dahmane', 34), ('Ouled Sidi Brahim', 34), ('Rabta', 34), ('Ras El Oued', 34), ('Sidi Embarek', 34), ('Tafreg', 34), ('Taglait', 34), ('Teniet En Nasr', 34), ('Tixter', 34);
INSERT INTO city (name, wilaya_id) VALUES 
('Boumerdès', 35), ('Afir', 35), ('Ammal', 35), ('Baghlia', 35), ('Ben Choud', 35), ('Beni Amrane', 35), ('Bordj Menaiel', 35), ('Boudouaou', 35), ('Boudouaou El Bahri', 35), ('Boumerdes', 35), ('Bouzegza Keddara', 35), ('Chabet El Ameur', 35), ('Corso', 35), ('Dellys', 35), ('Djinet', 35), ('El Kharrouba', 35), ('Hammedi', 35), ('Isser', 35), ('Khemis El Khechna', 35), ('Larbatache', 35), ('Legata', 35), ('Naciria', 35), ('Ouled Aissa', 35), ('Ouled Hedadj', 35), ('Ouled Moussa', 35), ('Si Mustapha', 35), ('Sidi Daoud', 35), ('Souk El Had', 35), ('Taourga', 35), ('Thenia', 35), ('Tidjelabine', 35), ('Timezrit', 35), ('Zemmouri', 35);
INSERT INTO city (name, wilaya_id) VALUES 
('El Tarf', 36), ('Ain El Assel', 36), ('Ain Kerma', 36), ('Asfour', 36), ('Ben M''Hidi', 36), ('Berrihane', 36), ('Besbes', 36), ('Bouhadjar', 36), ('Bouteldja', 36), ('Chebaita Mokhtar', 36), ('Chefia', 36), ('Chihani', 36), ('Dréan', 36), ('Echatt', 36), ('El Aioun', 36), ('El Kala', 36), ('El Tarf', 36), ('Hammam Beni Salah', 36), ('Lac Des Oiseaux', 36), ('Oued Zitoun', 36), ('Raml Souk', 36), ('Souarekh', 36), ('Zerizer', 36), ('Zitouna', 36);
INSERT INTO city (name, wilaya_id) VALUES 
('Tindouf', 37), ('Oum El Assel', 37);
INSERT INTO city (name, wilaya_id) VALUES 
('Tissemsilt', 38), ('Ammari', 38), ('Bordj Bou Naama', 38), ('Bordj Emir Abdelkader', 38), ('Boucaid', 38), ('Khemisti', 38), ('Lardjem', 38), ('Lazharia', 38), ('Maacem', 38), ('Melaab', 38), ('Ouled Bessem', 38), ('Sidi Abed', 38), ('Sidi Boutouchent', 38), ('Sidi Lantri', 38), ('Sidi Slimane', 38), ('Tamalaht', 38), ('Theniet El Had', 38), ('Tissemsilt', 38), ('Youssoufia', 38);
INSERT INTO city (name, wilaya_id) VALUES 
('El Oued', 39), ('Bayadha', 39), ('Debila', 39), ('Djamaa', 39), ('Douar El Ma', 39), ('El M''Ghair', 39), ('El Oued', 39), ('Guemar', 39), ('Hassi Khalifa', 39), ('Kouinine', 39), ('Magrane', 39), ('Mih Ouensa', 39), ('M''Rara', 39), ('Nakhla', 39), ('Oued El Alenda', 39), ('Oum Touyour', 39), ('Ourmes', 39), ('Reguiba', 39), ('Robbah', 39), ('Sidi Amrane', 39), ('Sidi Aoun', 39), ('Sidi Khellil', 39), ('Still', 39), ('Taghzout', 39), ('Taleb Larbi', 39), ('Tendla', 39), ('Trifaoui', 39);
INSERT INTO city (name, wilaya_id) VALUES 
('Khenchela', 40), ('Ain Touila', 40), ('Babar', 40), ('Baghai', 40), ('Bouhmama', 40), ('Chelia', 40), ('Chechar', 40), ('Djellal', 40), ('El Hamma', 40), ('El Mahmal', 40), ('Ensigha', 40), ('Fais', 40), ('Kaïs', 40), ('Kais', 40), ('Khenchela', 40), ('Khirane', 40), ('M''Sara', 40), ('M''Toussa', 40), ('Ouled Rechache', 40), ('Remila', 40), ('Tamza', 40), ('Taouzianat', 40), ('Yabous', 40);
INSERT INTO city (name, wilaya_id) VALUES 
('Souk Ahras', 41), ('Ain Zana', 41), ('Bir Bouhouche', 41), ('Drea', 41), ('Haddada', 41), ('Hanencha', 41), ('Khedara', 41), ('Khemissa', 41), ('M''Daourouche', 41), ('Mechroha', 41), ('Merahna', 41), ('Ouled Driss', 41), ('Ouled Moumen', 41), ('Oum El Adhaim', 41), ('Ragouba', 41), ('Safel El Ouiden', 41), ('Sedrata', 41), ('Sidi Fredj', 41), ('Taoura', 41), ('Terraguelt', 41), ('Tiffech', 41), ('Zaarouria', 41), ('Zouabi', 41);
INSERT INTO city (name, wilaya_id) VALUES 
('Tipaza', 42), ('Ahmer El Ain', 42), ('Ain Tagourait', 42), ('Attatba', 42), ('Beni Milleuk', 42), ('Bou Ismaïl', 42), ('Bouharoun', 42), ('Bourkika', 42), ('Chaiba', 42), ('Cherchell', 42), ('Damous', 42), ('Douaouda', 42), ('Fouka', 42), ('Gouraya', 42), ('Hadjout', 42), ('Khemisti', 42), ('Kolea', 42), ('Larhat', 42), ('Menaceur', 42), ('Messelmoun', 42), ('Nador', 42), ('Sidi Amar', 42), ('Sidi Ghiles', 42), ('Sidi Rached', 42), ('Sidi Semiane', 42), ('Tipaza', 42);
INSERT INTO city (name, wilaya_id) VALUES 
('Mila', 43), ('Ahmed Rachedi', 43), ('Ain Beida Harriche', 43), ('Ain Mellouk', 43), ('Ain Tine', 43), ('Amira Arras', 43), ('Benyahia Abderrahmane', 43), ('Bouhatem', 43), ('Chigara', 43), ('Chelghoum Laid', 43), ('Derradji Bousselah', 43), ('El Mechira', 43), ('Elayadi Barbes', 43), ('Ferdjioua', 43), ('Grarem Gouga', 43), ('Hamala', 43), ('Mila', 43), ('Minar Zarza', 43), ('Oued Athmenia', 43), ('Oued Endja', 43), ('Oued Seguen', 43), ('Ouled Khalouf', 43), ('Rouached', 43), ('Sidi Khelifa', 43), ('Sidi Merouane', 43), ('Tadjenanet', 43), ('Tassadane Haddada', 43), ('Teleghma', 43), ('Terrai Bainen', 43), ('Tessala Lamatai', 43), ('Tiberguent', 43), ('Yahia Beni Guecha', 43), ('Zeghaia', 43);
INSERT INTO city (name, wilaya_id) VALUES 
('Aïn Defla', 44), ('Ain Benian', 44), ('Ain Bouyahia', 44), ('Ain Defla', 44), ('Ain Lechiakh', 44), ('Ain Soltane', 44), ('Ain Torki', 44), ('Arib', 44), ('Bathia', 44), ('Belaas', 44), ('Ben Allal', 44), ('Bir Ouled Khelifa', 44), ('Bordj Emir Khaled', 44), ('Boumedfaa', 44), ('Bourached', 44), ('Djelida', 44), ('Djemaa Ouled Cheikh', 44), ('El Abadia', 44), ('El Amra', 44), ('El Attaf', 44), ('El Hassania', 44), ('El Maine', 44), ('Hammam Righa', 44), ('Hoceinia', 44), ('Khemis Miliana', 44), ('Mekhatria', 44), ('Miliana', 44), ('Oued Chorfa', 44), ('Oued Djemaa', 44), ('Rouina', 44), ('Sidi Lakhdar', 44), ('Tacheta Zougagha', 44), ('Tarik Ibn Ziad', 44), ('Tiberkanine', 44), ('Zeddine', 44);
INSERT INTO city (name, wilaya_id) VALUES 
('Naâma', 45), ('Ain Ben Khelil', 45), ('Ain Safra', 45), ('Assela', 45), ('Djeniane Bourzeg', 45), ('El Biod', 45), ('Kasdir', 45), ('Makman Ben Amer', 45), ('Mecheria', 45), ('Moghrar', 45), ('Naama', 45), ('Sfissifa', 45), ('Tiout', 45);
INSERT INTO city (name, wilaya_id) VALUES 
('Aïn Témouchent', 46), ('Ain El Arbaa', 46), ('Ain Kihal', 46), ('Ain Témouchent', 46), ('Ain Tolba', 46), ('Aoubellil', 46), ('Beni Saf', 46), ('Bou Zedjar', 46), ('Chaabet El Leham', 46), ('Chentouf', 46), ('El Amria', 46), ('El Emir Abdelkader', 46), ('El Malah', 46), ('El Messaid', 46), ('Hammam Bou Hadjar', 46), ('Hassasna', 46), ('Hassi El Ghella', 46), ('Oued Berkeche', 46), ('Oued Sabah', 46), ('Ouled Boudjemaa', 46), ('Ouled Kihal', 46), ('Oulhaca El Gheraba', 46), ('Sidi Ben Adda', 46), ('Sidi Boumediene', 46), ('Sidi Ouriache', 46), ('Sidi Safi', 46), ('Tamzoura', 46), ('Terga', 46);
INSERT INTO city (name, wilaya_id) VALUES 
('Ghardaïa', 47), ('Berriane', 47), ('Bounoura', 47), ('Dhayet Bendhahoua', 47), ('El Atteuf', 47), ('El Guerrara', 47), ('El Meniaa', 47), ('Ghardaia', 47), ('Hassi Fehal', 47), ('Hassi Gara', 47), ('Mansoura', 47), ('Metlili', 47), ('Sebseb', 47), ('Zelfana', 47);
INSERT INTO city (name, wilaya_id) VALUES 
('Relizane', 48), ('Ain Rahma', 48), ('Ain Tarek', 48), ('Ammi Moussa', 48), ('Belassel Bouzegza', 48), ('Bendaoud', 48), ('Beni Dergoun', 48), ('Beni Zentis', 48), ('Dar Ben Abdellah', 48), ('Djidiouia', 48), ('El Guettar', 48), ('El Hamri', 48), ('El Hassi', 48), ('El Matmar', 48), ('El Ouldja', 48), ('Had Echkalla', 48), ('Hamri', 48), ('Kalaa', 48), ('Lahlef', 48), ('Mazouna', 48), ('Mediouna', 48), ('Mendes', 48), ('Merrah', 48), ('M''Cid', 48), ('Oued Essalem', 48), ('Oued Rhiou', 48), ('Ouled Aiche', 48), ('Ouled Sidi Mihoub', 48), ('Ramka', 48), ('Relizane', 48), ('Sidi Khettab', 48), ('Sidi Lazreg', 48), ('Sidi M''Hamed Ben Ali', 48), ('Sidi M''Hamed Benaouda', 48), ('Sidi Saada', 48), ('Souk El Had', 48), ('Yellel', 48), ('Zemmoura', 48);
INSERT INTO city (name, wilaya_id) VALUES 
('Timimoun', 49), ('Aougrout', 49), ('Charouine', 49), ('Deldoul', 49), ('Metarfa', 49), ('Ouled Aissa', 49), ('Ouled Said', 49), ('Talmine', 49), ('Timimoun', 49), ('Tinerkouk', 49);
INSERT INTO city (name, wilaya_id) VALUES 
('Bordj Badji Mokhtar', 50), ('Bordj Badji Mokhtar', 50), ('Timiaouine', 50);
INSERT INTO city (name, wilaya_id) VALUES 
('Ouled Djellal', 51), ('Douis', 51), ('Ouled Djellal', 51), ('Sidi Khaled', 51), ('Sidi Okba', 51);
INSERT INTO city (name, wilaya_id) VALUES 
('Béni Abbès', 52), ('Beni Abbes', 52), ('Igli', 52), ('Kerzaz', 52), ('Ouled Khoudir', 52), ('Tabelbala', 52), ('Tamtert', 52), ('Zaouia El Abidia', 52);
INSERT INTO city (name, wilaya_id) VALUES 
('In Salah', 53), ('In Salah', 53), ('Foggaret Ezzaouia', 53);
INSERT INTO city (name, wilaya_id) VALUES 
('In Guezzam', 54), ('In Guezzam', 54), ('Tin Zaouatine', 54);
INSERT INTO city (name, wilaya_id) VALUES 
('Touggourt', 55), ('Blidet Amor', 55), ('El Alia', 55), ('El Hadjira', 55), ('Megarine', 55), ('M''Naguar', 55), ('Nezla', 55), ('Sidi Slimane', 55), ('Taibet', 55), ('Tebesbest', 55), ('Touggourt', 55), ('Zaouia El Abidia', 55);
INSERT INTO city (name, wilaya_id) VALUES 
('Djanet', 56), ('Bordj El Haouas', 56), ('Djanet', 56);
INSERT INTO city (name, wilaya_id) VALUES 
('El M''Ghair', 57), ('El M''Ghair', 57), ('Oum Touyour', 57), ('Still', 57);
INSERT INTO city (name, wilaya_id) VALUES 
('El Meniaa', 58), ('El Meniaa', 58), ('Hassi Fehal', 58), ('Hassi Gara', 58);

INSERT INTO features (name) VALUES
('Android Auto'),
('Auto Pilot'),
('GPS Nav System'),
('Air Conditioner'),
('Heated Seats'),
('Sunroof'),
('Backup Camera'),
('Cruise Control');

INSERT INTO users (email, username, password, fname, lname, address, wilaya, city, zipcode, phone, account_status, phone_status, birthdate, role) VALUES
('admin@rental.com', 'admin', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Admin', 'User', '123 Main St', 'Algiers', 'Algiers', '16000', '+213550123456', TRUE, TRUE, '1980-01-15', 'Admin'),
('employee1@rental.com', 'emp1', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Karim', 'Benzema', '456 Oak Ave', 'Oran', 'Oran', '31000', '+213551123456', TRUE, TRUE, '1985-05-20', 'Employe'),
('client1@example.com', 'client1', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Mohamed', 'Zidane', '789 Pine Rd', 'Constantine', 'Constantine', '25000', '+213552123456', TRUE, TRUE, '1990-08-10', 'Client'),
('client2@example.com', 'client2', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Ali', 'Messi', '321 Elm St', 'Annaba', 'Annaba', '23000', '+213553123456', TRUE, FALSE, '1992-11-25', 'Client'),
('client3@example.com', 'client3', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Fatima', 'Ronaldo', '654 Maple Ave', 'Tizi Ouzou', 'Tizi Ouzou', '15000', '+213554123456', FALSE, FALSE, '1995-03-30', 'Client');

INSERT INTO users (email, username, password, fname, lname, address, wilaya, city, zipcode, phone, account_status, phone_status, birthdate, role, image) VALUES
('odaydid002@gmail.com', 'odaydid002', '$2b$10$YhK7bKZ3X9XPihdMHA07h.7Tin4kXIfG1sfa2Bcd4jElyy6HdIYHS', 'Oudai', 'Oulhadj', '110 Logement', 'El Menia', 'El Menia', '58001', '+213553728440', FALSE, FALSE, '2002-04-29', 'Client', 'https://res.cloudinary.com/dnzuqdajo/image/upload/v1743722872/profile_images/image-1743722869237.png');

-- Insert car brands
INSERT INTO brands (name, logo) VALUES
('Volkswagen', '/assets/cars/volkswagen.png'),
('Seat', '/assets/cars/seat.png'),
('BMW', '/assets/cars/bmw.png'),
('Audi', '/assets/cars/audi.png'),
('Skoda', '/assets/cars/skoda.png'),
('Peugeot', '/assets/cars/peugeot.png'),
('Hyundai', '/assets/cars/hyundai.png'),
('Kia', '/assets/cars/kia.png'),
('Ford', '/assets/cars/ford.png'),
('Chevrolet', '/assets/cars/chevrolet.png');

-- Insert office locations
INSERT INTO office (country, wilaya, city, address, open_time, close_time, latitude, longitude) VALUES
('Algeria', 'Algiers', 'Algiers', '123 Rue Didouche Mourad', '08:00:00', '22:00:00', 36.7538, 3.0588),
('Algeria', 'Oran', 'Oran', '456 Boulevard de la Soummam', '08:00:00', '22:00:00', 35.6971, -0.6337),
('Algeria', 'Constantine', 'Constantine', '789 Avenue Aissat Idir', '09:00:00', '21:00:00', 36.3650, 6.6147),
('Algeria', 'Annaba', 'Annaba', '101 Boulevard du 1er Novembre', '08:30:00', '21:30:00', 36.9009, 7.7567),
('Algeria', 'Tizi Ouzou', 'Tizi Ouzou', '202 Rue Abane Ramdane', '08:00:00', '20:00:00', 36.7167, 4.0500);

-- Insert vehicles
INSERT INTO vehicles (brand_id, model, fab_year, color, capacity, fuel, transmission, body, price, location, units, speed, horsepower, engine_type, rental_type) VALUES
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd'),
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd'),
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd'),
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd'),
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd'),
(1, 'Corolla', '2022', 'White', 5, 'Petrol', 'Automatic', 'Sedan', 3500.00, 1, 3, 180, 140, '4-Cylinder', 'd'),
(2, 'C-Class', '2020', 'Black', 5, 'Petrol', 'Automatic', 'Sedan', 8000.00, 1, 2, 230, 197, '4-Cylinder Turbo', 'h'),
(3, 'X5', '2024', 'Blue', 5, 'Petrol', 'Automatic', 'SUV', 12000.00, 2, 1, 250, 335, '6-Cylinder Turbo', 'd'),
(4, 'A4', '2010', 'Gray', 5, 'Petrol', 'Automatic', 'Sedan', 7500.00, 2, 2, 240, 190, '4-Cylinder Turbo', 'd'),
(5, 'Clio', '2018', 'Red', 5, 'Petrol', 'Manual', 'Hatchback', 2500.00, 3, 5, 185, 90, '3-Cylinder', 'h'),
(6, '3008', '2011', 'White', 5, 'Diesel', 'Automatic', 'SUV', 6000.00, 3, 2, 210, 180, '4-Cylinder Diesel', 'h'),
(7, 'Tucson', '2025', 'Silver', 5, 'Hybrid', 'Automatic', 'SUV', 5500.00, 4, 3, 195, 180, 'Hybrid', 'd'),
(8, 'Sportage', '1999', 'Black', 5, 'Diesel', 'Automatic', 'SUV', 5000.00, 4, 2, 200, 185, '4-Cylinder Diesel', 'h'),
(9, 'Mustang', '2002', 'Red', 4, 'Petrol', 'Automatic', 'Coupe', 15000.00, 5, 1, 250, 450, 'V8', 'd'),
(10, 'Spark', '2020', 'Yellow', 4, 'Petrol', 'Manual', 'Hatchback', 2000.00, 5, 4, 155, 98, '4-Cylinder', 'd');

-- Insert rentals
INSERT INTO rentals (user_id, vehicle_id, start_date, end_date, total_price, status) VALUES
(3, 1, '2023-06-01', '2023-06-05', 14000.00, 'completed'),
(3, 3, '2023-06-15', '2023-06-20', 60000.00, 'completed'),
(4, 2, '2023-07-01', '2023-07-03', 24000.00, 'completed'),
(4, 5, '2023-07-10', '2023-07-15', 12500.00, 'completed'),
(5, 7, '2023-08-01', '2023-08-07', 38500.00, 'pending'),
(3, 4, '2023-08-10', '2023-08-12', 15000.00, 'active'),
(4, 6, '2023-08-15', '2023-08-20', 30000.00, 'active');

-- Insert reviews
INSERT INTO reviews (user_id, vehicle_id, rental_id, stars, review) VALUES
(6, 1, 1, 1, 'Excellent car, very comfortable and fuel efficient. Would definitely rent again!'),
(3, 2, 2, 2, 'Great SUV with lots of power. Only complaint is the fuel consumption in city driving.'),
(4, 3, 3, 3, 'Luxury at its best. The Mercedes was perfect for our business trip.'),
(6, 4, 4, 5, 'Good basic car for city driving, but lacks power on highways.'),
(4, 5, 4, 5, 'Good basic car for city driving, but lacks power on highways.'),
(4, 4, 4, 4, 'Good basic car for city driving, but lacks power on highways.'),
(6, 3, 4, 3, 'Good basic car for city driving, but lacks power on highways.'),
(4, 2, 4, 2, 'Good basic car for city driving, but lacks power on highways.'),
(4, 1, 4, 1, 'Good basic car for city driving, but lacks power on highways.');

