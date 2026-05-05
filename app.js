// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// Expand to full screen
tg.expand();

// Main button settings
tg.MainButton.text = "Close";
tg.MainButton.onClick(() => tg.close());

// Check if user is admin (7151641035)
// টেলিগ্রাম Web App থেকে ইউজার আইডি পাওয়া যায়
const userId = tg.initDataUnsafe?.user?.id || null;

// Admin ID
const ADMIN_ID = 7151641035;

// যদি এডমিন হয়, তাহলে এডমিন গ্রুপ দেখান
if (userId === ADMIN_ID) {
    const adminGroup = document.getElementById('adminGroup');
    if (adminGroup) {
        adminGroup.style.display = 'block';
    }
}

// Send action to bot
function sendAction(action) {
    // Show loading
    const loading = document.getElementById('loading');
    loading.classList.add('show');
    
    // Send data to bot
    tg.sendData(JSON.stringify({
        action: action,
        user_id: userId
    }));
    
    // Close after sending
    setTimeout(() => {
        loading.classList.remove('show');
        tg.close();
    }, 500);
}

// Theme handling
tg.onEvent('themeChanged', () => {
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#0a0f1e';
});

// Ready
tg.ready();
