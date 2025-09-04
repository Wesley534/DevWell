// src/utils/hydrationService.js

class HydrationService {
  constructor() {
    this.hydration = 0; // Current water glasses count
    this.maxGlasses = 8; // Max allowed
    this.subscribers = []; // Components listening for updates
  }

  // Increment hydration by 1 glass, up to maxGlasses
  addGlass() {
    if (this.hydration < this.maxGlasses) {
      this.hydration += 1;
      this.notify();
    }
  }

  // Decrement hydration (optional)
  removeGlass() {
    if (this.hydration > 0) {
      this.hydration -= 1;
      this.notify();
    }
  }

  // Set hydration to a specific value (useful for loading initial data)
  setHydration(value) {
    this.hydration = Math.min(Math.max(value, 0), this.maxGlasses);
    this.notify();
  }

  // Get current hydration count
  getHydration() {
    return this.hydration;
  }

  // Subscribe to hydration updates
  // Returns an unsubscribe function
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers of the current hydration value
  notify() {
    this.subscribers.forEach(cb => cb(this.hydration));
  }
}

// Export a single instance to share across components
export const hydrationService = new HydrationService();
