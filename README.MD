
# Berties_Books App

A simple Express.js web application that manages books in an online store.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **EJS** - Embedded JavaScript templates that allow for dynamic HTML
- **CSS** - For styling and layout
- **MySQL** - Database for storing books, user data, and login history.
- **bcrypt** - Used to securely hash passwords
- **dotenv** - Used to manage environment variables securely.

## Features

### Routes
- Handles multiple routes such as:
  - `/` - Main page returning shop name and links to other pages
  - `/about` - Simple about page
  - `/search` - Search page where users can search for books by name.
   - `/search-result` - Shows the result of the search submission
   - `/register` - Registration page with a form for user details
   - `/registered` - Shows a success message after user registration.
   - `/login` -  login page
   - `/loggedin` - Shows success or failure message after login attempt.
   - `/bargainbooks` - Shows books under £20.
   - `/addbook` - Allows users to add books.
   - `/bookadded` - Shows validation message when books are added to the database.
   - `/list` - Shows list of books in the database.
   - `/audit` - Shows audit history.

### User Registration and Login
- Users can register with a first name, last name, email, username, and password. The password is hashed using bcrypt before storing it in the database.
- Users can log in by providing a username and password. The system compares the hashed password with the stored hash to authenticate the user. Successful and failed login attempts are recorded in an audit table.

### Audit History
- Every attempt wether successful or failed is logged and the username and time are stored in the database along with wether the attemp failed or succeded.
- This is done by creating a seperate database table with the three columns, every time there is an attempted login, the username and attempt satus are added to the database.
- The `/users/audit` page displays the table with the complete audit history.

### Styling
- External stylesheet to set style and format of the content

### dotenv configuration
- The dotenv module is used to load sensitive configuration variables like the database credentialsfrom an .env file, keeping them secure and out of exposure.
- This is done by including it in the `.gitignore` file.

### Input Sanitisation
- Fields:
 - First Name
 - Last Name
 - Email 
 - Book Addition Entries
- Why:
 - Because these fields are render as texts. Sanitising them converts them into plain text so any script inserted is not run.

 ### Input Validation
- Fields:
 - Registration Page:
  - Password should be between 8 and 20 characters
  - Email must be in valid format
  - Username should be between 5 and 20 characters
 - Login Page
  - Username field should not be empty
  - Password field should not be empty
- Why:
 - In order to prevent invalid entries from being inserted into the database and to ensure user submition is in correct format.

 ### Search Terms in API
 - http://localhost:8000/api/books:
 - This router endpoint lets you fetch the list of books from the SQL database. You can filter, search, and sort the results using the following query parameters:
 - http://localhost:8000/api/books?search=world:
 - Filter books whose name contains the given keyword
 - http://localhost:8000/api/books?minprice=5&max_price=20:
 - Filter books whose price falls within the given price range
 - http://localhost:8000/api/books?sort=name:
 - Filter books in alphabeticall order 
 - http://localhost:8000/api/books?sort=price:
 - Filter books by price in descending order

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
DB_NAME=berties_books
```
5. Run the Server
```bash
node index.js
```
6. Open your browser
Visit: http://localhost:8000
The webpage should be rendered
