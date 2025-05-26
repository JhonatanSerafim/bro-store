// Estado da aplicação
let cartItems = [];
let addresses = [];
let selectedAddress = null;
let selectedPaymentMethod = null;
let currentStep = 'address';

// Elementos do DOM
const checkoutSteps = document.querySelectorAll('.checkout-step');
const progressSteps = document.querySelectorAll('.progress-step');
const addressesList = document.getElementById('addressesList');
const orderItems = document.getElementById('orderItems');
const deliveryInfo = document.getElementById('deliveryInfo');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const nextStepBtn = document.getElementById('nextStepBtn');
const previousStepBtn = document.getElementById('previousStepBtn');
const addAddressBtn = document.getElementById('addAddressBtn');
const addressModal = document.getElementById('addressModal');
const addressForm = document.getElementById('addressForm');
const cancelAddressBtn = document.getElementById('cancelAddress');

// Formatar preço
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

// Carregar dados iniciais
const loadCheckoutData = async () => {
    try {
        // Carregar carrinho
        const cartResponse = await fetch('/api/cart');
        cartItems = await cartResponse.json();

        // Carregar endereços
        const addressesResponse = await fetch('/api/user/addresses');
        addresses = await addressesResponse.json();

        renderAddresses();
        renderOrderItems();
        updateTotals();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showFeedback('Erro ao carregar dados do checkout', 'error');
    }
};

// Renderizar endereços
const renderAddresses = () => {
    addressesList.innerHTML = addresses.map(address => `
        <div class="address-card ${address.id === selectedAddress?.id ? 'selected' : ''}"
            onclick="selectAddress(${address.id})">
            <p>${address.street}</p>
            <p>${address.city} - ${address.state}</p>
            <p>CEP: ${address.zip_code}</p>
        </div>
    `).join('');
};

// Renderizar itens do pedido
const renderOrderItems = () => {
    orderItems.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Quantidade: ${item.quantity}</p>
                <p class="price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
};

// Atualizar totais
const updateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );
    const shipping = selectedAddress ? 15 : 0; // Valor fixo para exemplo
    const total = subtotal + shipping;

    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = shipping ? formatPrice(shipping) : 'Calculado no checkout';
    totalElement.textContent = formatPrice(total);
};

// Selecionar endereço
const selectAddress = (addressId) => {
    selectedAddress = addresses.find(a => a.id === addressId);
    renderAddresses();
    updateTotals();
};

// Adicionar endereço
addAddressBtn.addEventListener('click', () => {
    addressModal.classList.add('active');
});

// Fechar modal de endereço
cancelAddressBtn.addEventListener('click', () => {
    addressModal.classList.remove('active');
    addressForm.reset();
});

// Salvar endereço
addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const addressData = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip_code: document.getElementById('zipCode').value
    };

    try {
        const response = await fetch('/api/user/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            const newAddress = await response.json();
            addresses.push(newAddress);
            renderAddresses();
            addressModal.classList.remove('active');
            addressForm.reset();
            showFeedback('Endereço adicionado com sucesso!');
        } else {
            throw new Error('Erro ao adicionar endereço');
        }
    } catch (error) {
        showFeedback('Erro ao adicionar endereço', 'error');
    }
});

// Navegar entre etapas
const goToStep = (step) => {
    currentStep = step;
    
    // Atualizar etapas
    checkoutSteps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach(s => {
        s.classList.remove('active', 'completed');
        if (s.dataset.step === step) {
            s.classList.add('active');
        } else if (getStepIndex(s.dataset.step) < getStepIndex(step)) {
            s.classList.add('completed');
        }
    });

    // Mostrar etapa atual
    document.getElementById(`${step}Step`).classList.add('active');

    // Atualizar botões
    updateNavigationButtons();

    // Atualizar conteúdo específico da etapa
    if (step === 'review') {
        updateDeliveryInfo();
    }
};

// Obter índice da etapa
const getStepIndex = (step) => {
    const steps = ['address', 'review', 'payment'];
    return steps.indexOf(step);
};

// Atualizar botões de navegação
const updateNavigationButtons = () => {
    const isFirstStep = currentStep === 'address';
    const isLastStep = currentStep === 'payment';

    previousStepBtn.style.display = isFirstStep ? 'none' : 'block';
    nextStepBtn.textContent = isLastStep ? 'Finalizar Pedido' : 'Continuar';
};

// Atualizar informações de entrega
const updateDeliveryInfo = () => {
    if (!selectedAddress) return;

    deliveryInfo.innerHTML = `
        <h3>Endereço de Entrega</h3>
        <p>${selectedAddress.street}</p>
        <p>${selectedAddress.city} - ${selectedAddress.state}</p>
        <p>CEP: ${selectedAddress.zip_code}</p>
        <p class="delivery-estimate">
            Prazo de entrega estimado: 5-7 dias úteis
        </p>
    `;
};

// Validar etapa atual
const validateCurrentStep = () => {
    switch (currentStep) {
        case 'address':
            if (!selectedAddress) {
                showFeedback('Selecione um endereço de entrega', 'warning');
                return false;
            }
            break;
        case 'review':
            // Nada a validar na revisão
            break;
        case 'payment':
            if (!document.querySelector('input[name="paymentMethod"]:checked')) {
                showFeedback('Selecione uma forma de pagamento', 'warning');
                return false;
            }
            break;
    }
    return true;
};

// Próxima etapa
nextStepBtn.addEventListener('click', async () => {
    if (!validateCurrentStep()) return;

    const steps = ['address', 'review', 'payment'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentStep === 'payment') {
        // Finalizar pedido
        try {
            const orderData = {
                items: cartItems,
                address_id: selectedAddress.id,
                payment_method: document.querySelector('input[name="paymentMethod"]:checked').value
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                window.location.href = 'order-confirmation.html';
            } else {
                throw new Error('Erro ao finalizar pedido');
            }
        } catch (error) {
            showFeedback('Erro ao finalizar pedido', 'error');
        }
    } else {
        goToStep(steps[currentIndex + 1]);
    }
});

// Etapa anterior
previousStepBtn.addEventListener('click', () => {
    const steps = ['address', 'review', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    goToStep(steps[currentIndex - 1]);
});

// Mostrar feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    document.querySelector('.checkout-container').insertBefore(
        feedbackDiv,
        document.querySelector('.checkout-progress')
    );
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Inicialização
loadCheckoutData(); 