require("dotenv").config();
const { JsonRpcProvider, Wallet, parseEther, formatEther } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = parseInt(process.env.CHAIN_ID);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TO_ADDRESS = process.env.TO_ADDRESS;
const TIMEFRAME = parseInt(process.env.TIMEFRAME) || 30;
const TX_COUNT = parseInt(process.env.TX_COUNT) || 5;

const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID);
const wallet = new Wallet(PRIVATE_KEY, provider);

async function sendNativeTx(index) {
  try {
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 [TX #${index + 1}] Saldo: ${formatEther(balance)} PHA`);

    if (balance < parseEther("0.0012")) {
      console.log("⚠️ Saldo tidak cukup, skip transaksi.");
      return;
    }

    const tx = await wallet.sendTransaction({
      to: TO_ADDRESS,
      value: parseEther("0.001"),
      gasLimit: 21000,
    });

    console.log(`🚀 [TX #${index + 1}] TX terkirim! Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ [TX #${index + 1}] Confirmed di block: ${receipt.blockNumber}`);
  } catch (error) {
    console.error(`❌ [TX #${index + 1}] Gagal:`, error.message);
  }
}

async function runTxs(index = 0) {
  if (index >= TX_COUNT) {
    console.log("🎉 Semua transaksi selesai.");
    return;
  }

  await sendNativeTx(index);

  setTimeout(() => {
    runTxs(index + 1);
  }, TIMEFRAME * 1000);
}

runTxs();
