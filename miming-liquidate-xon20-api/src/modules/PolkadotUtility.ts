import { formatBalance } from '@polkadot/util';
import '@polkadot/api-augment';

export default class PolkadotUtility {
    static balanceFormatter = (
        decimals: any,
        balance: any
    ) => {
        try {
            formatBalance.setDefaults({ decimals: decimals, unit: "" });
            formatBalance.getDefaults();
            const free = formatBalance(balance, { forceUnit: "", withUnit: false });
            const balances = free.split(',').join('');
            const parsedBalance = parseFloat(balances.replace(/,/g, '')).toFixed(4);
            return parsedBalance;
        } catch (error: any) {
            return Error(error);
        }
    }
}
