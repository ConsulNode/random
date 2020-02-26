import 'dotenv/config';
import cron from 'node-cron';
import axios from 'axios';


// Launch task every day
cron.schedule(process.env.CRON, () => {
  chooseWinner();
});


const chooseWinner = async () => {
  const coins = await getCoins();
  const delegators = await getDelegators(coins);

  if (delegators.length > 0) {
    const delegatorsFiltered = delegators
      .filter(i => i.total_value >= 1000);
    const winnerIndex = Math.floor(Math.random() * delegatorsFiltered.length);
    const winner = delegatorsFiltered[winnerIndex];

    // Do anything with the winner
  } else {
    // No delegators found
  }
}


// EXPLORER_API = https://explorer-api.apps.minter.network/api/v1/
const getCoins = () => (
  new Promise((resolve) => {
    axios.get(`${process.env.EXPLORER_API}coins`)
      .then((response) => resolve(response.data.data))
      .catch((error) => {
        // Catch error
      });
  }));

const getDelegators = (coins) => (
  new Promise((resolve) => {
    axios.get(`${process.env.EXPLORER_API}validators/${process.env.VALIDATOR}`)
      .then((response) => {
        const delegators = [];
        const stakes = response.data.data.delegator_list;

        // Get total BIP value for each delegator
        stakes.forEach((d) => {
          if (d.bip_value > 0 && verifyCoin(d.coin, coins)) {
            const index = delegators.findIndex(i => i.address === d.address);

            if (index === -1) {
              delegators.push({
                address: d.address,
                total_value: +d.bip_value,
              });
            } else delegators[index].total_value += +item.bip_value;
          }
        });

        delegators = delegators.map(i => i.total_value = +i.total_value.toFixed(4));

        resolve(delegators);
      })
      .catch((error) => {
        // Catch error
      });
  }));


const validCoins = [
  'BIP',
  'CONSULGAME',
];

const verifyCoin = (coin, coins) => {
  if (validCoins.includes(coin)) return true;
  if (coins.find(i => i.symbol === coin).crr >= 40) return true;
  return false;
}
