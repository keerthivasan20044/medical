/**
 * Notification Sound System
 * Handles audio feedback for various system events.
 */

const SOUND_PATHS = {
  new_order: '/assets/sounds/new-order.mp3',
  success: '/assets/sounds/success.mp3',
  alert: '/assets/sounds/alert.mp3',
  message: '/assets/sounds/message.mp3',
};

export const playSound = (type) => {
  try {
    const isEnabled = localStorage.getItem('medipharm_sounds_enabled') !== 'false';
    if (!isEnabled) return;

    const path = SOUND_PATHS[type] || SOUND_PATHS.alert;
    const audio = new Audio(path);
    
    // Set volume based on preference or default
    audio.volume = parseFloat(localStorage.getItem('medipharm_sound_volume') || '0.5');
    
    audio.play().catch(e => {
      // Browser usually blocks auto-play until first interaction
      console.warn('[SoundSystem] Playback blocked or file missing:', e.message);
    });
  } catch (err) {
    console.error('[SoundSystem] Error:', err);
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showBrowserNotification = (title, body, icon = '/logo192.png') => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon,
      badge: icon,
      vibrate: [200, 100, 200]
    });
  }
};
