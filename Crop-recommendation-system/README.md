# 🌾 Farm Easy — Intelligent Crop Recommendation System

**Farm Easy** is a Machine Learning–powered crop recommendation platform that helps farmers predict the most suitable crop for their soil and environmental conditions.  
It integrates:
- 🌱 Flask (Python) for ML and data handling  
- 🔐 Node.js (Express) for authentication  
- 💻 React for the user interface  
- 🗄️ MySQL for data storage

---

## 🗂️ Project Structure

```
Farm-Easy/
├── backend/
│   ├── app.py                      # Flask ML backend (crop prediction + DB)
│   ├── farm.pkl                    # Trained ML model
│   ├── minmaxscaler.pkl
│   ├── standscaler.pkl
│   ├── templates/
│   │   └── index.html              # Flask frontend page
│   └── static/
│       ├── image.jpg
│       ├── icon.png
│       └── Plant Images/           # Crop images
│
├── node-auth/
│   ├── routes/
│   │   └── authRoutes.js           # User login/register + Flask session link
│   ├── config/
│   │   └── db.js                   # MySQL connection config
│   ├── views/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── app.js                      # Node.js server entry
│   ├── package.json
│   └── .env                        # Database credentials and secret
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # React entry
│   │   └── components/
│   │       ├── cropStepper.jsx     # Step-by-step crop guide
│   │       ├── Notification.jsx
│   │       └── stepperc.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- **Python 3.9+**
- **Node.js 18+**
- **MySQL Server**
- **pip** and **npm**

---

## 🧠 Database Setup (MySQL)

1. Start MySQL:

   ```bash
   mysql -u root -p
   ```

2. Create a database:

   ```sql
   CREATE DATABASE crop_recommendation;
   USE crop_recommendation;
   ```

3. Create tables:

   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE crop_progress (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255),
       crop VARCHAR(255),
       step VARCHAR(255),
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Verify tables:

   ```sql
   SHOW TABLES;
   ```

---

## 🧩 Backend 1 — Flask (ML + Database)

### Install dependencies

```bash
cd backend
pip install flask flask-session flask-cors numpy mysql-connector-python pickle-mixin
```

### Configure database credentials

In **`app.py`**, update:

```python
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_MYSQL_PASSWORD",
        database="crop_recommendation"
    )
```

### Run Flask

```bash
python app.py
```

Flask runs at → **http://127.0.0.1:5000/**

---

## 🔐 Backend 2 — Node.js (Authentication)

### Install dependencies

```bash
cd node-auth
npm install
```

### Create `.env` file

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_MYSQL_PASSWORD
DB_NAME=crop_recommendation
SESSION_SECRET=your-secret-key
```

### Run Node server

```bash
npm start
```

Node.js runs at → **http://127.0.0.1:3000/**

---

## 💻 Frontend — React

### Install dependencies

```bash
cd frontend
npm install
```

### Run React app

```bash
npm run dev
```

React runs at → **http://127.0.0.1:5173/**

---

## 🚀 Running the Full System

1. **Start MySQL server**
2. **Run Node.js backend:**
   ```bash
   cd node-auth
   npm start
   ```
3. **Run Flask ML backend:**
   ```bash
   cd backend
   python app.py
   ```
4. **Run React frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
5. Open **http://127.0.0.1:3000/** to login/register  
   After login, user is redirected to **http://127.0.0.1:5000/index**

---

## 🧱 Features

✅ User Authentication (Node + MySQL)  
✅ ML Crop Prediction (Flask)  
✅ Crop Stored in Database  
✅ Auto-load Last Crop for User  
✅ Stepper Component to Track Progress (React)  

---

## 🧰 Technologies Used

| Layer | Stack |
|-------|--------|
| Frontend | React + Vite + Tailwind |
| Authentication | Node.js + Express + MySQL |
| ML Backend | Flask + Python + Scikit-learn |
| Database | MySQL |

## 🧑‍💻 Author

**Vishal** 

🚀 Full Stack Developer 
📧 Contact:nkvishal21@gmail.com
💻 Linkedin:https://www.linkedin.com/in/vishal-n-k-5a017b2b6

## 🪄 Quick Summary

| Component | Start Command | URL |
|------------|----------------|----|
| Node Auth | `npm start` | http://127.0.0.1:3000 |
| Flask ML | `python app.py` | http://127.0.0.1:5000 |
| React Frontend | `npm run dev` | http://127.0.0.1:5173 |

---

## 🧩 Troubleshooting

| Issue | Solution |
|--------|-----------|
| `Authentication plugin 'caching_sha2_password' is not supported` | Run: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';` |
| Flask not detecting user session | Ensure `/set_session` route is hit successfully during login |
| Crop not stored | Check if `crop_progress` table exists and columns match |
| React not showing crop | Ensure `/get_last_crop` Flask endpoint returns correct value |

---

