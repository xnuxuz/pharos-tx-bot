require("dotenv").config();
const { JsonRpcProvider, Wallet, parseEther, formatEther } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = parseInt(process.env.CHAIN_ID);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TO_ADDRESS = process.env.TO_ADDRESS;
const TIMEFRAME = parseInt(process.env.TIMEFRAME) || 30;

const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID);
const wallet = new Wallet(PRIVATE_KEY, provider);

async function sendNativeTx() {
  try {
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Saldo saat ini: ${formatEther(balance)} ETH`);

    if (balance.lt(parseEther("0.0012"))) {
      console.log("⚠️ Saldo tidak cukup, skip transaksi.");
      return;
    }

    const tx = await wallet.sendTransaction({
      to: TO_ADDRESS,
      value: parseEther(`${process.env.BALANCE || "0.001"}`),
      gasLimit: 21000,
    });

    console.log(`🚀 TX terkirim! Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ TX confirmed di block: ${receipt.blockNumber}`);
  } catch (error) {
    console.error("❌ Gagal kirim:", error.message);
  }
}

sendNativeTx();

setInterval(() => {
  sendNativeTx();
}, TIMEFRAME * 1000);
