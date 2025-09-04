const STORAGE_KEYS = {
  SESSION_TIME: 'codingSessionTime',      // Accumulated time (in seconds)
  IS_TRACKING: 'codingIsTracking',       // Whether timer is active
  START_TIME: 'codingSessionStartTime',  // Timestamp when current session started
  LOGGED_START: 'codingLoggedStartTime', // Persisted session start time (for logging)
};

class TimerService {
  constructor() {
    this.interval = null;
    this.listeners = new Set();
  }

  // Start the timer
  startTimer() {
    if (this.interval) {
      console.log('Timer already running, ignoring start request');
      return;
    }

    const startTime = Date.now();

    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'true');
    localStorage.setItem(STORAGE_KEYS.START_TIME, startTime.toString());

    // If this is a fresh start, record the logged start
    if (!localStorage.getItem(STORAGE_KEYS.LOGGED_START)) {
      localStorage.setItem(STORAGE_KEYS.LOGGED_START, startTime.toString());
    }

    // Initialize session time if not set
    if (!localStorage.getItem(STORAGE_KEYS.SESSION_TIME)) {
      localStorage.setItem(STORAGE_KEYS.SESSION_TIME, '0');
    }

    // Tick every second to update sessionTime
    this.interval = setInterval(() => {
      const storedTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_TIME) || '0', 10);
      const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10);
      const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const newSessionTime = storedTime + elapsed;
      localStorage.setItem(STORAGE_KEYS.SESSION_TIME, newSessionTime.toString());
      localStorage.setItem(STORAGE_KEYS.START_TIME, Date.now().toString()); // Reset startTime to avoid accumulating elapsed time
      const state = this.getTimerState();
      this.notifyListeners(state);
      // console.log('TimerService tick:', state); // Debug
    }, 1000);

    const initialState = this.getTimerState();
    this.notifyListeners(initialState);
    console.log('Timer started:', initialState);
  }

  // Stop the timer
  stopTimer() {
    if (!this.interval) {
      console.log('No active timer to stop');
      return;
    }

    // Clear the interval and persist the current session time
    clearInterval(this.interval);
    this.interval = null;

    const storedTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_TIME) || '0', 10);
    const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10);
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const finalSessionTime = storedTime + elapsed;
    localStorage.setItem(STORAGE_KEYS.SESSION_TIME, finalSessionTime.toString());
    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'false');
    localStorage.removeItem(STORAGE_KEYS.START_TIME);

    const state = this.getTimerState();
    this.notifyListeners(state);
    console.log('Timer stopped:', state);
  }

  // Reset the timer (clears start + session)
  resetTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    localStorage.setItem(STORAGE_KEYS.SESSION_TIME, '0');
    localStorage.setItem(STORAGE_KEYS.IS_TRACKING, 'false');
    localStorage.removeItem(STORAGE_KEYS.START_TIME);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_START);

    const state = this.getTimerState();
    this.notifyListeners(state);
    console.log('Timer reset:', state);
  }

  // Get current timer state
  getTimerState() {
    const sessionTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_TIME) || '0', 10);
    const isTracking = localStorage.getItem(STORAGE_KEYS.IS_TRACKING) === 'true';
    const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.START_TIME) || '0', 10);

    return { sessionTime, isTracking, startTime: startTime || null };
  }

  // Get the logged start time (when session was first started, not restarted)
  getLoggedStartTime() {
    const loggedStart = parseInt(localStorage.getItem(STORAGE_KEYS.LOGGED_START) || '0', 10);
    return loggedStart ? new Date(loggedStart) : null;
  }

  // Subscribe to timer updates
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getTimerState()); // Initial state
    return () => this.listeners.delete(listener);
  }

  // Notify listeners
  notifyListeners(state) {
    const currentState = state || this.getTimerState();
    this.listeners.forEach((listener) => listener(currentState));
  }
}

export const timerService = new TimerService();