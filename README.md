# ZapSwap

ZapSwap is a decentralized exchange (DEX) application where users can connect their MetaMask wallet and exchange their tokens. The application leverages the 1inch aggregator for optimized token swaps. This repository contains two main folders: `backend` (Node.js) and `frontend` (React).

## Tech Stack

- **Frontend**: React, wagmi , Ant Design Icons
- **Backend**: Node.js, Express
- **Aggregator**: 1inch

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or above)
- npm (v6 or above)
- MetaMask extension in your browser

### Setup Instructions

#### Clone the Repository

```bash
git clone https://github.com/yourusername/zapswap.git
cd zapswap
```
## Backend

Navigate to the `backend` folder and install the dependencies.

```bash
cd backend
npm install
```
Create a `.env` file and add your morallis and 1inch aggregator api key
```
INCH_DEV_API=""
MORALIS_API_KEY=""
```
The backend server will run on `http://localhost:3000`.
#Frontend

Navigate to the `frontend` folder and install the dependencies.
```bash
cd ../frontend
npm install
```

Start the frontend server
```
npm run dev
```
### Connecting MetaMask

1. Open the MetaMask extension in your browser.
2. Connect your wallet to the application when prompted.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or need further assistance, feel free to contact us at `rtbchawla12@gmail.com`.

