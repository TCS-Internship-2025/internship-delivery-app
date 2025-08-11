export const deliveryConverter = (delivery?: string) => {
  switch (delivery) {
    case 'HOME':
      return 'Home';
    case 'PICKUP_POINT':
      return 'Pickup Point';
    case 'PARCEL_BOX':
      return 'Parcel Box';
    default:
      return 'Unknokwn';
  }
};

export const paymentConverter = (payment?: string) => {
  switch (payment) {
    case 'SENDER_PAYS':
      return 'Sender pays';
    case 'RECIPIENT_PAYS':
      return 'Recipient pays';
    default:
      return 'Unknokwn';
  }
};
