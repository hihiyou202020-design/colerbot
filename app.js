// ================= কনফিগারেশন =================
const BOT_TOKEN = "8783295110:AAHDUliolZ07YZoCa7mGyXs1tCx5Ga5Q1Yk";
const BOT_USERNAME = "@HTML_MAIL_SENDER_BOT"; // আপনার বটের ইউজারনেম দিন
const ADMIN_ID = "7151641035"; // আপনার টেলিগ্রাম আইডি - স্টার এখানে আসবে

// ================= প্যাকেজ লিস্ট =================
const PACKAGES = [
    {
        id: 1,
        name: "Micro",
        emails: 5,
        stars: 15,
        icon: "🌱",
        badge: "Best Value",
        savings: "Save 20%"
    },
    {
        id: 2,
        name: "Starter",
        emails: 10,
        stars: 30,
        icon: "📧",
        badge: "Popular",
        savings: "Save 25%"
    },
    {
        id: 3,
        name: "Basic",
        emails: 15,
        stars: 45,
        icon: "📨",
        badge: "Hot Deal",
        savings: "Save 28%"
    },
    {
        id: 4,
        name: "Plus",
        emails: 22,
        stars: 60,
        icon: "📫",
        badge: "Best Deal",
        savings: "Save 32%"
    },
    {
        id: 5,
        name: "Pro",
        emails: 30,
        stars: 80,
        icon: "📬",
        badge: "Recommended",
        savings: "Save 35%"
    },
    {
        id: 6,
        name: "Premium",
        emails: 40,
        stars: 100,
        icon: "📭",
        badge: "Super Value",
        savings: "Save 38%"
    },
    {
        id: 7,
        name: "Business",
        emails: 50,
        stars: 120,
        icon: "💼",
        badge: "Most Popular",
        savings: "Save 40%"
    },
    {
        id: 8,
        name: "Enterprise",
        emails: 65,
        stars: 150,
        icon: "🏢",
        badge: "Best Price",
        savings: "Save 45%"
    },
    {
        id: 9,
        name: "Ultimate",
        emails: 80,
        stars: 180,
        icon: "👑",
        badge: "Premium",
        savings: "Save 48%"
    },
    {
        id: 10,
        name: "Mega",
        emails: 100,
        stars: 220,
        icon: "💎",
        badge: "Epic Deal",
        savings: "Save 50%"
    },
    {
        id: 11,
        name: "Massive",
        emails: 150,
        stars: 320,
        icon: "🚀",
        badge: "Insane Deal",
        savings: "Save 55%"
    },
    {
        id: 12,
        name: "Unlimited Vibe",
        emails: 200,
        stars: 400,
        icon: "⚡",
        badge: "Ultimate",
        savings: "Save 60%"
    }
];

// ================= গ্লোবাল ভেরিয়েবল =================
let currentUser = null;
let selectedPackage = null;

// ================= পৃষ্ঠা লোড হলে =================
document.addEventListener('DOMContentLoaded', () => {
    renderPackages();
    checkTelegramLogin();
    setupPaymentWebhook();
});

// ================= পেমেন্ট ওয়েবহুক সেটআপ =================
function setupPaymentWebhook() {
    // টেলিগ্রাম বটকে জানিয়ে দিই যে ওয়েব অ্যাপ থেকে পেমেন্ট আসবে
    const webhookUrl = `${window.location.origin}/payment-webhook`;
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
    }).catch(console.error);
}

// ================= প্যাকেজ রেন্ডার করা =================
function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    PACKAGES.forEach((pkg) => {
        const card = document.createElement('div');
        card.className = `package-card ${pkg.badge === 'Most Popular' ? 'popular' : ''}`;
        
        if (pkg.badge === 'Most Popular') {
            card.innerHTML += `<div class="popular-badge">🔥 MOST POPULAR</div>`;
        }
        
        card.innerHTML += `
            ${pkg.badge !== 'Most Popular' ? `<div class="package-badge">${pkg.badge}</div>` : ''}
            <div class="package-icon">${pkg.icon}</div>
            <h3 class="package-name">${pkg.name}</h3>
            <div class="package-emails">📧 ${pkg.emails} additional emails</div>
            <div class="package-price">${pkg.stars} <span>⭐ stars</span></div>
            <div class="package-savings">💰 ${pkg.savings}</div>
            <button class="package-btn" onclick="selectPackage(${pkg.id})">
                ⭐ Buy Now
            </button>
        `;
        
        grid.appendChild(card);
    });
}

// ================= টেলিগ্রাম লগইন চেক করা =================
function checkTelegramLogin() {
    const widget = document.getElementById('telegram-login');
    if (!widget) return;
    
    widget.innerHTML = '';
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '24');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-on-auth', 'onTelegramAuth');
    
    widget.appendChild(script);
}

