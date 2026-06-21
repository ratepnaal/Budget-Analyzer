# 📊 Dual-Currency Budget Analyzer

A professional and advanced web application designed to manage personal finances, expenses, and savings across two currencies ($USD$ / $SYP$). It is specifically tailored to solve financial tracking challenges for freelancers and remote workers operating in fluctuating economic environments.

The application provides an intuitive dashboard for managing multiple wallets, automated tracking for borrowings/debts, and comprehensive savings modules with real-time financial updates.

---

### 📌 About The Project
**Dual-Currency Budget Analyzer** is strategically engineered to address the complex personal financial management challenges faced by employees who receive their income in US Dollars ($USD$) but handle their day-to-day living expenses in a highly volatile local currency like the Syrian Pound ($SYP$). This requires precise balance and instant tracking amidst continuous exchange rate fluctuations.

Developed with a strong focus on clean code, separation of concerns, and robust software engineering principles.

---

### 🛠️ Tech Stack

* **Framework:** Next.js 14+ (App Router) for optimization, security, and rendering efficiency.
* **State Management:** Redux Toolkit for centralized, robust, and predictable state transitions across complex financial entities.
* **Styling:** Tailwind CSS using a centralized design system for seamless layout control and responsiveness.
* **Data Persistence:** LocalStorage for fast, secure, and completely client-side local data storage.

---

### ✨ Key Features

1. **Dual-Wallet Logic:** Strict accounting isolation and independent management of USD and SYP cash flows, featuring instant currency conversions and exchange capabilities based on a central adjustable exchange rate.
2. **Deferred Committing System:** A smart billing implementation that preserves newly declared transactions in a "Pending" state. Funds are only modified and deducted once explicitly triggered via the "Commit Expense" action, reducing data entry errors.
3. **Advanced Expense Classification:** Dynamic tracking across 6 strict monetary categories (*Basic, Secondary, Debts, Debt Repayment, Write-off, Savings*) feeding live analytical dashboard charts for swift financial analysis.
4. **Smart Loans & Savings Framework:**
   * **Loans Module:** Supports strict USD-denominated borrowing capabilities that instantly update both cash and loan assets, trackable for sequential repayments.
   * **Savings Module:** An isolated reserve vault that accepts standard external deposits or automated, computed overflows directly triggered from standard operations.
5. **Next.js Hydration Fixed:** Implements an elegant structural engineering pattern to successfully overcome standard Server-Side Rendering (SSR) hydration mismatch errors when dealing with browser local storage initialization.
6. **Centralized Configurations & Themes:** Central settings pane to adjust prevailing market exchange values, complete with full support for Dark Mode, Light Mode, or system default preferences.

---

### 🚀 Roadmap

- [ ] Migrate data persistence layers and models to **MongoDB**.
- [ ] Implement a comprehensive and secure user **Authentication & Authorization** system (NextAuth / JWT).
- [ ] Integrate a dynamic report generator allowing users to export financial sheets to PDF or Excel formats.

---

### 💻 Installation & Local Setup

To get a local copy up and running, follow these simple steps:

```bash
# 1. Clone the repository
git clone [https://github.com/your-username/dual-currency-budget-analyzer.git](https://github.com/your-username/dual-currency-budget-analyzer.git)

# 2. Navigate into the project directory
cd dual-currency-budget-analyzer

# 3. Install NPM packages
npm install

# 4. Run the development server
npm run dev
