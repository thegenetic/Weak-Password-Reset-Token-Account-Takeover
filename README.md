# Weak Password Reset Token leading to Account Takeover

This repository contains a deliberately vulnerable web application that demonstrates a real‑world **account takeover** flaw caused by an insecure password reset token implementation. The lab is based on a finding originally discovered and published by security researcher **[Ashwin](https://www.linkedin.com/in/aswin-thambi-panikulangara/)** on [SystemWeakness](https://medium.com/system-weakness/account-takeover-via-weak-password-reset-token-validation-91df56296f07). You can use this project to understand the vulnerability, practice the exploitation steps, and then explore the production‑grade fix.

📺 **Watch the full video walkthrough**: [YouTube Link](https://youtu.be/L27hVxCj4kI)  
📝 **Read the detailed article**: [Medium Blog Link](https://medium.com/@pauldipesh29/weak-password-reset-token-leading-to-account-takeover-1a162d651acf)  

---

## 📁 Lab Structure

The repository contains two main files:

- `index-vulnerable.js` – The vulnerable version of the application (insecure password reset token generation).
- `index-fixed.js` – The secure version with proper token handling (cryptographically random, expiring, single‑use tokens).

Both versions share the same functionality and user interface, so you can easily compare the behaviour.

---

## 🚀 How to Run the Lab

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thegenetic/Weak-Password-Reset-Token-Account-Takeover.git
   cd Weak-Password-Reset-Token-Account-Takeover
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will install `express`, `jsonwebtoken`, and `body-parser` (required for both versions).
   And, additionally for the fixed version install `crypto` library.

### Running the Vulnerable Version

```bash
node index-vulnerable.js
```

The server will start on `http://localhost:3000`. You’ll see a list of seeded users in the console.

### Running the Fixed Version

```bash
node index-fixed.js
```

The server will start on the same port. The fixed version includes secure password reset tokens and additional protections.

---

## 📌 Important Notes

- The application simulates email delivery by logging password reset links directly to the **console**. In a real scenario these would be sent via email.
- The reset links are accessible via `http://localhost:3000/password-reset?token=<token>`.
- All data is stored in memory – restarting the server will reset any changes (including password updates and newly registered users).

---

## 🤝 Connect with Me

If you have questions or just want to connect:

- **X**: [@DipeshPaul19](https://x.com/DipeshPaul19)
- **LinkedIn**: [@the-genetic](https://www.linkedin.com/in/the-genetic)

*Happy hacking – and remember to stay secure! 🔐*
