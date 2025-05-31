// Elementos do DOM
const editProductForm = document.getElementById('editProductForm');
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Função para carregar os dados do produto
async function loadProductData() {
    try {
        const response = await mockFetch(`http://localhost:3000/products/${productId}`);
        const product = await response.json();

        // Preencher o formulário com os dados do produto
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('image').value = product.image;
        document.getElementById('category').value = product.category;
        document.getElementById('stock').value = product.stock;
    } catch (error) {
        console.error('Erro ao carregar dados do produto:', error);
        alert('Erro ao carregar dados do produto. Tente novamente mais tarde.');
    }
}

// Função para salvar as alterações do produto
async function saveProductChanges(event) {
    event.preventDefault();

    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        image: document.getElementById('image').value,
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value)
    };

    try {
        const response = await mockFetch(`http://localhost:3000/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Produto atualizado com sucesso!');
            window.location.href = 'products.html';
        } else {
            alert('Erro ao atualizar o produto. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar o produto. Tente novamente.');
    }
}

// Event Listeners
editProductForm.addEventListener('submit', saveProductChanges);

// Carregar dados do produto quando a página carregar
document.addEventListener('DOMContentLoaded', loadProductData); 