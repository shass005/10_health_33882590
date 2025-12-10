# Insert data into the tables

USE clinic;

INSERT INTO patients (first_name, last_name, dob)
VALUES
('John', 'Smith', '1980-05-10'),
('Sarah', 'Johnson', '1991-09-02');

INSERT INTO staff (first_name, last_name, email, username, password)
values ('gold', 'smiths', 'gold@smiths.ac.uk', 'gold','$2b$10$iN0cBkkuNqVdrxp2bQ0y5.GPDbnkauTUYDzBM0BdRk/43N3JLJgQW');

INSERT INTO appointments (first_name, last_name, date, time)
VALUES ('john', 'doe', '2025-12-12', '09:00'), ('jane', 'doe', '2025-12-13', '10:00');

