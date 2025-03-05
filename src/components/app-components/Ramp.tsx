import type React from "react"
;('"use client')

import { useState } from "react"
import { ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for currencies and tokens
const fiatCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", balance: 1250.75 },
  { code: "EUR", name: "Euro", symbol: "€", balance: 1050.32 },
  { code: "GBP", name: "British Pound", symbol: "£", balance: 890.45 },
]

const cryptoTokens = [
  { code: "BTC", name: "Bitcoin", icon: "₿", balance: 0.0215, price: 62000 },
  { code: "ETH", name: "Ethereum", icon: "Ξ", balance: 1.245, price: 3400 },
  { code: "SOL", name: "Solana", icon: "◎", balance: 45.78, price: 140 },
]

export default function RampCard() {
  const [direction, setDirection] = useState<"buy" | "sell">("buy")
  const [fiatAmount, setFiatAmount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[0])
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoTokens[0])
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate the conversion rate
  const calculateRate = () => {
    if (direction === "buy") {
      return (Number(fiatAmount) / Number(cryptoAmount)).toFixed(2)
    } else {
      return (Number(cryptoAmount) / Number(fiatAmount)).toFixed(2)
    }
  }

  // Handle fiat amount change
  const handleFiatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFiatAmount(value)

    if (value && !isNaN(Number(value))) {
      if (direction === "buy") {
        setCryptoAmount((Number(value) / selectedCrypto.price).toFixed(6))
      } else {
        setCryptoAmount((Number(value) * selectedCrypto.price).toFixed(2))
      }
    } else {
      setCryptoAmount("")
    }
  }

  // Handle crypto amount change
  const handleCryptoAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCryptoAmount(value)

    if (value && !isNaN(Number(value))) {
      if (direction === "buy") {
        setFiatAmount((Number(value) * selectedCrypto.price).toFixed(2))
      } else {
        setFiatAmount((Number(value) / selectedCrypto.price).toFixed(6))
      }
    } else {
      setFiatAmount("")
    }
  }

  // Handle swap direction
  const handleSwapDirection = () => {
    setDirection(direction === "buy" ? "sell" : "buy")
    // Reset amounts
    setFiatAmount("")
    setCryptoAmount("")
  }

  // Handle fiat currency change
  const handleFiatChange = (value: string) => {
    const currency = fiatCurrencies.find((c) => c.code === value)
    if (currency) {
      setSelectedFiat(currency)
    }
  }

  // Handle crypto token change
  const handleCryptoChange = (value: string) => {
    const token = cryptoTokens.find((t) => t.code === value)
    if (token) {
      setSelectedCrypto(token)
    }
  }

  // Handle ramp action
  const handleRampAction = () => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      // Reset form
      setFiatAmount("")
      setCryptoAmount("")
    }, 2000)
  }

  // Format balance display
  const formatBalance = (amount: number, symbol: string) => {
    return `${symbol}${amount.toLocaleString()}`
  }

  // Calculate fees (mock)
  const calculateFees = () => {
    if (!fiatAmount) return "0.00"
    return (Number(fiatAmount) * 0.01).toFixed(2)
  }

  const isActionDisabled = !fiatAmount || !cryptoAmount || isProcessing

  return (
    <Card className="w-full bg-zinc-900 rounded-3xl">
      <CardContent className="p-3">
        {/* Fiat Section */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500">{direction === "buy" ? "You pay" : "You receive"}</label>
            <span className="text-sm text-gray-500">
              Balance: {formatBalance(selectedFiat.balance, selectedFiat.symbol)}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.00"
              value={fiatAmount}
              onChange={handleFiatAmountChange}
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <Select value={selectedFiat.code} onValueChange={handleFiatChange}>
              <SelectTrigger className="w-[110px] border-0 border-none rounded-full bg-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-800">
                {fiatCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="relative h-0">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Button variant="secondary" size="icon" className="rounded-full shadow-md" onClick={handleSwapDirection}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Crypto Section */}
        <div className="rounded-2xl bg-zinc-800 p-4 py-6 h-32 mt-2">
          <div className="flex justify-between mb-2">
            <label className="text-base text-gray-500">{direction === "buy" ? "You receive" : "You pay"}</label>
            <span className="text-base text-gray-500">
              Balance: {selectedCrypto.balance.toFixed(4)} {selectedCrypto.code}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.0"
              value={cryptoAmount}
              onChange={handleCryptoAmountChange}
              className="border-0 bg-transparent text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            <Select value={selectedCrypto.code} onValueChange={handleCryptoChange}>
              <SelectTrigger className="w-[110px] border-0 bg-zinc-700 text-white rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-800">
                {cryptoTokens.map((token) => (
                  <SelectItem key={token.code} value={token.code}>
                    {token.icon} {token.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Service Fee</span>
            <span>
              {selectedFiat.symbol}
              {calculateFees()}
            </span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Processing Time</span>
            <span>~10 minutes</span>
          </div>

          {/* KYC Notice */}
          {Number(fiatAmount) > 1000 && (
            <div className="mt-2 p-2 bg-blue-900/40 rounded-lg text-xs">
              <p>Transactions over {selectedFiat.symbol}1,000 require additional verification.</p>
            </div>
          )}

          <div className="my-4 border-t border-zinc-700"></div>

          {fiatAmount && cryptoAmount && Number(fiatAmount) > 0 && (
            <div className="flex justify-between font-medium">
              <span>Rate</span>
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <span>
                      1 {selectedCrypto.code} = {selectedFiat.symbol}
                      {selectedCrypto.price.toLocaleString()}
                    </span>
                    <Info className="h-3 w-3 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-700 border-zinc-600">
                    <p>Market rate + 0.5% spread</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-blue-700 mt-4 px-6 py-6 text-white text-lg hover:bg-blue-600 hover:text-white rounded-full"
          size="lg"
          onClick={handleRampAction}
          disabled={isActionDisabled}
        >
          {isProcessing ? "Processing..." : direction === "buy" ? "Buy Crypto" : "Sell Crypto"}
        </Button>
      </CardContent>
    </Card>
  )
}

