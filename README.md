# Trello-application
It's basically a Trello-like board, where you can manage tasks that you need to do.

## Instructions
1. Clone the repository:
git clone https://github.com/LynnHourieh/Trello-application.git
2. Open PostgreSQL DB and create a new database:
Create a database, e.g., trello.

3. Download 'trello.sql' file from the repo:
This file contains the schema and dummy data for your application.

4. Open SQL Shell and import the file:
example : \i 'C:/Users/Lenovo/Desktop/trello.sql'
###  Backend Setup
5. Open the project in VS Code.
6. Add .env file in the backend directory.
7. Fill these values in .env:
DB_USER=//your_db_user
DB_HOST= //database host
DB_DATABASE= //database name 
DB_PASSWORD=//your_db_password
DB_PORT=//your_db_port usually :5432 
PORT=8000 //Backend port number
8. Right-click on the backend folder and open in the integrated terminal.
9. Run the backend server: npm run start
### Frontend Setup
1. Right-click to open the terminal in the frontend folder.
2. Start the frontend server:npm run start

ScreenShots and Postman Docs are added to repository.
### Enjoy your application!

