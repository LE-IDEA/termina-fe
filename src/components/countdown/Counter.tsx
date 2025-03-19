"use client"

import { useEffect, useState } from "react"

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  
    useEffect(() => {
      const calculateTimeLeft = () => {
        const deploymentDate = new Date("2025-04-14").getTime()
        const now = new Date().getTime()
        const distance = deploymentDate - now
  
        if (distance < 0) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          }
        }
  
        return {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        }
      }
  
      // Initialize the time immediately
      setTimeLeft(calculateTimeLeft())
  
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft())
      }, 1000)
  
      return () => clearInterval(timer)
    }, [])
  
    const formatNumber = (num) => num.toString().padStart(2, "0")
  
    const timeUnits = [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Minutes", value: timeLeft.minutes },
      { label: "Seconds", value: timeLeft.seconds },
    ]
  
    return (
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm text-white text-xl sm:text-3xl md:text-4xl font-bold w-14 sm:w-20 md:w-24 h-14 sm:h-20 md:h-24 rounded-lg flex items-center justify-center">
              {formatNumber(unit.value)}
            </div>
            <span className="text-white text-base mt-2">{unit.label}</span>
          </div>
        ))}
      </div>
    )
  }

  export default CountdownTimer