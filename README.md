# Artha AI — Intelligent Fintech Risk & Market Intelligence Platform

> **🌐 Live Demo:** https://demo-arthai-app.vercel.app/

---

## 🚀 Features

* **🔐 Authentication & Security:** User registration, secure SHA-256 password hashing, SQLite storage, and session-based access control.
* **💳 Secure Transaction & QR Module:** UPI QR code generation, transaction logging, ML-based risk detection, and automatic high-risk transaction blocking.
* **🧠 Behavioral Risk Intelligence Engine:** Isolation Forest anomaly detection, transaction deviation analysis, real-time risk scoring (0–95%), and confidence calculations.
* **📊 Live Market Intelligence:** Real-time stock tracking via `yfinance` (NSE/BSE), intraday candlestick charts, key price metrics, and volatility-based risk indices.
* **🤖 AI Market Prediction Lab:** Linear Regression models for next-day price estimation, direction forecasting (UP/DOWN), and interactive Plotly visualizations.
* **📈 Smart Transaction Analytics:** Comprehensive overview of total transactions, revenue, risk distribution pie charts, and trend visualizations.

---

## 🛠️ Tech Stack

* **Frontend & UI:** Streamlit, Plotly, Pandas
* **Machine Learning & Analysis:** Scikit-Learn (Isolation Forest, Linear Regression), NumPy, `yfinance`
* **Database & Security:** SQLite, hashlib (SHA-256)

---

## 📂 Project Structure

```text
ArthaAI/
│
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── database.db            # SQLite database (auto-generated)
└── README.md              # Project documentation

```

---

## 🧠 How the Risk Engine Works

1. **Transaction Created:** User initiates a transaction or logs activity via the dashboard.
2. **Data Processing:** Historical user data and behavioral patterns are extracted from the SQLite database.
3. **Model Evaluation:** The **Isolation Forest** model checks the input against historical bounds to compute an anomaly score.
4. **Risk Calculation:**

$$\text{Final Risk} = \text{Behavioral Deviation} + \text{ML Boost}$$


$$\text{Confidence} = \min(100, \text{transaction count} \times 10)$$



---

## 🚀 Future Enhancements

* [ ] FastAPI backend microservice integration.
* [ ] Deep learning-based fraud detection models.
* [ ] Real UPI payment gateway integration.
* [ ] Cloud deployment (AWS / Azure).
* [ ] Portfolio risk scoring engine.

---
