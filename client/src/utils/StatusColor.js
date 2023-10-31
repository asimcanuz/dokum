const statusColor = (treeStatusName) => {
  switch (treeStatusName) {
    case 'Hazırlanıyor':
      return 'bg-yellow-100';
    case 'Dökümde':
      return 'bg-purple-100';
    case 'Döküldü':
      return 'bg-blue-100';
    case 'Kesimde':
      return 'bg-green-100';

    default:
      return 'bg-white';
  }
};

export const statusColorStyle = (treeStatusName) => {
  switch (treeStatusName) {
    case 'Hazırlanıyor':
      return '#fef9c3';
    case 'Dökümde':
      return '#f3e8ff';
    case 'Döküldü':
      return '#dbeafe';
    case 'Kesimde':
      return '#dcfce7';
    default:
      return '#ffffff';
  }
};

export default statusColor;
