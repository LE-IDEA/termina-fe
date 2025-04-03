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
import Image from "next/image";
import Link from "next/link";

interface Token {
  address?: string;
  symbol: string;
  name: string;
  icon?: string;
}

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const SearchAdd = () => {
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
  const handleSelect = (token: Token) => {
    setOpen(false);
  };


  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <div>
        <section className="hidden md:flex flex-row w-full gap-3 cursor-pointer">
          <div className="flex flex-row flex-1 bg-[#ebebeb] p-[12px] gap-3 rounded-[24px]">
            <Image src="/SearchFrame.svg" alt="search" width={28} height={28} />
            <input
              id="search"
              className={`${geologica.className} bg-[#ebebeb] font-normal text-[20px] leading-1 tracking-normal `}
              placeholder="Search"
              title="Search"
              readOnly
            ></input>
          </div>
        </section>
        <Image src="/SearchFrame.svg" className="md:hidden" alt="prev" width={36} height={36} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
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
                      key={token?.address || token?.symbol}
                      onSelect={() => handleSelect(token)}
                      
                    >
                      <Link href={`/${token?.address}`} className=" w-full flex items-center gap-2 cursor-pointer">
               
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
                        <span className="font-medium">{token?.symbol}</span>
                        <span className="text-sm text-gray-500">
                          {token?.name}
                        </span>
                      </div>
                      </Link>
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

export default SearchAdd;
