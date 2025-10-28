const truncateMiddle = (str: string, maxLength: number = 40) => {
  if (str.length <= maxLength) return str;

  const start = Math.ceil(maxLength / 2) - 2;
  const end = Math.floor(maxLength / 2) - 2;

  return str.slice(0, start) + "..." + str.slice(-end);
};

const getFileTypeColor = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "#EF4444"; // red
    case "doc":
    case "docx":
      return "#3B82F6"; // blue
    case "xls":
    case "xlsx":
      return "#10B981"; // green
    default:
      return "#F59E0B"; // yellow
  }
};

const formatMoney = (
  value: string | number,
  _currency: string = "IDR"
): string => {
  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.-]/g, ""))
      : value;

  if (isNaN(numericValue)) return "";

  // Format as Indonesian Rupiah with dot separators
  const formatted = numericValue.toLocaleString("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `Rp ${formatted}`;
};

const parseMoney = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/[^\d]/g, "");
  return parseFloat(numericValue) || 0;
};

const formatMoneyInput = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, "");

  // Return empty if no value
  if (!numericValue) return "";

  // Convert to number to remove leading zeros, then back to string
  const cleanedNumber = parseInt(numericValue, 10).toString();

  // Add dot separators every 3 digits from right
  return cleanedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

function isDictionary(object: unknown): object is Record<keyof never, unknown> {
  return object instanceof Object && object.constructor === Object;
}

function mapKeysDeep(
  object: Record<keyof never, unknown>,
  callback: (key: string, value: unknown) => keyof never
): Record<string, unknown> {
  function iterate(value: unknown): unknown {
    if (isDictionary(value)) {
      return mapKeysDeep(value, callback);
    }

    if (value instanceof Array) {
      return value.map(iterate);
    }

    return value;
  }

  return Object.entries(object).reduce(
    (result, [key, value]) => ({
      ...result,
      [callback(key, value)]: iterate(value),
    }),
    {}
  );
}

// Helper function to parse dd/MM/yyyy string to Date object
const parseDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  // Check if dateString is in dd/MM/yyyy format
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateRegex.exec(dateString);

  if (match) {
    const [, day, month, year] = match;
    // Month is 0-indexed in Date constructor
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Validate the date
    if (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year)
    ) {
      return date;
    }
  }

  return undefined;
};

export {
  truncateMiddle,
  getFileTypeColor,
  formatMoney,
  parseMoney,
  formatMoneyInput,
  mapKeysDeep,
  parseDate,
};
