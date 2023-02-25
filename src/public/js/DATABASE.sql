CREATE TABLE ESTUDIO(
ID_ESTUDIO VARCHAR(20) PRIMARY KEY,
NOMBRE VARCHAR(25) NOT NULL);

CREATE TABLE ACTOR(
ID_ACTOR int AUTO_INCREMENT PRIMARY KEY,
NOMBRES VARCHAR(25) NOT NULL,
APELLIDOS VARCHAR(25) NOT NULL);

CREATE TABLE PELICULA(
ID_PELICULA INT AUTO_INCREMENT PRIMARY KEY,
NOMBRE VARCHAR(25) NOT NULL,
ANNO_GRABACION INT NOT NULL,
ID_ESTU VARCHAR(20),
CONSTRAINT FOREIGN KEY(ID_ESTU) REFERENCES ESTUDIO(ID_ESTUDIO) NOT NULL, 
);

CREATE TABLE ACTUA(
ID_ACT INT,
CONSTRAINT FOREIGN KEY(ID_ACT) REFERENCES ACTOR(ID_ACTOR),
ID_PELI INT,
CONSTRAINT FOREIGN KEY(ID_PELI) REFERENCES PELICULA(ID_PELICULA), 
);

INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Angelina', 'Jolie');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Leonardo', 'Dicaprio');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Robin', 'Williams');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Sasha', 'Grey');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Dwayne', 'Johnson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Johnny', 'Depp');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Robert', 'Downey');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Denzel', 'Washington');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Channing', 'Tatum');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Keanu', 'Reeves');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Chris', 'Evans');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Bruce', 'Willis');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Jim' , 'Carrey');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Dakota', 'Johnson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Jennifer', 'Lawrence');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Mel', 'Gibson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Lily', 'Collins');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Scarlett', 'Johansson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Shailene', 'Woodley');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Josh', 'Hutcherson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Sylvester', 'Stallone');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Anne', 'Hathaway');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Robert', 'De Niro');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Richard', 'Gere');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Ryan', 'Reynolds');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Tom', 'Cruise');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Nicolas', 'Cage');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Bradley', 'Cooper');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Matt' , 'Damon');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Marlon', 'Wayans');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Samuel', 'Jackson');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Kevin', 'Costner');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Salvo', 'Basile');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Juana', 'Acosta');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Valentina', 'Acosta');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Marcela', 'Agudelo');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Santiago', 'Alarcón');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Gustavo', 'Angarita');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Marcela', 'Angarita');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Diana', 'Angel');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Gustavo', 'Angel');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Jimena', 'Angel');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Juan', 'Angel');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Silvio', 'Angel');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Luigi', 'Aycardi');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Patrick', 'Delmas');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Tiberio', 'Cruz');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Isabela', 'Cordoba');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Ximena', 'Cordoba');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Lorna', 'Cepeda');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Angie', 'Cepeda');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Manolo', 'Cardona');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Jorge', 'Cardenas');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Jorge', 'Cao');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Robinson', 'Diaz');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Enrique', 'Carriazo');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Agmeth', 'Escaf');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Carolina', 'Gómez');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Andrea', 'Guzman');
INSERT INTO ACTOR (NOMBRES, APELLIDOS) VALUES ('Zharick', 'Leon');

/* Insertamos datos en la tabla ESTUDIO */
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0001','Ghibli');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0002','New Line Cinema');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0003','Lucasfilms');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0004','Sogecine');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0005','Argentina Sono Film');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0006','Atlas Corporation Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0007','Barrandov Studios ');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0008','Cifesa España');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0009','Cinecitta Italia');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0010','Colombia Film Company');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0011','Columbia Pictures');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0012','Daiei Film Co');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0013','Estudios Churubusco');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0014','Filmófono España');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0015','Hengdian World Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0016','Lumiton Cinematográfica');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0017','Mosfilm Rusia');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0018','Pinewood Studios Inglaterra');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0019','RKO Pictures ');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0020','Universum Film AG');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0021','Village Roadshow Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0022','NBC Universal');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0023','WarnerMedia');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0024','Walt Disney Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0025','Sony Pictures');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0026','Fox');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0027','Universal Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0028','Paramount Studios');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0029','NBCUniversal');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0030','Century Fox');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0031','Warner Bros');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0032','WarnerMedia');
INSERT INTO ESTUDIO (ID_ESTUDIO, NOMBRE) VALUES ('0033','Metro-Goldwyn-Mayer ');

/* Insertamos datos en la tabla PELICULA */
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La guerra de las galaxias', '1977', "0001");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El señor de los anillos 1', '2001', "0002");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Mar Adentro', '2004', "0003");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El viaje de Chihiro', '2001', "0003");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Buscando a Nemo', '2003', "0004");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Ciudad de Dios', '2002', "0005");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La lista de Schindler', '1993', "0006");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La mosca', '1986', "0007");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('E.T. El extraterrestre', '1982', "0008");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El sustituto', '2002', "0009");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El Señor de los Anilllos', '2003', "0010");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Kandahar', '2001', "0011");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La mirada de Ulises', '1995', "0012");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Chunking Express', '1994', "0013");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Drunken Master II', '1994', "0014");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Pulp Fiction', '1994', "0015");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Francotirador', '2010', "0016");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Sin Perdón', '1992', "0017");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Uno de los nuestros', '1990', "0018");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Muerte entre las flores', '1990', "0019");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El decálogo', '1989', "0020");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Nakayan', '1987', "0021");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El cielo sobre Berlín', '1987', "0022");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La mosca', '1986', "0023");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El detective cantante', '1986', "0024");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Brazil', '1985', "0025");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La Rosa púrpura del Cairo', '1985', "0026");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Blade Runner', '1992', "0027");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('E.T. El extraterrestre', '1982', "0028");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Mi tío de América', '1980', "0029");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Toro salvaje', '1980', "0030");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La Guerra de las Galaxias', '1977', "0031");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Taxi Driver', '1976', "0032");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Barry Lyndon', '1975', "0033");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La noche americana', '1973', "0033");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El Padrino III', '1974', "0001");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Érase una vez en América', '1968', "0002");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Star Wars: El imperio contraataca', '1980', "0003");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Indiana Jones: En busca del arca perdida', ' 1981', "0004");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Los cazafantasmas', '1984', "0005");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Independence day', '1996', "0006");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Titanic', '1997', "0007");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Salvar al soldado Ryan', '1998', "0008");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El Grinch', '2000', "0009");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Regreso al futuro', '1985', "0010");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Top Gun', '1986', "0011");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Rain Man', '1988', "0012");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Batman', '1989', "0013");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('La Bella y la Bestia', '1991', "0014");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Aladdin', '1992', "0015");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Forrest Gump', '1994', "0016");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Toy Story', '1995', "0017");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Harry Potter y la Piedra Filosofal', '2001', "0018");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('Harry Potter y la Cámara Secreta', '2002', "0019");
INSERT INTO PELICULA (NOMBRE, ANNO_GRABACION, ID_ESTU) VALUES ('El señor de los anillos: El retorno del rey', '2003', "0020");


INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (1,  20);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (2,  10);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (3,  17);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (4,  22);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (5,  30);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (6,  31);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (7,  47);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (8,  48);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (9,  49);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (10, 50);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (11, 51);
INSERT INTO ACTUA(ID_ACT, ID_PELI) VALUES (12, 52);

CREATE TABLE PAGOS(
ID_PAGO INT AUTO_INCREMENT PRIMARY KEY,
V_PAGO MONEY NOT NULL,
ID_ACT INT,
CONSTRAINT FOREIGN KEY(ID_ACT) REFERENCES ACTOR(ID_ACTOR) NOT NULL
);

INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(500000, 1, DATE_ADD(current_timestamp, INTERVAL 2 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(600000, 5, DATE_ADD(current_timestamp, INTERVAL 3 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(800000, 10,DATE_ADD(current_timestamp, INTERVAL 1 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(300000, 15,DATE_ADD(current_timestamp, INTERVAL 4 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(1000000, 20,DATE_ADD(current_timestamp, INTERVAL 5 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(400000, 25,DATE_ADD(current_timestamp, INTERVAL 6 MONTH));
INSERT INTO PAGOS(V_PAGO, ID_ACT, FECHA_PAGO) VALUES(300000, 30,DATE_ADD(current_timestamp, INTERVAL 7 MONTH));

SELECT DATE_FORMAT("2023-05-09", "%Y");
SELECT DATE_FORMAT(current_timestamp, "%Y");
SELECT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 YEAR);
SELECT DATEDIFF(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 YEAR), CURRENT_TIMESTAMP );

-- bear minoxidin;