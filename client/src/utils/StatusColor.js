const statusColor = (treeStatusName) => {
  switch (treeStatusName) {
    case "Hazırlanıyor":
      return "bg-yellow-100";
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

export const statusColorStyle = (treeStatusName) => {
  switch (treeStatusName) {
    case "Hazırlanıyor":
      return "#fef9c3";
    case "Dökümde":
      return "#dcfce7";
    case "Döküldü":
      return "#dbeafe";
    case "Kesimde":
       return "#f3e8ff";
    default:
      return "#ffffff";
  }
};






export default statusColor;
