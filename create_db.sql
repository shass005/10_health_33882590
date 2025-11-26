# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the application user 
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' 
IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';


# Create Books tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

# Create the User tables
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id));

# Create an audit table
CREATE TABLE IF NOT EXISTS audit(
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN,
    PRIMARY KEY(id));