# Quabtech Assingment
Nodejs project with Postgre sql database
to run this project smoothly you need to follow the steps given below:-
step 1 -  download thezip folder from the github profile 
step 2-  afterdownloading unzip the folder and open the terminal integrated to that folder
step 3 - now run thecommand npm install to download all the dependencies shown in the package.json file
step 4 - now open the file server.js and edit some data here according to your postgre SQL databse
            const pool = new Pool({
            user: 'user_name',
            host: 'localhost',
            database: 'databse_name',
            password: 'password',
            port: 5432, // Default PostgreSQL port
           });
step 5 - now after entering the specific details run the server.js file using the command npm run-after running the data will be fetched from 
         the api and will be stroed into the postgre databse
step 6 - now go to the index.html page and run the project , the desied fronthend and the data from the backend will be dispalyed there 
         successfully.
