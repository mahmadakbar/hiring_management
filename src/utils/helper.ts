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

export { truncateMiddle, getFileTypeColor };
