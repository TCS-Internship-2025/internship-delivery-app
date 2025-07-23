import z from 'zod';

// Zod enums
export const TitleEnum = z.enum(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']);
export const DeliveryEnum = z.enum(['Home', 'Pickup Point']);
export const PaymentEnum = z.enum(['Sender', 'Recipient']);
export type TitleEnum = z.infer<typeof TitleEnum>;
export type DeliveryEnum = z.infer<typeof DeliveryEnum>;
export type PaymentEnum = z.infer<typeof PaymentEnum>;

// Constants
export const ROUTES = {
  PAGE1: 'page1',
  PAGE2: 'page2',
  PAGE3: 'page3',
  PAGE4: 'page4',
  PAGE5: 'page5',
  SUCCESS: 'success',
  ERROR: 'error',
};
