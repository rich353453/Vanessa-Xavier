const produtos = [
  {
    nome: 'Bolo de Chocolate Belga',
    imagem: '1.jpg',
    preco: 38.00,
    avaliacao: 4.9,
    descricao: 'Bolo úmido com chocolate belga, cobertura cremosa e raspas de chocolate.',
    categoria: 'Chocolate',
  },
  {
    nome: 'Bolo de Morango com Chantilly',
    imagem: '2.jpg',
    preco: 42.00,
    avaliacao: 4.8,
    descricao: 'Massa leve, recheio de morangos frescos e chantilly artesanal.',
    categoria: 'Morango',
  },
  {
    nome: 'Bolo de Cenoura com Ganache',
    imagem: '3.jpg',
    preco: 32.00,
    avaliacao: 4.7,
    descricao: 'Tradicional bolo de cenoura com cobertura de ganache de chocolate meio amargo.',
    categoria: 'Cenoura',
  },
  {
    nome: 'Red Velvet com Cream Cheese',
    imagem: '4.jpg',
    preco: 45.00,
    avaliacao: 4.9,
    descricao: 'Clássico Red Velvet com recheio e cobertura de cream cheese.',
    categoria: 'Red Velvet',
  },
];

let pedidos = [];

let categoriaAtiva = '';

const categorias = [
  { nome: 'Chocolate', imagem: '1.png' },
  { nome: 'Morango', imagem: '2.png' },
  { nome: 'Cenoura', imagem: '3.png' },
  { nome: 'Red Velvet', imagem: '4.png' },
  { nome: 'Prestígio', imagem: '5.png' },
  { nome: 'Limão', imagem: '6.png' },
  { nome: 'Coco', imagem: '7.png' },
];

function renderCategorias() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';
  categorias.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card' + (cat.nome === categoriaAtiva ? ' active' : '');
    card.innerHTML = `
      <img src="${cat.imagem}" class="category-card-img" alt="${cat.nome}" onerror="this.onerror=null;this.src='fallback.png';">
      <span class="category-card-label">${cat.nome}</span>
    `;
    card.onclick = function() {
      document.querySelectorAll('.category-card').forEach(b => b.classList.remove('active'));
      card.classList.add('active');
      categoriaAtiva = cat.nome;
      filtrarProdutos();
    };
    container.appendChild(card);
  });
}

