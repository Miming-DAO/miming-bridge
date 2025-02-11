import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class USDTService {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private usdtContract: ethers.Contract;

    constructor() {
        const providerUrl = process.env.BSC_TESTNET_PROVIDER_URL;
        const privateKey = process.env.PRIVATE_KEY;
        const usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS;
        const usdtAbi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)",
        ];

        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, this.wallet);
    }

    async getBalance(address: string): Promise<string> {
        const balance = await this.usdtContract.balanceOf(address);
        return ethers.formatUnits(balance, 18);
    }

    async transfer(to: string, amount: number): Promise<string> {
        const tx = await this.usdtContract.transfer(to, ethers.parseUnits(amount.toString(), 18));
        await tx.wait();
        return tx.hash;
    }
}
