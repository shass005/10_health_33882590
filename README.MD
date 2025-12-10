
# Clinic Management App

A web-based application for managing patients, appointments, and staff in a health clinic.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **EJS** - Embedded JavaScript templates that allow for dynamic HTML
- **CSS** - For styling and layout
- **MySQL** - Database for storing books, user data, and login history.
- **bcrypt** - Used to securely hash passwords
- **dotenv** - Used to manage environment variables securely.
- **express-validator & express-sanitizer** – Input validation and sanitization

## Features

### Routes
- Handles multiple routes such as:
  - `/` - Main page returning clinic name and links to other pages
  - `/about` - Clinic information page
  - /patient/add – Form to add new patients
  - `/patient/find` – Search for patients
  - `/patient/list` – View all patients
  - `/appointments/book` – Book appointments for registered patients
  - `/appointments/list` – List all appointments
  - `/users/register` – Patient registration page
  - `/users/login` – Login page
  - `/users/audit` – View login audit history
  - `/logout` – Logout

### User Registration and Login
- Users can register with a first name, last name, email, username, and password. The password is hashed using bcrypt before storing it in the database.
- Users can log in by providing a username and password. The system compares the hashed password with the stored hash to authenticate the user. Successful and failed login attempts are recorded in an audit table.

### Audit History
- Every attempt wether successful or failed is logged and the username and time are stored in the database along with wether the attemp failed or succeded.
- This is done by creating a seperate database table with the three columns, every time there is an attempted login, the username and attempt satus are added to the database.
- The `/users/audit` page displays the table with the complete audit history.

### styling
- External stylesheet to set style and format of the content

### dotenv configuration
- The dotenv module is used to load sensitive configuration variables like the database credentialsfrom an .env file, keeping them secure and out of exposure.
- This is done by including it in the `.gitignore` file.

### Data Validation & Security
- Input sanitization for text fields to prevent XSS and other attacks
- Input validation for registration and booking forms to ensure correct formatting

 ### API
 - `/api` – Fetches appointments as JSON
  - It allows for query parameters including: 
    - search: first or last name
    - date: sorts by date, first name, last name

## Getting Started

### Installation and Running

1. Clone the repository:

```bash
git clone https://github.com/shass005/06_berties_33882590.git
cd 06_berties_33882590
```
2. Install Node.js (if not already installed)
- Node.js installed (Download from [nodejs.org](https://nodejs.org))

3. Insall dependencied
```bash
npm install express
npm install ejs
np, install dotenv
npm install mysql2
npm install bcrypt
npm install express-validator
npm install express-sanitizer
npm install express-session
```
4. Create the .env file
```bash
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=clinic

HEALTH_HOST=localhost
HEALTH_USER=user
HEALTH_PASSWORD=password
HEALTH_DATABASE=health
HEALTH_BASE_PATH=http://localhost:8000
```

5. Load the database and insert data
```
mySQL:
SOURCE your/path/to/create_db.sql
SOURCE your/path/to/insert_test_data.sql
```

6. Run the Server
```bash
node index.js
```
7. Open your browser
Visit: http://localhost:8000
The webpage should be rendered