# Hostel Management System
It is a MERN stack application built for ease of hostel management.

## Features

- [x] Login/Signup
- [x] Admin Panel
    - Registration of new students
    - Marking attendance
    - Handeling complaints
    - Managing mess
    - Generating invoices
    - Handeling suggestions
- [x] Student Panel
    - Viewing attendance
    - Requesting mess off
    - Viewing invoices
    - Making complaints
    - Making suggestions
     
## Project Screenshot
![image](https://github.com/user-attachments/assets/4f4edef5-2524-449d-a024-614b7756157e)
![image](https://github.com/user-attachments/assets/e808b5e7-b053-491f-9fd3-8e4c692484f3)
![image](https://github.com/user-attachments/assets/30952d47-3ae1-46ad-b055-6b7fc0d614f5)
![image](https://github.com/user-attachments/assets/0a9b4eca-75c5-401e-8bd9-9337a9ef4dd8)
![image](https://github.com/user-attachments/assets/6544d72a-716c-4fb9-a9f4-7430f6cf5dcf)
![image](https://github.com/user-attachments/assets/b694235b-de00-4998-999b-5eb7b764ffa2)

## Installation
Install [Node.js](https://nodejs.org/en/download) and [MongoDB](https://www.mongodb.com/try/download/community) on your system.

Clone the repository and install the dependencies.
```sh
cd client
npm i
```
```sh
cd ../server
npm i
```

```sh
cd ../
npm i -g concurrently
```

## Setup DB
- Create a mongodb database named `hostel`
- Create collections and given names like for `hostel.users.json` --> `users` in mongoCollections
- Add data by importing file like `hostel.users.json`

## Usage

```sh
npm run dev
```

## Login Details
- AdminLogin
    - ayushmistri0203@gmail.com
    - Password: Ayush@0309
- Login
    - nand@gmail.com
    - Password: nand1234

## Add .env file in backend folder with following content
```
MONGO_URI="mongodb://127.0.0.1:27017/hostel"
```

## Contributing

Contributions are always welcome!😊