// ================= টেলিগ্রাম অথ সাকসেস =================
window.onTelegramAuth = function(user) {
    currentUser = user;
    
    document.getElementById('userInfo')?.classList.remove('hidden');
    document.getElementById('loginSection')?.classList.add('hidden');
    document.getElementById('userName').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('userAvatar').src = user.photo_url || 'https://via.placeholder.com/60';
    
    checkUserBalance(user.id);
    showToast(`Welcome ${user.first_name}! 👋`, 'success');
};

// ================= ইউজার ব্যালেন্স চেক করা =================
async function checkUserBalance(userId) {
    try {
        // আপনার বটের API থেকে ব্যালেন্স আনা
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUserBalance?user_id=${userId}`);
        const balance = 0; // ডিফল্ট
        document.getElementById('userBalance').textContent = balance;
    } catch (error) {
        document.getElementById('userBalance').textContent = "0";
    }
}

// ================= প্যাকেজ সিলেক্ট করা =================
function selectPackage(packageId) {
    if (!currentUser) {
        showToast('❌ Please login with Telegram first!', 'error');
        return;
    }
    
    selectedPackage = PACKAGES.find(p => p.id === packageId);
    
    if (selectedPackage) {
        const modalDetails = document.getElementById('modalPackageDetails');
        if (modalDetails) {
            modalDetails.innerHTML = `
                <div style="font-size: 3em;">${selectedPackage.icon}</div>
                <div style="font-size: 1.3em; font-weight: bold; margin: 10px 0;">${selectedPackage.name}</div>
                <div style="font-size: 1.1em;">📧 ${selectedPackage.emails} emails</div>
                <div style="font-size: 2em; color: #667eea; margin-top: 10px;">${selectedPackage.stars} ⭐</div>
                <div style="font-size: 0.9em; color: #666; margin-top: 10px;">⭐ Stars will be sent to @Anik7660</div>
            `;
        }
        document.getElementById('modal')?.classList.remove('hidden');
    }
}

// ================= কনফার্ম পারচেজ (স্টার পেমেন্ট) =================
async function confirmPurchase() {
    if (!selectedPackage || !currentUser) return;
    
    closeModal();
    showToast('⏳ Creating invoice...', 'info');
    
    // স্টার পেমেন্ট ইনভয়েস তৈরি করা
    const success = await createStarInvoice(currentUser.id, selectedPackage);
    
    if (success) {
        showToast('✅ Invoice sent to Telegram! Please complete the payment.', 'success');
        
        // পেমেন্ট স্ট্যাটাস মনিটর করা
        monitorPaymentStatus(currentUser.id, selectedPackage);
    } else {
        showToast('❌ Failed to create invoice. Please try again.', 'error');
    }
}

// ================= স্টার ইনভয়েস তৈরি করা =================
async function createStarInvoice(userId, pkg) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`;
    
    // ইউনিক পেমেন্ট আইডি তৈরি
    const paymentId = `PAY_${userId}_${pkg.id}_${Date.now()}`;
    
    const payload = {
        chat_id: userId,
        title: `✨ ${pkg.emails} Extra Emails - ${pkg.name} Pack`,
        description: `📧 Get ${pkg.emails} additional email sends\n💎 Package: ${pkg.name}\n💰 Savings: ${pkg.savings}\n\n⭐ Stars will be sent to bot admin.`,
        payload: paymentId,
        provider_token: "",
        currency: "XTR",
        prices: [{
            label: `${pkg.emails} Emails + Bonus`,
            amount: pkg.stars
        }],
        start_parameter: `buy_${pkg.id}_${userId}`,
        need_name: false,
        need_phone_number: false,
        need_email: false,
        send_phone_number_to_provider: false,
        send_email_to_provider: false
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.ok) {
            // পেমেন্ট লিঙ্ক সংরক্ষণ
            localStorage.setItem(`payment_${paymentId}`, JSON.stringify({
                userId: userId,
                packageId: pkg.id,
                emails: pkg.emails,
                stars: pkg.stars,
                status: 'pending',
                timestamp: Date.now()
            }));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Payment error:', error);
        return false;
    }
}

// ================= পেমেন্ট স্ট্যাটাস মনিটর করা =================
async function monitorPaymentStatus(userId, pkg) {
    let attempts = 0;
    const maxAttempts = 60; // 60 সেকেন্ড পর্যন্ত অপেক্ষা
    
    const interval = setInterval(async () => {
        attempts++;
        
        // ইউজারের ব্যালেন্স চেক করা (পেমেন্ট সফল হলে ব্যালেন্স বাড়বে)
        const newBalance = await checkPaymentSuccess(userId, pkg);
        
        if (newBalance !== null) {
            clearInterval(interval);
            document.getElementById('userBalance').textContent = newBalance;
            showToast(`🎉 Payment successful! ${pkg.emails} emails added to your balance!`, 'success');
            
            // অ্যাডমিনকে নোটিফিকেশন
            notifyAdmin(userId, pkg);
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            showToast('⏰ Payment not completed. You can try again.', 'info');
        }
    }, 1000);
}

// ================= পেমেন্ট সাকসেস চেক করা =================
async function checkPaymentSuccess(userId, pkg) {
    try {
        // আপনার বটের API কল - চেক করে পেমেন্ট হয়েছে কিনা
        // এখানে আপনি আপনার বটে একটি কাস্টম API তৈরি করতে পারেন
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
        // সিম্পলিফাইড: আসলে এখানে আপনার বটের পেমেন্ট ওয়েবহুক থেকে ডাটা নেওয়া উচিত
        
        // আপাতত লোকাল স্টোরেজ চেক করছি
        const payments = Object.keys(localStorage).filter(key => key.startsWith('payment_'));
        
        for (const key of payments) {
            const payment = JSON.parse(localStorage.getItem(key));
            if (payment.userId === userId && payment.status === 'completed') {
                localStorage.removeItem(key);
                return payment.newBalance;
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// ================= অ্যাডমিনকে নোটিফিকেশন =================
async function notifyAdmin(userId, pkg) {
    const message = `
🎉 *New Star Payment Received!*

👤 *User ID:* ${userId}
👤 *Username:* @${currentUser?.username || 'N/A'}
📧 *Package:* ${pkg.name} (${pkg.emails} emails)
⭐ *Stars Paid:* ${pkg.stars} ⭐
💰 *Total Revenue:* ${pkg.stars} Stars

✅ *Status:* Payment Successful
⏰ *Time:* ${new Date().toLocaleString()}
    `;
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error('Failed to notify admin:', error);
    }
}

// ================= ওয়েবহুক হ্যান্ডলার (পেমেন্ট রিসিভ) =================
// এই ফাংশনটি আপনার সার্ভারে পোস্ট রিকোয়েস্ট হ্যান্ডেল করবে
window.handlePaymentWebhook = async function(paymentData) {
    const { paymentId, userId, packageId, status, stars_amount } = paymentData;
    
    if (status === 'completed') {
        const pkg = PACKAGES.find(p => p.id === packageId);
        if (pkg) {
            // ব্যালেন্স আপডেট করা
            const currentBalance = parseInt(localStorage.getItem(`balance_${userId}`) || '0');
            const newBalance = currentBalance + pkg.emails;
            localStorage.setItem(`balance_${userId}`, newBalance);
            
            // পেমেন্ট লোকালি সেভ করা
            localStorage.setItem(`payment_${paymentId}`, JSON.stringify({
                userId: userId,
                packageId: packageId,
                emails: pkg.emails,
                stars: pkg.stars,
                status: 'completed',
                newBalance: newBalance,
                timestamp: Date.now()
            }));
            
            // স্টার অ্যাডমিন অ্যাকাউন্টে চলে গেছে (টেলিগ্রাম অটোমেটিক)
            showToast(`✅ ${pkg.emails} emails added to your balance!`, 'success');
            
            // অ্যাডমিনকে জানানো
            const adminMsg = `⭐ New payment received!\nUser: ${userId}\nPackage: ${pkg.name}\nStars: ${stars_amount}\nEmails: ${pkg.emails}`;
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: ADMIN_ID, text: adminMsg })
            });
        }
    }
};

