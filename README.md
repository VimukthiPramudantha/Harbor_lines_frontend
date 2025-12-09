# Harbor Lines ERP Frontend

A modern, React-based frontend application for the **Harbor Lines ERP** system. This application is designed to manage logistics operations, including master data maintenance, freight management, and sea freight import jobs.

## 🚀 Technologies Used

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
*   **Styling**: CSS Modules / Standard CSS

## ✨ Features

### 🔐 Authentication
*   Secure Login system
*   Protected Routes ensuring access control

### 📊 Dashboard
*   Centralized overview of operations

### 🗂️ Master Files Usage
Comprehensive management of core data:
*   **Customer & Supplier Maintenance**: Manage business partners.
*   **Currency Maintenance**: Handle multi-currency operations.
*   **Unit of Measurement (UOM)**: Standardize measurements.
*   **Bank Maintenance**: Manage banking details.
*   **Tax Maintenance**: Configure tax rules.

### 🚢 Freight Master
Management of logistics assets and routes:
*   **Vessel Maintenance**: Manage shipping vessels.
*   **Flight Maintenance**: Manage air transport details.
*   **Sea Destination**: Configure sea ports and destinations.
*   **Air Destination**: Configure airports and destinations.

### 📦 Sea Freight Jobs
*   **Import Job Master**: specific handling for sea freight import operations.

## 🛠️ Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd Harbor_lines_frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

4.  **Build for production**:
    ```bash
    npm run build
    ```

5.  **Preview production build**:
    ```bash
    npm run preview
    ```

## 📁 Project Structure

*   `src/pages`: Contains all page components (Auth, Dashboard, Masters, Freight, etc.).
*   `src/components`: Reusable UI components.
*   `src/context`: React Context definitions (e.g., AuthContext).
*   `src/services`: API service calls.
*   `src/styles`: Global and component-specific styles.
