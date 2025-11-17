# 🏋️‍♂️ Akhada – Gym Management System

Akhada is a modern, full-stack **Flask + Supabase** Gym Management System offering seamless portals for **Guests, Members, Trainers, and future Admin access**.
It handles memberships, bookings, classes, QR-based guest passes, health tracking, and trainer workflows — all in one unified platform.

---

## 📌 Core Features

---

### 🔓 **Guest Portal**

* Explore gym info, services, and pricing
* Request **One-Day Guest Pass**
* OTP verification
* Auto-generated **QR code** for entry

---

### 🧑‍🎓 **Member Portal**

* Personal Dashboard
* Update profile & preferences
* **Health Dashboard** (BMI, calorie goals, progress tracking)
* **Workout Generator** (experience, goals, muscle group based)
* View available classes
* **Book group classes or PT sessions**

  * Capacity checks
  * Membership plan limits enforced

---

### 🏋️‍♂️ **Trainer Portal**

* View assigned clients
* Manage schedules
* Calendar view of bookings
* Create, edit, and manage group classes

---

### 🛡️ **Admin Tools (Future Upgrade)**

* Manage members
* Manage trainers
* Manage payments
* Oversee classes & check-ins

---

## 🧰 Tech Stack

| Layer                 | Technology                             |
| --------------------- | -------------------------------------- |
| **Backend**           | Python (Flask Framework)               |
| **Database**          | Supabase (PostgreSQL)                  |
| **Frontend**          | HTML (Jinja2 templates) + Tailwind CSS |
| **Interactivity**     | JavaScript                             |
| **QR Code Generator** | qrcode.js                              |
| **Deployment**        | Vercel (via `vercel.json`)             |
| **Containerization**  | Docker                                 |

---

## 📂 Project Structure

```
Akhada/
├── app.py
├── requirements.txt
├── runtime.txt
├── Dockerfile
├── vercel.json
├── static/
│   ├── css/
│   ├── images/
│   └── js/
├── templates/
│   ├── guest_portal.html
│   ├── login.html
│   ├── signup.html
│   ├── member_*.html
│   ├── trainer_*.html
│   ├── admin_*.html
│   └── base.html
└── venv/
```

---

## 🚀 Local Installation

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/yourusername/akhada.git
cd akhada
```

### **2️⃣ Create Virtual Environment**

```bash
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
```

### **3️⃣ Install Dependencies**

```bash
pip install -r requirements.txt
```

### **4️⃣ Add Environment Variables**

Create a `.env` file:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_api_key
FLASK_ENV=development
FLASK_APP=app.py
```

### **5️⃣ Run the App**

```bash
flask run
```

App will be live at:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🐳 Docker Support

```bash
docker build -t akhada .
docker run -p 5000:5000 akhada
```

---

## 🌐 Deployment (Vercel)

1. Push project to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Ensure `vercel.json` is correct
5. Deploy 🚀

---

## 🔮 Future Enhancements

* Full Admin Dashboard
* Email/SMS notifications
* Wearable API integration (FitBit, Apple Health)
* Advanced analytics dashboard
* Automated membership tiers

---

## 📄 License

MIT License — free to use and contribute.

---


