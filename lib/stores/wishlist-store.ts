import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  fetchCount: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      count: 0,

      setCount: (count) => set({ count }),

      increment: () => set((state) => ({ count: state.count + 1 })),

      decrement: () => set((state) => ({ count: Math.max(0, state.count - 1) })),

      fetchCount: async () => {
        try {
          const response = await fetch('/api/wishlist');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              set({ count: data.items?.length || 0 });
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist count:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
