export const showNotification = (title: string, options?: { body?: string; icon?: string }) => {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    alert(title); // Fallback to alert
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, options);
      } else {
        alert(title); // Fallback to alert if permission denied
      }
    });
  } else {
    alert(title); // Fallback to alert if permission is denied
  }
};
