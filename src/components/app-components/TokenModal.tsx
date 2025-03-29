import React, { useState, useEffect, useMemo } from "react";
import { Geologica } from "next/font/google";
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
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import useTokens from "@/hooks/useTokens";

interface Token {
  address?: string;
  mint?: string;
  symbol: string;
  name: string;
  icon?: string;
  decimals?: number;
  logoURI?: string;
}

interface TokenSearchModalProps {
  onSelect: (token: Token) => void;
  defaultToken?: Token;
}

// Consistent font import
const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const TokenModal: React.FC<TokenSearchModalProps> = ({
  onSelect,
  defaultToken,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(defaultToken);

  // Use the enhanced useTokens hook without initial search
  const {
    tokens,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    isError,
    error,
  } = useTokens({ 
    search: "",
  });
  

  // Filtered tokens based on search input
  const filteredTokens = useMemo(() => {
    // If no search, return all tokens
    if (!search.trim()) return tokens;

    // Filter tokens based on name or symbol (case-insensitive)
    return tokens.filter(token => 
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [tokens, search]);

  // Update selected token when defaultToken changes
  useEffect(() => {
    setSelectedToken(defaultToken);
  }, [defaultToken]);

  // Handle token selection
  const handleSelect = (token: Token) => {
    setSelectedToken(token);
    onSelect(token);
    setOpen(false);
  };

  // Reset search when modal is closed
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button/Display */}
      <DialogTrigger asChild>
        <span className="flex gap-6 items-center mb-4 cursor-pointer" >

          {selectedToken?.logoURI && (
            <img
              src={selectedToken?.logoURI}
              alt={`${selectedToken?.symbol} logo`}
              className="w-12 h-12 rounded-xl"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="flex flex-col gap-1 my-auto">
            <p className={`${geologica.className} font-medium text-[20px] tracking-normal`}>
              {selectedToken?.name || "Select Token"}
            </p>
            <p className={`${geologica.className} font-normal text-[10px] tracking-normal opacity-50`}>
              {selectedToken?.symbol || ""}
            </p>
          </div>
        </span>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        
        <Command className="rounded-2xl">
          <CommandInput
            placeholder="Search token name or symbol..."
            value={search}
            onValueChange={setSearch}
          />
          
          <CommandList>
            {/* Loading State */}
            {isLoading ? (
              <CommandEmpty>Loading tokens...</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>
                Error loading tokens: {error?.message}
              </CommandEmpty>
            ) : (
              <>
                {/* Token List */}
                <CommandGroup>
                  {filteredTokens.map((token) => (
                    <CommandItem
                      key={token.address || token.symbol}
                      onSelect={() => handleSelect(token)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {token?.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={`${token.symbol} logo`}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-500">
                          {token.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>

                {/* Load More Button */}
                {hasMore && !search && (
                  <Button
                    variant="ghost"
                    onClick={() => loadMore()}
                    disabled={isLoadingMore}
                    className="w-full"
                  >
                    {isLoadingMore ? "Loading more..." : "Load More"}
                  </Button>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredTokens.length === 0 && (
              <CommandEmpty>No tokens found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TokenModal;