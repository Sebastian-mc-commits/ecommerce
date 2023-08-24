CREATE TABLE locations (
  id VARCHAR(150) NOT NULL,
  location VARCHAR (200) NOT NULL,
  city VARCHAR (100) NOT NULL,
  country VARCHAR (100) NOT NULL,
  locationDescriptions VARCHAR (200),
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id VARCHAR(150) NOT NULL,
  image VARCHAR(255) NOT NULL,
  email VARCHAR (100) NOT NULL UNIQUE,
  provider VARCHAR (20) NOT NULL,
  password VARCHAR (200),
  name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20),
  location VARCHAR(150),
  CONSTRAINT FOREIGN KEY (location) REFERENCES locations(id) ON DELETE CASCADE,
  PRIMARY KEY(id)
);

CREATE TABLE products (
  id VARCHAR(150) NOT NULL,
  title VARCHAR(20) NOT NULL,
  description VARCHAR(100) NOT NULL,
  price FLOAT NOT NULL,
  thumbnail VARCHAR(255) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  stock INT NOT NULL,
  status BOOLEAN NOT NULL,
  createdBy VARCHAR(150) NOT NULL,
  categoryType VARCHAR(30) NOT NULL,
  CONSTRAINT FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE,
  isDeleted BOOLEAN NOT NULL DEFAULT 0,
  deletedAt TIMESTAMP,
  CONSTRAINT CHECK (price >= 0),
  PRIMARY KEY (id)
);

CREATE TABLE comments (
  id VARCHAR(150) NOT NULL,
  rate INT(1) NOT NULL,
  message VARCHAR(200) NOT NULL,
  userCreator VARCHAR(150) NOT NULL,
  productReference VARCHAR(150) NOT NULL,
  CONSTRAINT FOREIGN KEY (productReference) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (userCreator) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT CHECK(rate BETWEEN 0 AND 5),
  PRIMARY KEY (id)
);

CREATE TABLE admins (
  id VARCHAR(150) NOT NULL,
  adminType ENUM("admin", "superAdmin") NOT NULL,
  admin  VARCHAR(150) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (admin) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE deletedProducts (
  adminId VARCHAR(150) NOT NULL,
  productDeleted VARCHAR(150) NOT NULL,
  CONSTRAINT PRIMARY KEY(adminId, productDeleted),
  CONSTRAINT FOREIGN KEY (productDeleted) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE usersSetToAdmins (
  adminId VARCHAR(150) NOT NULL,
  userSetToAdmin VARCHAR(150) NOT NULL,
  CONSTRAINT PRIMARY KEY(adminId, userSetToAdmin),
  CONSTRAINT FOREIGN KEY (userSetToAdmin) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart (
  userId VARCHAR(150) NOT NULL,
  productReference VARCHAR(150) NOT NULL,
  CONSTRAINT PRIMARY KEY (userId, productReference),
  CONSTRAINT FOREIGN KEY (productReference) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id VARCHAR(150) NOT NULL,
  sender_id VARCHAR(150) NOT NULL,
  to_user_id VARCHAR(150) NOT NULL,
  message VARCHAR(255) NOT NULL,
  dateSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id VARCHAR(150) NOT NULL,
  userId VARCHAR(150) NOT NULL,
  productsPurchased VARCHAR(150) NOT NULL,
  isDeliverSet BOOLEAN NOT NULL,
  CONSTRAINT FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (productsPurchased) REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

--Not still
CREATE TRIGGER deleteProduct
BEFORE DELETE ON
products
FOR EACH ROW

BEGIN
  DECLARE existAdmin INT;

  SELECT COUNT(*) INTO existAdmin FROM admins WHERE admin = OLD.ID;

  IF existAdmin > 0 THEN
    UPDATE products SET isDeleted = 1,
    deletedAt CURRENT_TIMESTAMP WHERE id = OLD.id;
  END IF;

END