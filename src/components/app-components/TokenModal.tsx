import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import useTokens from '@/hooks/useTokens';

const TokenSearchModal = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const { tokens, loading, error } = useTokens();

  const handleSelect = (token) => {
    onSelect?.(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <Search className="mr-2 h-4 w-4" />
          <span>Search tokens...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Search Tokens</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search token name or symbol..." />
          <CommandEmpty>
            {loading ? (
              "Loading tokens..."
            ) : error ? (
              `Error: ${error}`
            ) : (
              "No tokens found."
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-96 overflow-auto">
            {tokens.map((token) => (
              <CommandItem
                key={token.address}
                onSelect={() => handleSelect(token)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {token.logoURI && (
                  <img
                    src={token.logoURI}
                    alt={`${token.symbol} logo`}
                    className="w-6 h-6 rounded-full"
                    // onError={(e) => {
                    //   e.target.src = "/api/placeholder/24/24";
                    //   e.target.onerror = null;
                    // }}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearchModal;