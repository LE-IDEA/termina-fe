import React, { useState, useEffect, useCallback } from "react";
import { Geologica, Instrument_Serif } from "next/font/google";
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

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

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
        <span className="flex gap-6 items-center mb-4 cursor-pointer" border-0>
          {selectedToken?.logoURI && (
            <img
              src={selectedToken?.logoURI}
              alt={`${selectedToken?.symbol} logo`}
              className="w-12 h-12 rounded-xl"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="flex flex-col gap-1 my-auto">
            <p
              className={`${geologica.className} font-medium text-[20px]  tracking-normal`}
            >
              {selectedToken?.name || "Select"}
            </p>
            <p
              className={`${geologica.className} font-normal text-[10px]  tracking-normal opacity-50`}
            >
              {selectedToken?.symbol || ""}
            </p>
          </div>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <Command className="rounded-2xl">
          <CommandInput
            placeholder="Search token name or symbol..."
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading tokens...</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>
                Error loading tokens: {error?.message}
              </CommandEmpty>
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
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
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
