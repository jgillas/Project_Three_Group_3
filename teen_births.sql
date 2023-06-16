DROP TABLE IF EXISTS teen_births;

CREATE TABLE teen_births (
  	year INT NOT NULL,
  	state VARCHAR(45) NOT NULL,
	age_group VARCHAR(45) NOT NULL,
	state_rate DECIMAL NOT NULL,
	state_births VARCHAR(45) NOT NULL,
	us_births VARCHAR(45) NOT NULL,
	us_birth_rate DECIMAL NOT NULL,
	unit VARCHAR(45) NOT NULL
);