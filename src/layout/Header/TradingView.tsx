import {
  CopyrightStyles,
  TickerSymbols,
  TickerTape,
} from 'react-ts-tradingview-widgets';

const symbols: TickerSymbols = [
  { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'BITTREX:GOOGLUSD', title: 'Google' },
  { proName: 'NASDAQ:AAPL', title: 'Apple' },
  { proName: 'NASDAQ:TSLA', title: 'Tesla' },
  { proName: 'NYSE:WMT', title: 'Walmart' },
  { proName: 'NASDAQ:INTC', title: 'Intel' },
];

const cStyles: CopyrightStyles = {
  parent: { display: 'none' },
  link: { display: 'none' },
  span: { display: 'none' },
};

const TradingView = () => (
  <div className="fixed z-10 w-full">
    <TickerTape
      colorTheme="light"
      displayMode="regular"
      symbols={symbols}
      copyrightStyles={cStyles}
    />
  </div>
);

export default TradingView;
