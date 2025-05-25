document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.product-card .buy');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Produto adicionado ao carrinho!');
        });
    });

    const favorites = document.querySelectorAll('.favorite');
    favorites.forEach(fav => {
        fav.addEventListener('click', function() {
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? '❤' : '♡';
        });
    });
}); 