const statusColor = (treeStatusName) => {
  switch (treeStatusName) {
    case "Hazırlanıyor":
      return "bg-gray-50";
    case "Dökümde":
      return "bg-green-100";
    case "Döküldü":
      return "bg-blue-100";
    case "Kesimde":
      return "bg-purple-100";
    default:
      return "bg-white";
  }
};

export default statusColor;
