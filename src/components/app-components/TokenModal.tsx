import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
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
import { debounce } from "@/utils";

interface Token {
  address?: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

interface TokenSearchModalProps {
  onSelect: (token: Token) => void;
  defaultToken: Token;
}

const TokenSearchModal: React.FC<TokenSearchModalProps> = ({
  onSelect,
  defaultToken,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    tokens,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    isError,
    error,
  } = useTokens({ search });

  const [selectedToken, setSelectedToken] = useState<Token>(defaultToken);

  // Update selected token when defaultToken changes
  useEffect(() => {
    setSelectedToken(defaultToken);
  }, [defaultToken]);

  // Debounced search function
  // const handleSearch = useCallback(
  //   debounce((value: string) => {
  //     setSearch(value);
  //   }, 300),
  //   []
  // );

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
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-50 border rounded-lg"
        >
          {selectedToken?.logoURI && (
            <img
              src={selectedToken?.logoURI}
              alt={`${selectedToken?.symbol} logo`}
              className="w-6 h-6 rounded-full"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <span className="font-medium">{selectedToken?.symbol}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg">
          <CommandInput
            placeholder="Search token name or symbol..."
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading tokens...</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>Error loading tokens: {error?.message}</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {tokens.map((token) => (
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
                        <span className="text-sm text-gray-500">{token.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
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
            {!isLoading && !isError && tokens.length === 0 && (
              <CommandEmpty>No tokens found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearchModal;