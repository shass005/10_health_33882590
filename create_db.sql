CREATE DATABASE IF NOT EXISTS health;

# Create the application user 

CREATE USER IF NOT EXISTS 'health_app'@'localhost' 
IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';

USE health;

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date DATE,
    time VARCHAR(10),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(50) UNIQUE,
    last_name VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    PRIMARY KEY(id)
);

# Create an audit table
CREATE TABLE IF NOT EXISTS audit(
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN,
    PRIMARY KEY(id));