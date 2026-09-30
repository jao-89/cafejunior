// Dados em memória para a simulação do Front-end
const produtos = [
  { id: 1, nome: "Café Júnior Gourmet", descricao: "Café 100% Arábica de alta qualidade, notas florais e caramelo. Torra artesanal em Carmo do Rio Claro.", preco: 32.00, imagem: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80", tipo: "AMBOS", estoque: 45 },
  { id: 2, nome: "Café Júnior Tradicional", descricao: "Sabor encorpado e marcante. Acompanhamento ideal para o seu café da manhã diário.", preco: 26.00, imagem: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80", tipo: "MOIDO", estoque: 60 },
  { id: 3, nome: "Café Júnior Reserva da Serra", descricao: "Seleção especial dos melhores grãos colhidos nas montanhas de Carmo do Rio Claro MG.", preco: 58.00, imagem: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=500&q=80", tipo: "GRAO", estoque: 20 }
];

let carrinho = [];

function renderProdutos() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';
  
  produtos.forEach(p => {
    let selectTipoHTML = '';
    if(p.tipo === 'AMBOS') {
      selectTipoHTML = `
        <div class="product-options">
          <label>Apresentação:</label>
          <select id="tipo-${p.id}">
            <option value="Moído">Moído (500g)</option>
            <option value="Em Grão">Em Grão (500g)</option>
          </select>
        </div>`;
    } else {
      const tipoNome = p.tipo === 'GRAO' ? 'Em Grão' : 'Moído';
      selectTipoHTML = `<input type="hidden" id="tipo-${p.id}" value="${tipoNome}">
      <p style="font-size:0.8rem; margin-bottom:10px;"><b>Tipo:</b> ${tipoNome}</p>`;
    }

    container.innerHTML += `
      <div class="product-card">
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="product-card-body">
          <div class="product-title">${p.nome}</div>
          <div class="product-desc">${p.descricao}</div>
          ${selectTipoHTML}
          <div class="price-row">
            <span class="price">R$ ${p.preco.toFixed(2)}</span>
            <button class="btn" onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
          </div>
        </div>
      </div>
    `;
  });
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  const tipoSelect = document.getElementById(`tipo-${id}`).value;
  
  const itemExistente = carrinho.find(i => i.id === id && i.tipo === tipoSelect);
  if(itemExistente) {
    itemExistente.qtd++;
  } else {
    carrinho.push({ ...produto, tipo: tipoSelect, qtd: 1 });
  }
  
  atualizarCarrinho();
  alert(`${produto.nome} (${tipoSelect}) adicionado ao carrinho!`);
}

function atualizarCarrinho() {
  document.getElementById('cartCount').innerText = carrinho.reduce((acc, i) => acc + i.qtd, 0);
  const itemsContainer = document.getElementById('cartItems');
  itemsContainer.innerHTML = '';
  
  let total = 0;
  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    itemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <b>${item.nome}</b> (${item.tipo})<br>
          ${item.qtd}x R$ ${item.preco.toFixed(2)}
        </div>
        <div>
          R$ ${subtotal.toFixed(2)}
          <button onclick="removerItem(${index})" style="background:red; color:white; border:none; padding:2px 6px; border-radius:3px; margin-left:5px; cursor:pointer;">X</button>
        </div>
      </div>
    `;
  });
  
  document.getElementById('cartTotal').innerText = total.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function abrirCarrinho() { document.getElementById('cartModal').style.display = 'flex'; }
function fecharCarrinho() { document.getElementById('cartModal').style.display = 'none'; }

function fecharLGPD() {
  document.getElementById('lgpdBanner').style.display = 'none';
}

function enviarPedidoWhatsApp() {
  if(carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  
  const nome = document.getElementById('clienteNome').value;
  const tel = document.getElementById('clienteTel').value;
  const entrega = document.getElementById('tipoEntrega').value;
  const endereco = document.getElementById('clienteEndereco').value;
  const pagamento = document.getElementById('formaPagamento').value;
  
  if(!nome || !tel || (entrega === 'ENTREGA' && !endereco)) {
    alert("Por favor, preencha todos os campos obrigatórios para o pedido.");
    return;
  }

  let mensagem = `*NOVO PEDIDO DE CAFÉ JÚNIOR*\n`;
  mensagem += `----------------------------------------\n`;
  mensagem += `*Cliente:* ${nome}\n`;
  mensagem += `*Telefone:* ${tel}\n`;
  mensagem += `*Entrega:* ${entrega === 'ENTREGA' ? 'Entrega em Carmo do Rio Claro' : 'Retirada no Local'}\n`;
  if(entrega === 'ENTREGA') mensagem += `*Endereço:* ${endereco}\n`;
  mensagem += `*Forma de Pagamento:* ${pagamento}\n`;
  mensagem += `----------------------------------------\n`;
  mensagem += `*ITENS DO PEDIDO:*\n`;

  let total = 0;
  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    mensagem += `• ${item.qtd}x ${item.nome} (${item.tipo}) - R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem += `----------------------------------------\n`;
  mensagem += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  mensagem += `_Pedido enviado via site Oficial Café Júnior (Carmo do Rio Claro - MG)_`;

  const numeroWhatsApp = "5535999887766";
  const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
  
  window.open(url, '_blank');
  carrinho = [];
  atualizarCarrinho();
  fecharCarrinho();
}

function toggleAdmin() {
  const panel = document.getElementById('adminPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  if(panel.style.display === 'block') {
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

// Inicializar catálogo na página
renderProdutos();