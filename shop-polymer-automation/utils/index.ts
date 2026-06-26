export { env } from './env';

export {
  routes,
  categories,
  categoryTitles,
  type CategoryName,
} from './routes';

export {
  type AccountData,
  type AddressData,
  type PaymentData,
  type CheckoutFormData,
  type Size,
  validAccount,
  validShipping,
  validBilling,
  validPayment,
  validCheckoutData,
  validCheckoutWithBilling,
  invalidFields,
  boundaryFields,
  sizes,
  detailQuantities,
  cartQuantities,
} from './testData';

export {
  type CartProduct,
  type CartEntry,
  getCart,
  clearCart,
  setCart,
  getCartItemCount,
  getCartTotal,
  isCartEmpty,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  clearAllLocalStorage,
} from './storageUtils';

export {
  parsePrice,
  formatPrice,
  arePricesEqual,
  lineTotal,
  cartTotal,
  roundPrice,
} from './priceUtils';

export {
  waitForAppReady,
  waitForNetworkIdle,
  waitForShadowReady,
  waitForText,
  waitForCartCount,
  waitForCartModal,
  waitForUrl,
  waitForCheckoutSuccess,
  waitForCheckoutError,
} from './waitUtils';
