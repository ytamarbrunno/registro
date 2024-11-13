let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let boletos = JSON.parse(localStorage.getItem("boletos")) || [];
let saldoTotal = parseFloat(localStorage.getItem("saldoTotal")) || 0;
let entradas = parseFloat(localStorage.getItem("entradas")) || 0;
let gastos = parseFloat(localStorage.getItem("gastos")) || 0;

// Função para formatar valores de dinheiro
function formatarValor(valor) {
    // Verifica se o valor é um inteiro, se for, remove as casas decimais
    return valor % 1 === 0 ? `R$ ${valor.toFixed(0)}` : `R$ ${valor.toFixed(2)}`;
}

// Função para adicionar um cliente
function adicionarCliente() {
    const nome = document.getElementById("nome").value;
    const perfume = document.getElementById("perfume").value;
    const valorTotal = parseFloat(document.getElementById("valorTotal").value);
    const valorPago = parseFloat(document.getElementById("valorPago").value);

    if (!nome || !perfume || isNaN(valorTotal) || isNaN(valorPago)) {
        alert("Preencha todos os campos corretamente");
        return;
    }

    // Calcular as entradas e gastos
    entradas += valorPago; // A entrada é o valor pago pelo cliente
    gastos += (valorTotal - valorPago); // O restante é considerado gasto

    // Atualiza o saldo
    saldoTotal = entradas - gastos;

    const cliente = {
        nome,
        perfume,
        valorTotal,
        valorPago
    };

    clientes.push(cliente);
    salvarDados();
    atualizarListaClientes(clientes); // Atualiza a lista com todos os clientes
    atualizarResumo();
    limparCampos();
}

// Função para excluir um cliente
function excluirCliente(nome) {
    // Encontra o índice do cliente na lista
    const index = clientes.findIndex(cliente => cliente.nome === nome);

    if (index !== -1) {
        // Remove o cliente do array
        clientes.splice(index, 1);

        // Atualiza os dados no localStorage
        salvarDados();

        // Recalcula o saldo, entradas e gastos
        recalcularResumo();

        // Atualiza a lista de clientes na interface
        atualizarListaClientes(clientes);
    }
}

// Função para adicionar um boleto
function adicionarBoleto() {
    const boletoDescricao = document.getElementById("boletoDescricao").value;
    const boletoValor = parseFloat(document.getElementById("boleto").value);

    if (!boletoDescricao || isNaN(boletoValor) || boletoValor <= 0) {
        alert("Informe uma descrição e um valor válido para o boleto");
        return;
    }

    // Adiciona o boleto à lista de boletos
    const boleto = {
        descricao: boletoDescricao,
        valor: boletoValor
    };
    boletos.push(boleto);

    // Soma o valor do boleto aos gastos
    gastos += boletoValor;

    // Atualiza o saldo
    saldoTotal = entradas - gastos;

    salvarDados();
    atualizarListaBoletos();
    atualizarResumo();
}

// Função para atualizar a lista de clientes
function atualizarListaClientes(clientesParaExibir = clientes) {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = '';
    clientesParaExibir.forEach(cliente => {
        const clienteElement = document.createElement('div');
        clienteElement.classList.add('client');
        clienteElement.innerHTML = `
            <strong>${cliente.nome}</strong> - Perfume: ${cliente.perfume} - Total: ${formatarValor(cliente.valorTotal)} - Pago: ${formatarValor(cliente.valorPago)}
            <div class="progress-bar">
                <div class="progress" style="width: ${(cliente.valorPago / cliente.valorTotal) * 100}%"></div>
            </div>
            <div class="update-section">
                <input type="number" placeholder="Novo pagamento" id="novoPagamento-${cliente.nome}">
                <button onclick="atualizarPagamento('${cliente.nome}')">Atualizar pagamento</button>
            </div>
            <button onclick="excluirCliente('${cliente.nome}')">Excluir</button>
        `;
        clientList.appendChild(clienteElement);
    });
}

// Função para atualizar o pagamento de um cliente
function atualizarPagamento(nome) {
    const novoPagamento = parseFloat(document.getElementById(`novoPagamento-${nome}`).value);
    const cliente = clientes.find(cliente => cliente.nome === nome);

    if (isNaN(novoPagamento) || novoPagamento <= 0 || novoPagamento > cliente.valorTotal - cliente.valorPago) {
        alert("Valor inválido para pagamento");
        return;
    }

    cliente.valorPago += novoPagamento;
    entradas += novoPagamento;
    saldoTotal = entradas - gastos;
    salvarDados();
    atualizarListaClientes();
    atualizarResumo();
}

