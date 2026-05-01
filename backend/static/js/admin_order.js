document.addEventListener('DOMContentLoaded', function() {
    
    document.body.addEventListener('change', function(e) {
        
        if (e.target.matches('select[name^="items-"][name$="-product"]')) {
            const select = e.target;
            const productId = select.value;
            const row = select.closest('tr');

            const priceField = row.querySelector('input[name$="-price"]');
            const originalPriceField = row.querySelector('input[name$="-original_price"]');
            const qtyField = row.querySelector('input[name$="-quantity"]');
            const totalField = row.querySelector('input[name$="-total_price"]');

            if (productId) {
                // API ko call karo
                fetch(`/api/orders/get-price/${productId}/`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.price) {
                            if (priceField) priceField.value = data.price;
                            if (originalPriceField && data.original_price) originalPriceField.value = data.original_price;
                            
                            if(qtyField && !qtyField.value) qtyField.value = 1;
                            
                            let qty = parseInt(qtyField ? qtyField.value : 1);
                            if (totalField) totalField.value = data.price * qty;
                        }
                    });
            }
        }
    });

    document.body.addEventListener('input', function(e) {
        if (e.target.matches('input[name^="items-"][name$="-quantity"]')) {
            const qtyField = e.target;
            const row = qtyField.closest('tr');
            
            const priceField = row.querySelector('input[name$="-price"]');
            const totalField = row.querySelector('input[name$="-total_price"]');

            if (priceField && totalField && priceField.value) {
                const price = parseFloat(priceField.value) || 0;
                const qty = parseInt(qtyField.value) || 0;
                totalField.value = price * qty; // Live calculation
            }
        }
    });
});