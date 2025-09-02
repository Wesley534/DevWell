const STORAGE_KEYS = {
  SESSION_TIME: 'codingSessionTime',
  IS_TRACKING: 'codingIsTracking',
  START_TIME: 'codingSessionStartTime',
};

class TimerService {
  constructor() {
    this.interval = null;
    this.listeners = new Set();
  }

  // Start the timer
  startTimer() {
    if (this.interval) return; // Prevent multiple intervals
    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'true');
    localStorage.setItem(STORAGE_KEYS.START_TIME, Date.now().toString());
    const initialTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_TIME) || '0', 10);
    this.interval = setInterval(() => {
      const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTime = initialTime + elapsed;
      localStorage.setItem(STORAGE_KEYS.SESSION_TIME, newTime.toString());
      this.notifyListeners();
    }, 1000);
    this.notifyListeners();
  }

  // Stop the timer
  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'false');
    localStorage.removeItem(STORAGE_KEYS.START_TIME);
    this.notifyListeners();
  }

  // Reset the timer
  resetTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    localStorage.setItem(STORAGE_KEYS.SESSION_TIME, '0');
    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'false');
    localStorage.removeItem(STORAGE_KEYS.START_TIME);
    this.notifyListeners();
  }

  // Get current timer state
  getTimerState() {
    const sessionTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_TIME) || '0', 10);
    const isTracking = localStorage.getItem(STORAGE_KEYS.IS_TRACKING) === 'true';
    const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10);
    if (isTracking && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return { sessionTime: sessionTime + elapsed, isTracking };
    }
    return { sessionTime, isTracking };
  }

  // Subscribe to timer updates
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of timer changes
  notifyListeners() {
    const state = this.getTimerState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const timerService = new TimerService();