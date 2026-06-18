document.addEventListener('DOMContentLoaded', () => {
    
    // DOM Elements
    const paymentModal = document.getElementById('paymentModal');
    const gamesGrid = document.getElementById('gamesGrid');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    
    // Modal Text Elements
    const modalGameTitle = document.getElementById('modalGameTitle');
    const modalPrice = document.getElementById('modalPrice');

    // Event Delegation for "Buy Odds" buttons
    // This ensures buttons work even if you dynamically fetch and inject new games later
    gamesGrid.addEventListener('click', (e) => {
        // Find the closest button if the user clicks slightly off the text
        const btn = e.target.closest('.buy-odds-btn');
        
        if (btn) {
            // Extract data from the clicked button
            const gameData = btn.getAttribute('data-game');
            const priceData = btn.getAttribute('data-price');

            // Populate the modal with the specific game's data
            modalGameTitle.textContent = gameData;
            modalPrice.textContent = priceData;

            // Trigger the native HTML5 modal with top-layer priority
            paymentModal.showModal();
            
            // Optional: Provide haptic feedback if supported by the device (iOS Safari supports this sparingly)
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    });

    // Close Modal Logic
    const closeModal = () => {
        // To maintain the smooth exit animation, we can add a class before closing, 
        // but for native dialogs, simple .close() is most reliable.
        paymentModal.close();
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Mock Payment Processing
    confirmPaymentBtn.addEventListener('click', () => {
        const originalText = confirmPaymentBtn.textContent;
        confirmPaymentBtn.textContent = "Processing...";
        confirmPaymentBtn.style.opacity = "0.7";

        // Simulate network request
        setTimeout(() => {
            confirmPaymentBtn.textContent = "Success!";
            confirmPaymentBtn.style.backgroundColor = "#34C759"; // iOS Success Green
            confirmPaymentBtn.style.color = "#fff";
            
            setTimeout(() => {
                closeModal();
                // Reset button for next time
                setTimeout(() => {
                    confirmPaymentBtn.textContent = originalText;
                    confirmPaymentBtn.style.backgroundColor = "#000";
                    confirmPaymentBtn.style.opacity = "1";
                }, 300);
            }, 1000);
        }, 1500);
    });
});
