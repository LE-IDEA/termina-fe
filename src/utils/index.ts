export const debounce = <T extends unknown[]>(
    func: (...args: T) => void,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout | undefined;
  
    return (...args: T) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  export const formatNumber = (num: number): string => {
    if (num < 1_000) return num.toString();
    if (num >= 1_000 && num < 1_000_000) return (num / 1_000).toFixed(2) + "K";
    if (num >= 1_000_000 && num < 1_000_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000_000_000 && num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000_000_000 && num < 1_000_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + "T";
    return (num / 1_000_000_000_000_000).toFixed(2) + "Q";
  };
  


