# 🌸 EmpowerHer - MERN Stack Community & Mentorship Platform

EmpowerHer is a specialized web ecosystem designed to champion women's growth, safety, and professional development. The platform facilitates professional mentorship, provides a verified legal and career resource library, offers a moderated community forum, and features an AI-integrated support chatbot.

---

## 👥 Group Details (SLIIT - Y3S1)

* **Group ID:** [Group-SE-22-AF]  
* **[Member 1] ([IT 23765474])** - User Authentication & Mentor Management
* **[Member 2] ([IT 23538764])** - Community Forum & Gemini API Intergration
* **[Member 3] ([IT 23631588])** - Resource Management & External API Integrations   
* **[Member 4] ([IT 23715660])** - Report Management & News API Integrations  

---

## 🚀 Setup & Installation

### 📌 Prerequisites
- Node.js v18.0.0 or higher  
- MongoDB Atlas (Cloud)  
- `.env` file in `/Backend`  

---

### ⚙️ Installation Steps

```bash
# 1. Clone repository
git clone [YOUR_GITHUB_REPOSITORY_LINK]
cd Y3S1-group-project

# 2. Setup Backend
cd Backend
npm install

# 3. Setup Environment Variables (.env inside Backend)
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_phrase
GEMINI_API_KEY=your_google_gemini_api_key
NEWS_API_KEY=your_newsapi_org_key
BREVO_API_KEY=your_brevo_smtp_key

# 4. Setup Frontend
cd ../Frontend
npm install


## 📚 API Endpoints Overview

---

## 1. Authentication & User Management

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | User login |
| GET  | /api/auth/mentors | Public | Get all verified mentors |

| POST | /api/auth/forgot-password | Public | Send OTP for password reset |
| POST | /api/auth/reset-password | Public | Reset password using OTP |

| POST | /api/auth/select-mentor | Protected | Choose a verified mentor |

| GET  | /api/auth/profile | Protected | Get logged-in user profile |
| PUT  | /api/auth/profile | Protected | Update logged-in user profile |

| GET  | /api/auth/users | Admin | Get all users |
| PUT  | /api/auth/verify-mentor/:id | Admin | Verify a mentor account |
| DELETE | /api/auth/user/:id | Admin | Delete a user |

---

## 2. Appointments (Mentorship)

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| POST | /api/appointments/ | Protected | Create availability slot (mentor) or book session |
| GET  | /api/appointments/ | Protected | Get appointments for logged-in user |

| GET  | /api/appointments/my-sessions | Protected | Get booked sessions (mentee) |

| PATCH | /api/appointments/:id | Protected | Update appointment status |
| DELETE | /api/appointments/:id | Protected | Cancel or delete appointment |

| GET  | /api/appointments/available/:mentorId | Protected | Get available mentor slots |
| PATCH | /api/appointments/:id/book | Protected | Book an available slot |

---

## 3. Resource Library

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| GET  | /api/resources/ | Public | Get resources (filter + pagination) |
| POST | /api/resources/ | Admin | Create new resource |

| PUT  | /api/resources/:id | Admin | Update resource |
| DELETE | /api/resources/:id | Admin | Delete resource |

| POST | /api/resources/share | Public | Share resource via email |

---

## 4. Community Forum (Posts)

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| POST | /api/posts/ | Protected | Create a new post |
| GET  | /api/posts/ | Public | Get all active posts |

| GET  | /api/posts/user/:userId | Protected | Get posts by user |

| PUT  | /api/posts/:id | Protected | Update a post |
| DELETE | /api/posts/:id | Protected | Delete a post |

| POST | /api/posts/:id/comment | Protected | Add comment to a post |

---

## 5. Safety & Reports

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| POST | /api/safety/report | Protected | Report a post |

| GET  | /api/safety/reports | Admin | Get all reports |
| GET  | /api/safety/reports/:id | Admin | Get report details |

| PUT  | /api/safety/reports/:id | Admin | Resolve or dismiss report |
| DELETE | /api/safety/reports/:id | Admin | Delete a report |

| GET  | /api/safety/news | Public | Fetch women's safety news (external API) |

---

## 6. Bot Service (AI Chat)

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|

| POST | /api/bot-service/ | Public | Send prompt to Gemini AI chatbot |