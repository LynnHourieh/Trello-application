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
PORT=8000 //backend port number
8. Right-click on the backend folder and open in the integrated terminal.
9. Run the backend server: npm run start
### Frontend Setup
1. Add .env file in the frontend directory.
2. Add the following value in .env: REACT_APP_URL=http://localhost:8000/api/ or any port number you choose for backend port. 
3. Right-click to open the terminal in the frontend folder.
4. Start the frontend server:npm run start
### Enjoy your application!

