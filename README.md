# BillSplit Mini

BillSplit Mini is a modern, single-page web application built to simplify the process of splitting bills among friends. It features value-focused utilities like itemized splitting, tax/tip calculation, and integrated UPI QR code generation for seamless payments.

## Features

### Core Functionality
- **Participant Management**: Add and remove friends easily. Supports storing UPI IDs for payment generation.
- **Itemized Splitting**: Add items with specific prices and assign them to one or multiple people.
- **Advanced Calculation**: Automatically calculates equal splits for shared items and aggregates total debt for each person.
- **UPI QR Integration**: Generates standard UPI QR codes for each person's share. Users can scan these codes with any UPI app (GPay, PhonePe, Paytm) to pay the bill payer instantly.
- **Export to Text**: Generates a downloadable `.txt` receipt of the bill, including a detailed breakdown of items and shares.

### User Interface
- **Responsive Design**: Fully optimized for mobile devices with large touch targets and stacked layouts.
- **High Contrast Theme**: A dark-themed UI with high-contrast text and elements for excellent visibility in all lighting conditions.
- **Glassmorphism**: A premium aesthetic utilizing backdrop filters and translucent panels.

## Tech Stack

- **Frontend Framework**: React (Vite)
- **Styling**: Vanilla CSS (CSS3 variables, Flexbox, Grid)
- **Icons**: Lucide React
- **QR Generation**: qrcode (Client-side library)

## Installation and Setup

To run this project locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/abhi3114-glitch/BillSplit-MIni.git
    cd "BillSplit Mini"
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

4.  **Build for Production**
    ```bash
    npm run build
    ```
    The output files will be in the `dist` directory.

## Usage Guide

1.  **Add Participants**: Enter names of everyone eating/splitting. Optionally add their UPI ID if they might be the one paying the bill (to receive money).
2.  **Add Items**: List out the items from the bill.
    - Enter Item Name and Price.
    - Select who shared this item (default is everyone).
3.  **Review Summary**: Scroll down to see the total.
4.  **Select Payer**: Choose who actually paid the bill at the restaurant.
5.  **Share & Pay**: The app runs the math.
    - Everyone else will see exactly how much they owe the payer.
    - If the payer has a UPI ID, a QR code appears for each debtor to scan and pay instantly.
6.  **Export**: Click "Export Bill" to download a text summary for your records.

## Project Structure

- `src/components/`: Reusable UI components (Buttons, Inputs).
- `src/features/`: Core feature components (ParticipantList, ItemInput, ResultSummary).
- `src/utils/`: Helper functions (calculator logic, currency formatting).
- `src/App.jsx`: Main application layout.
- `src/index.css`: Global styles and theming.

## License

This project is open source and available under the MIT License.