// ================= ইউজার ডিপোজিট হিস্ট্রি =================
async function getUserDeposits(userId) {
    const deposits = [];
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
        if (key.startsWith('payment_')) {
            const payment = JSON.parse(localStorage.getItem(key));
            if (payment.userId === userId && payment.status === 'completed') {
                deposits.push(payment);
            }
        }
    }
    
    return deposits;
}

// ================= লগআউট =================
function logout() {
    currentUser = null;
    selectedPackage = null;
    document.getElementById('userInfo')?.classList.add('hidden');
    document.getElementById('loginSection')?.classList.remove('hidden');
    checkTelegramLogin();
    showToast('Logged out successfully!', 'info');
}

// ================= মডাল ক্লোজ =================
function closeModal() {
    document.getElementById('modal')?.classList.add('hidden');
    selectedPackage = null;
}

// ================= টোস্ট নোটিফিকেশন =================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.remove('hidden');
    
    if (type === 'error') {
        toast.style.background = '#ff4757';
    } else if (type === 'success') {
        toast.style.background = '#4caf50';
    } else {
        toast.style.background = '#667eea';
    }
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ================= মডালের বাইরে ক্লিক করলে ক্লোজ =================
document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        closeModal();
    }
});

// ================= কীবোর্ড ESC প্রেস করলে ক্লোজ =================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ================= পেজ আনলোড হলে ক্লিনআপ =================
window.addEventListener('beforeunload', () => {
    // কোনো ক্লিনআপ কোড থাকলে
});
