CREATE TABLE IF NOT EXISTS prospects (
  id serial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL UNIQUE,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  phone text UNIQUE,
  date_created date DEFAULT CURRENT_DATE
); 

CREATE TABLE IF NOT EXISTS clients (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  date_created date DEFAULT CURRENT_DATE,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE

);

CREATE TABLE IF NOT EXISTS targets (
  id serial PRIMARY KEY, 
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  phone text,
  owner text NOT NULL REFERENCES clients (username) ON DELETE CASCADE
); 

