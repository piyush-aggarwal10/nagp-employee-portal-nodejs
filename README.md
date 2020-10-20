# nagp-employee-portal-nodejs


Piyush Aggarwal
3147205
piyush.aggarwal02@nagarro.com

Revision History
Version	Date	Author/Contributor	Comments
0.1	18-10-2020	Piyush Aggarwal	First version

Tools/Packages:
•	Node.js, Express.js for creating application
•	EJS for frontend pages
•	Chai, Mocha for testing
•	Formidable for uploading profile picture
•	MongoDB for database operations
•	Passport js, jwt token for authentication and authorization
•	Bcrypt for password encryption

APIs:
Employee, Manager API List:
•	Register new user: http://localhost:3000/users/register (POST)
•	Login existing user: http://localhost:3000/users/login (POST)
Job Opening API List:
•	Create an Opening: http://localhost:3000/jobs/add (POST)
•	Update an Opening - update status to close: http://localhost:3000/jobs/update/:id (PUT)
•	Apply for Opening: http://localhost:3000/jobs/apply/:id (PUT)
•	Available Openings: http://localhost:3000/jobs (GET)
•	Details of an Opening: http://localhost:3000/jobs/:id (GET)

Commands:
•	To run application: npm run start-dev
•	To run tests: npm test

Test Cases: As mentioned in the assignment question, 1 test case has been written for each API.


