import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'petros_cart_v2';

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id
            ? { ...i, qty: Math.min(i.qty + 1, action.product.stock || 99) }
            : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'SET_QTY': {
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    reducer,
    [],
    () => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
      catch { return []; }
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const total    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count    = items.reduce((s, i) => s + i.qty, 0);
  const hasItem  = id => items.some(i => i.id === id);

  const add      = product  => dispatch({ type: 'ADD', product });
  const remove   = id       => dispatch({ type: 'REMOVE', id });
  const setQty   = (id, qty)=> dispatch({ type: 'SET_QTY', id, qty });
  const clear    = ()       => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ items, total, count, hasItem, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