function renderProdutos(lista) {
  const container = document.getElementById('products-list');
  container.innerHTML = '';
  lista.forEach((produto, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <button class="favorite"><i class="ri-heart-line"></i></button>
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <div class="product-info">
        <span class="price">R$ ${produto.preco.toFixed(2)}</span>
        <span class="rating"><span class="star">★</span> ${produto.avaliacao}</span>
      </div>
      <button class="buy">Comprar</button>
    `;
    card.querySelector('.buy').onclick = () => abrirModal(idx);
    card.querySelector('.favorite').onclick = (e) => {
      e.currentTarget.classList.toggle('active');
      const icon = e.currentTarget.querySelector('i');
      icon.className = icon.className.includes('fill') ? 'ri-heart-line' : 'ri-heart-fill';
    };
    container.appendChild(card);
  });
}

function filtrarProdutos() {
  const termo = document.querySelector('.search-bar input').value.toLowerCase();
  let lista = produtos.filter(p => p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo));
  if (categoriaAtiva) lista = lista.filter(p => p.categoria === categoriaAtiva);
  renderProdutos(lista);
}

document.querySelector('.search-bar input').addEventListener('input', filtrarProdutos);

// Modal de detalhes
const modal = document.getElementById('product-modal');
let produtoAtual = null;
function abrirModal(idx) {
  produtoAtual = produtos[idx];
  document.getElementById('modal-img').src = produtoAtual.imagem;
  document.getElementById('modal-title').textContent = produtoAtual.nome;
  document.getElementById('modal-rating').innerHTML = `<span class='star'>★</span> ${produtoAtual.avaliacao}`;
  document.getElementById('modal-desc').textContent = produtoAtual.descricao;
  document.getElementById('modal-kg-input').value = 1;
  modal.style.display = 'flex';
}
document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

// Fechar modal ao pressionar ESC
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});

// Feedback visual ao adicionar/remover pedidos
function feedback(msg, cor = '#8d5c2c') {
  let el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.bottom = '90px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = cor;
  el.style.color = '#fff';
  el.style.padding = '1rem 2rem';
  el.style.borderRadius = '1.2rem';
  el.style.fontWeight = 'bold';
  el.style.fontSize = '1.1rem';
  el.style.zIndex = 99999;
  el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

document.querySelector('.add-to-cart').onclick = () => {
  const kg = parseFloat(document.getElementById('modal-kg-input').value);
  if (!kg || kg < 0.5) return feedback('Selecione uma quantidade válida (mínimo 0,5kg)', '#ea1d2c');
  pedidos.push({ ...produtoAtual, kg });
  modal.style.display = 'none';
  feedback('Produto adicionado ao pedido!');
  if (document.getElementById('orders-list').style.display === 'block') renderPedidos();
};

// Inicialização
renderProdutos(produtos);
renderCategorias();

function renderPedidos() {
  const container = document.getElementById('orders-list');
  container.innerHTML = '<h2>Meus Pedidos</h2>';
  if (pedidos.length === 0) {
    container.innerHTML += '<div class="orders-empty">Nenhum pedido adicionado ainda.</div>';
    // Botão voltar e limpar
    const btnBack = document.createElement('button');
    btnBack.className = 'finalize-order';
    btnBack.style.background = '#8d5c2c';
    btnBack.innerHTML = '<i class="ri-arrow-left-line"></i> Voltar para Home';
    btnBack.onclick = () => {
      pedidos = [];
      categoriaAtiva = '';
      renderCategorias();
      filtrarProdutos();
      document.querySelector('.products-list').style.display = 'block';
      document.getElementById('orders-list').style.display = 'none';
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.nav-btn').classList.add('active');
    };
    container.appendChild(btnBack);
    return;
  }
  pedidos.forEach((pedido, idx) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <img src="${pedido.imagem}" class="order-img" alt="${pedido.nome}">
      <div class="order-info">
        <div class="order-title">${pedido.nome}</div>
        <div class="order-kg">Quantidade: <b>${pedido.kg}kg</b></div>
        <div class="order-price">R$ ${(pedido.preco * pedido.kg).toFixed(2)}</div>
      </div>
      <button class="remove-order"><i class="ri-delete-bin-6-line"></i></button>
    `;
    card.querySelector('.remove-order').onclick = () => {
      pedidos.splice(idx, 1);
      renderPedidos();
      feedback('Pedido removido!', '#ea1d2c');
    };
    container.appendChild(card);
  });
  const btn = document.createElement('button');
  btn.className = 'finalize-order';
  btn.innerHTML = '<i class="ri-whatsapp-line"></i> Finalizar Pedido no WhatsApp';
  btn.onclick = finalizarPedido;
  container.appendChild(btn);
  // Botão voltar e limpar
  const btnBack = document.createElement('button');
  btnBack.className = 'finalize-order';
  btnBack.style.background = '#8d5c2c';
  btnBack.innerHTML = '<i class="ri-arrow-left-line"></i> Voltar e Limpar';
  btnBack.onclick = () => {
    pedidos = [];
    categoriaAtiva = '';
    renderCategorias();
    filtrarProdutos();
    document.querySelector('.products-list').style.display = 'block';
    document.getElementById('orders-list').style.display = 'none';
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav-btn').classList.add('active');
  };
  container.appendChild(btnBack);
}

function finalizarPedido() {
  if (pedidos.length === 0) return;
  let msg = `Olá, Vanessa Xavier! Quero fazer um pedido:\n\n`;
  let total = 0;
  pedidos.forEach((p, i) => {
    msg += `${i+1}. ${p.nome} - ${p.kg}kg (R$ ${(p.preco * p.kg).toFixed(2)})\n`;
    total += p.preco * p.kg;
  });
  msg += `\nTotal: R$ ${total.toFixed(2)}`;
  const url = `https://wa.me/5511973425461?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// Navegação entre abas
const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach((btn, idx) => {
  btn.onclick = () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.innerText.includes('Pedidos')) {
      document.querySelector('.products-list').style.display = 'none';
      document.getElementById('orders-list').style.display = 'block';
      renderPedidos();
    } else {
      document.querySelector('.products-list').style.display = 'block';
      document.getElementById('orders-list').style.display = 'none';
    }
  };
});

// TODO: Implementar aba Pedidos, integração WhatsApp, navegação entre abas, etc. 