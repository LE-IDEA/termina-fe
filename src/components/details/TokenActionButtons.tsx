import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TokenActionButtonsProps {
  symbol: string;
  name?: string;
}

const TokenActionButtons = ({ symbol, name }: TokenActionButtonsProps) => {
  const router = useRouter();

  const handleBuy = () => {
    router.push(`/swap?token=${symbol}&action=buy`);
  };

  const handleSell = () => {
    router.push(`/swap?token=${symbol}&action=sell`);
  };

  return (
    <div className="token-action-buttons flex gap-2">
      <Button 
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" 
        onClick={handleBuy}
      >
        Buy {name || symbol}
      </Button>
      <Button 
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-black" 
        onClick={handleSell}
      >
        Sell {name || symbol}
      </Button>
    </div>
  );
};

export default TokenActionButtons;