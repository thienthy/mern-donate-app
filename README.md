# mern-myshop

Env Variables
Create a .env file in then root and add the following
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongo uri
JWT_SECRET = secret
ADMIN_EMAIL = email id of the account used to send the verification email
ADMIN_EMAIL_PASSWORD = password for the account used to send the verification email
GOOGLE_CLIENT_ID = google client id for using gmail along with nodemailer
GOOGLE_CLIENT_SECRET = google client secret for using gmail along with nodemailer
STRIPE_SECRET_KEY = stripe secret key for accepting credit/debit card payments
FRONTEND_BASE_URL = http://localhost:3000
Create a .env file in then client folder and add the following
REACT_APP_STRIPE_PUBLIC_KEY = stripe public key for accepting credit/debit card payments

Install Dependencies (client & server)
npm install
cd client
npm install

Seed Database
You can use the following commands to seed the database with some sample users and products as well as destroy all data # Import data
npm run data:import

    # Destroy data
    npm run data:destroy

    Sample User Logins
    doanthy@gmail.com (Admin)
    123456
