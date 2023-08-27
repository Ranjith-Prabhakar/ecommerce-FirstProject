document.addEventListener('DOMContentLoaded', () => {
    // stock updation
    const quantityForms = document.querySelectorAll('.quantity-form');

    quantityForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const productId = formData.get('productId');
            const newQuantity = formData.get('quantity');
            const tableRow = form.closest('tr'); // Get the parent row of the form

            try {
                const response = await fetch('/digiWorld/admin/productManagement/addOrRemove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity: newQuantity })
                });

                const data = await response.json();

                if (data.success) {
                    // Update the stock quantity in the table cell
                    const quantityCell = tableRow.querySelector('.quantity');
                    quantityCell.textContent = newQuantity;
                } else {
                    console.error('Failed to update stock:', data.error);
                }
            } catch (error) {
                console.error('Error updating stock:', error);
            }
        });
    });

   

});
