import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { BookingOrder, Product, StoreProfile, OrderStatus } from '../types';

export const ORDERS_COLLECTION = 'orders';
export const PRODUCTS_COLLECTION = 'products';
export const SETTINGS_COLLECTION = 'storeSettings';

/**
 * Real-time listener for customer booking orders
 */
export const subscribeToOrders = (
  onOrdersUpdate: (orders: BookingOrder[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const ordersQuery = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersList: BookingOrder[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          ordersList.push({
            id: docSnapshot.id,
            customerName: data.customerName || '',
            customerPhone: data.customerPhone || '',
            customerAddress: data.customerAddress || '',
            customerNote: data.customerNote || '',
            productId: data.productId || '',
            productName: data.productName || '',
            productImage: data.productImage || '',
            productPrice: Number(data.productPrice || 0),
            originalPrice: Number(data.originalPrice || 0),
            discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
            quantity: Number(data.quantity || 1),
            totalAmount: Number(data.totalAmount || 0),
            status: (data.status as OrderStatus) || 'NEW',
            createdAt: data.createdAt instanceof Object && 'toDate' in data.createdAt 
              ? data.createdAt.toDate().toISOString() 
              : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
          });
        });
        onOrdersUpdate(ordersList);
      },
      (error) => {
        console.warn('Firestore orders sync notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to orders:', err);
    return () => {};
  }
};

/**
 * Save new booking order to Firestore
 */
export const saveOrderToFirestore = async (order: BookingOrder) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(orderRef, {
      ...order,
      firebaseTimestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.warn('Could not save order directly to Firestore:', error);
    return false;
  }
};

/**
 * Update order status in Firestore
 */
export const updateOrderStatusInFirestore = async (orderId: string, status: OrderStatus) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { status });
    return true;
  } catch (error) {
    console.warn('Could not update order status in Firestore:', error);
    return false;
  }
};

/**
 * Delete order from Firestore
 */
export const deleteOrderFromFirestore = async (orderId: string) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderRef);
    return true;
  } catch (error) {
    console.warn('Could not delete order from Firestore:', error);
    return false;
  }
};

/**
 * Sync products with Firestore
 */
export const subscribeToProducts = (
  onProductsUpdate: (products: Product[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const productsQuery = query(collection(db, PRODUCTS_COLLECTION));
    return onSnapshot(
      productsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              name: data.name || '',
              nameGu: data.nameGu,
              categoryId: data.categoryId || 'fashion',
              originalPrice: Number(data.originalPrice || 0),
              discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
              hasDiscount: !!data.hasDiscount,
              imageUrl: data.imageUrl || '',
              description: data.description || '',
              descriptionGu: data.descriptionGu,
              inStock: data.inStock !== false,
              unit: data.unit || 'Piece',
              featured: !!data.featured,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          onProductsUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore products sync notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to products:', err);
    return () => {};
  }
};

/**
 * Save product to Firestore
 */
export const saveProductToFirestore = async (product: Product) => {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(prodRef, product, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save product to Firestore:', error);
    return false;
  }
};

/**
 * Delete product from Firestore
 */
export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(prodRef);
    return true;
  } catch (error) {
    console.warn('Could not delete product from Firestore:', error);
    return false;
  }
};

/**
 * Save Store Profile to Firestore
 */
export const saveStoreProfileToFirestore = async (profile: StoreProfile) => {
  try {
    const profileRef = doc(db, SETTINGS_COLLECTION, 'general');
    await setDoc(profileRef, profile, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save store profile to Firestore:', error);
    return false;
  }
};