// Função para atualizar a lista de boletos
function atualizarListaBoletos() {
    const boletoList = document.getElementById("boletoList");
    boletoList.innerHTML = '';
    boletos.forEach(boleto => {
        const boletoElement = document.createElement('div');
        boletoElement.classList.add('boleto');
        boletoElement.innerHTML = `
            <strong>${boleto.descricao}</strong> - ${formatarValor(boleto.valor)}
        `;
        boletoList.appendChild(boletoElement);
    });
}

// Função para atualizar o resumo
function atualizarResumo() {
    document.getElementById("entradas").innerText = `Entradas: ${formatarValor(entradas)}`;
    document.getElementById("gastos").innerText = `Gastos: ${formatarValor(gastos)}`;
    document.getElementById("saldoTotal").innerText = `Saldo Total: ${formatarValor(saldoTotal)}`;
}

// Função para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("boletos", JSON.stringify(boletos));
    localStorage.setItem("saldoTotal", saldoTotal.toFixed(2));
    localStorage.setItem("entradas", entradas.toFixed(2));
    localStorage.setItem("gastos", gastos.toFixed(2));
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById("nome").value = '';
    document.getElementById("perfume").value = '';
    document.getElementById("valorTotal").value = '';
    document.getElementById("valorPago").value = '';
    document.getElementById("boletoDescricao").value = '';
    document.getElementById("boleto").value = '';
}

// Função para alternar entre as seções
function toggleSection(section) {
    const sections = ['clientes', 'boletos', 'resumo'];
    sections.forEach(sec => {
        document.getElementById(sec).classList.add('hidden');
    });
    document.getElementById(section).classList.remove('hidden');
}

// Funções para alternar entre as seções com os botões
document.getElementById("btnClientes").addEventListener("click", function() {
    toggleSection('clientes');
});

document.getElementById("btnBoletos").addEventListener("click", function() {
    toggleSection('boletos');
});

document.getElementById("btnResumo").addEventListener("click", function() {
    toggleSection('resumo');
});

// Inicializa com a seção de Resumo
toggleSection('resumo');

// Atualiza a lista de clientes e boletos ao carregar a página
atualizarListaClientes();
atualizarListaBoletos();
atualizarResumo();

// Função de pesquisa de clientes
function pesquisarClientes() {
    const pesquisa = document.getElementById("searchCliente").value.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => cliente.nome.toLowerCase().includes(pesquisa));
    atualizarListaClientes(clientesFiltrados);
}

// Função para resetar os valores salvos no localStorage
function resetarValores() {
    // Limpa todos os dados armazenados no localStorage
    localStorage.removeItem("clientes");
    localStorage.removeItem("boletos");
    localStorage.removeItem("saldoTotal");
    localStorage.removeItem("entradas");
    localStorage.removeItem("gastos");

    // Resetando as variáveis internas também
    clientes = [];
    boletos = [];
    saldoTotal = 0;
    entradas = 0;
    gastos = 0;

    // Atualiza a interface após o reset
    atualizarResumo();
    atualizarListaClientes();
}

// Função para recalcular o saldo, entradas e gastos
function recalcularResumo() {
    saldoTotal = 0;
    entradas = 0;
    gastos = 0;

    // Percorre todos os clientes e recalcula os valores
    clientes.forEach(cliente => {
        saldoTotal += cliente.valorTotal;
        entradas += cliente.valorPago;
        gastos += (cliente.valorTotal - cliente.valorPago);
    });

    // Atualiza o saldo e os valores salvos
    saldoTotal = entradas - gastos;
    localStorage.setItem("saldoTotal", saldoTotal.toFixed(2));
    localStorage.setItem("entradas", entradas.toFixed(2));
    localStorage.setItem("gastos", gastos.toFixed(2));

    atualizarResumo();
}
// Adiciona um ouvinte de evento para o botão de excluir boletos
document.getElementById("excluirBoletos").addEventListener("click", function() {
    // Exclui os boletos do localStorage
    localStorage.removeItem('boletos');
    
    // Mostra uma mensagem para o usuário informando que os boletos foram excluídos
    alert("Os boletos foram excluídos.");
});

