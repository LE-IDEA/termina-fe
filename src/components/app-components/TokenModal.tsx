import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import useTokens from "@/hooks/useTokens";

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
  const [selectedToken, setSelectedToken] = useState<Token>(defaultToken);

  const {
    tokens,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoading,
    isError,
    error,
    totalTokens,
  } = useTokens({ search });

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
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-5 py-2 border bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors"
        >
          {selectedToken?.logoURI && (
            <span className="flex items-center gap-2">
              <img
                src={selectedToken?.logoURI}
                alt={`${selectedToken?.symbol} logo`}
                className="w-6 h-6 rounded-full"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span className="font-medium">{selectedToken?.symbol}</span>
            </span>
          )}

          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm min-h-[350px] p-4 bg-zinc-900 rounded-3xl">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          {!isLoading && !isError && (
            <p className="text-sm text-gray-500">
              {totalTokens} token{totalTokens !== 1 ? "s" : ""} available
            </p>
          )}
        </DialogHeader>
        <Command className="h-full bg-zinc-900">
          <CommandInput
            placeholder="Search token name or symbol..."
            value={search}
            onValueChange={setSearch}
            className="border-none focus:ring-0"
          />
          <CommandList className="mt-4 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : isError ? (
              <CommandEmpty className="py-6 text-center">
                <p className="text-red-500">Error loading tokens</p>
                <p className="text-sm text-gray-500">{error?.message}</p>
              </CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {tokens.map((token) => (
                    <CommandItem
                      key={token.address || token.symbol}
                      onSelect={() => handleSelect(token)}
                      className="flex items-center gap-2 cursor-pointer p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {token?.logoURI ? (
                          <img
                            src={token.logoURI}
                            alt={`${token.symbol} logo`}
                            className="w-6 h-6 rounded-full"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              {token.symbol.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-500">
                          {token.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {hasMore && !search && (
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      onClick={() => loadMore()}
                      disabled={isLoadingMore}
                      className="w-full hover:bg-zinc-800"
                    >
                      {isLoadingMore ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading more...
                        </span>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
            {!isLoading && !isError && tokens.length === 0 && (
              <CommandEmpty className="py-6">
                No tokens found matching "{search}"
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearchModal;
