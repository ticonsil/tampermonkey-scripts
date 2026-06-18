// ==UserScript==
// @name         Onboarding em Massa
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cadastrar Onboarding em Massa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=125*
// @grant        none
// @downloadURL  https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Gest%C3%A3o%20de%20Processos/onboardingEmMassa.user.js
// @updateURL    https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Gest%C3%A3o%20de%20Processos/onboardingEmMassa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Cadastrar Onboarding em Massa"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'app.acessorias.com/sysmain.php?m=125*');
  scriptInfo.setAttribute('data-name', 'Cadastrar Onboarding em Massa');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
const processos   = [323, 322, 324, 321, 320];
const responsaveis = [59459, 91751, 229029, 60815, 94707];
let empresas = [];
let empresaAtual  = 0;
let processoAtual = 0;

// ─── MODAL ────────────────────────────────────────────────────────────────────
function criarModal() {
    const jaExiste = document.getElementById('onboarding-modal');
    if (jaExiste) jaExiste.remove();

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-modal';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:rgba(0,0,0,.55)',
        'z-index:99999', 'display:flex', 'align-items:center', 'justify-content:center'
    ].join(';');

    // Caixa central
    const box = document.createElement('div');
    box.style.cssText = [
        'background:#fff', 'padding:28px 32px', 'border-radius:10px',
        'min-width:440px', 'box-shadow:0 6px 24px rgba(0,0,0,.25)',
        'font-family:Arial,sans-serif'
    ].join(';');

    // Título
    const titulo = document.createElement('h3');
    titulo.textContent = 'Onboarding em Massa';
    titulo.style.cssText = 'margin:0 0 6px 0;color:#222;font-size:18px;';

    // Subtítulo
    const sub = document.createElement('p');
    sub.textContent = 'Informe os IDs das empresas separados por vírgula:';
    sub.style.cssText = 'margin:0 0 14px 0;color:#555;font-size:13px;';

    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'empresas-input';
    input.placeholder = 'Ex: 406, 414, 409';
    input.style.cssText = [
        'width:100%', 'padding:10px 12px', 'border:1px solid #ccc',
        'border-radius:6px', 'font-size:14px', 'box-sizing:border-box',
        'outline:none', 'transition:border .2s'
    ].join(';');
    input.onfocus = function() { input.style.border = '1px solid #007bff'; };
    input.onblur  = function() { input.style.border = '1px solid #ccc'; };

    // Mensagem de erro
    const erro = document.createElement('p');
    erro.id = 'onboarding-erro';
    erro.textContent = 'Insira pelo menos um ID numérico válido.';
    erro.style.cssText = 'color:#e53935;font-size:12px;margin:6px 0 0 0;display:none;';

    // Rodapé com botões
    const rodape = document.createElement('div');
    rodape.style.cssText = 'margin-top:22px;display:flex;gap:10px;justify-content:flex-end;';

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.style.cssText = [
        'padding:8px 22px', 'background:#e0e0e0', 'color:#333',
        'border:none', 'border-radius:6px', 'cursor:pointer', 'font-size:14px'
    ].join(';');

    const btnIniciar = document.createElement('button');
    btnIniciar.textContent = 'Iniciar';
    btnIniciar.style.cssText = [
        'padding:8px 22px', 'background:#007bff', 'color:#fff',
        'border:none', 'border-radius:6px', 'cursor:pointer', 'font-size:14px',
        'font-weight:bold'
    ].join(';');

    // Ações
    btnCancelar.onclick = function () { overlay.remove(); };

    btnIniciar.onclick = function () {
        const val = document.getElementById('empresas-input').value;
        empresas = val
            .split(',')
            .map(function (id) { return parseInt(id.trim(), 10); })
            .filter(function (id) { return !isNaN(id) && id > 0; });

        if (empresas.length === 0) {
            document.getElementById('onboarding-erro').style.display = 'block';
            return;
        }

        overlay.remove();
        empresaAtual  = 0;
        processoAtual = 0;
        totalCadastros = empresas.length * processos.length;
        cadastrosConcluidos = 0;
        criarModalProgresso();
        preencherFormulario();
        cadastro.onsubmit = enviarFormulario;
        enviarFormulario();
    };

    // Atalho: Enter confirma
    input.onkeydown = function (e) { if (e.key === 'Enter') btnIniciar.click(); };

    // Monta estrutura
    rodape.appendChild(btnCancelar);
    rodape.appendChild(btnIniciar);
    box.appendChild(titulo);
    box.appendChild(sub);
    box.appendChild(input);
    box.appendChild(erro);
    box.appendChild(rodape);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(function () { input.focus(); }, 80);
}

function preencherFormulario() {
    document.querySelector("select#PusProcID").value = processos[processoAtual].toString();
    document.querySelector("select#PusRespLogID").value = responsaveis[processoAtual].toString();
    $('#PusEmpID').val(empresas[empresaAtual].toString());
    descP(document.querySelector('input#PusTitulo'));
}

function descP(inputy) {
    if ($("#PusProcID").val() > 0) {
        inputy.value = $("#PusProcID").find(":selected").text();
    }
}

// ─── MODAL DE PROGRESSO ───────────────────────────────────────────────────────
function criarModalProgresso() {
    const jaExiste = document.getElementById('onboarding-progresso-modal');
    if (jaExiste) jaExiste.remove();

    const totalCadastros = empresas.length * processos.length;

    const overlay = document.createElement('div');
    overlay.id = 'onboarding-progresso-modal';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:rgba(0,0,0,.55)',
        'z-index:99999', 'display:flex', 'align-items:center', 'justify-content:center'
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
        'background:#fff', 'padding:28px 32px', 'border-radius:10px',
        'width:520px', 'max-width:95vw', 'box-shadow:0 6px 24px rgba(0,0,0,.25)',
        'font-family:Arial,sans-serif', 'display:flex', 'flex-direction:column', 'gap:14px'
    ].join(';');

    // Cabeçalho
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Onboarding em Massa — Progresso';
    titulo.style.cssText = 'margin:0;color:#222;font-size:17px;';

    const badge = document.createElement('span');
    badge.id = 'ob-badge';
    badge.textContent = '0 / ' + totalCadastros;
    badge.style.cssText = [
        'background:#e3f0ff', 'color:#0056b3', 'font-size:12px', 'font-weight:bold',
        'padding:3px 10px', 'border-radius:20px'
    ].join(';');

    header.appendChild(titulo);
    header.appendChild(badge);

    // Barra de progresso
    const barraWrap = document.createElement('div');
    barraWrap.style.cssText = [
        'background:#e9ecef', 'border-radius:6px', 'height:10px', 'overflow:hidden'
    ].join(';');

    const barra = document.createElement('div');
    barra.id = 'ob-barra';
    barra.style.cssText = [
        'height:100%', 'width:0%', 'background:linear-gradient(90deg,#007bff,#00c6ff)',
        'border-radius:6px', 'transition:width .4s ease'
    ].join(';');

    barraWrap.appendChild(barra);

    // Status atual
    const statusAtual = document.createElement('p');
    statusAtual.id = 'ob-status-atual';
    statusAtual.textContent = 'Iniciando…';
    statusAtual.style.cssText = 'margin:0;color:#555;font-size:13px;';

    // Lista de logs
    const listaWrap = document.createElement('div');
    listaWrap.style.cssText = [
        'background:#f8f9fa', 'border:1px solid #dee2e6', 'border-radius:6px',
        'padding:12px 14px', 'max-height:260px', 'overflow-y:auto',
        'display:flex', 'flex-direction:column', 'gap:6px'
    ].join(';');
    listaWrap.id = 'ob-lista-logs';

    // Rodapé
    const rodape = document.createElement('div');
    rodape.style.cssText = 'display:flex;justify-content:flex-end;';

    const btnFechar = document.createElement('button');
    btnFechar.id = 'ob-btn-fechar';
    btnFechar.textContent = 'Fechar';
    btnFechar.disabled = true;
    btnFechar.style.cssText = [
        'padding:8px 22px', 'background:#6c757d', 'color:#fff',
        'border:none', 'border-radius:6px', 'cursor:not-allowed', 'font-size:14px',
        'opacity:.5', 'transition:opacity .2s'
    ].join(';');
    btnFechar.onclick = function () { overlay.remove(); };

    rodape.appendChild(btnFechar);

    box.appendChild(header);
    box.appendChild(barraWrap);
    box.appendChild(statusAtual);
    box.appendChild(listaWrap);
    box.appendChild(rodape);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function adicionarLog(mensagem, tipo) {
    // tipo: 'info' | 'success' | 'error'
    const lista = document.getElementById('ob-lista-logs');
    if (!lista) return;

    const cores = {
        info:    { bg: '#e8f4fd', borda: '#b8daff', icon: 'ℹ️', texto: '#0c5460' },
        success: { bg: '#e8f8e8', borda: '#b2dfdb', icon: '✅', texto: '#1b5e20' },
        error:   { bg: '#fdecea', borda: '#f5c6cb', icon: '❌', texto: '#7f0000' },
    };
    const c = cores[tipo] || cores.info;

    const item = document.createElement('div');
    item.style.cssText = [
        'display:flex', 'align-items:flex-start', 'gap:8px',
        'background:' + c.bg, 'border:1px solid ' + c.borda,
        'border-radius:5px', 'padding:7px 10px', 'font-size:12px', 'color:' + c.texto
    ].join(';');

    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const icone = document.createElement('span');
    icone.textContent = c.icon;
    icone.style.cssText = 'flex-shrink:0;font-size:13px;line-height:1.4;';

    const texto = document.createElement('span');
    texto.style.cssText = 'flex:1;line-height:1.5;';
    texto.innerHTML = '<span style="color:#999;margin-right:6px;">' + hora + '</span>' + mensagem;

    item.appendChild(icone);
    item.appendChild(texto);
    lista.appendChild(item);

    // Rola para o último log automaticamente
    lista.scrollTop = lista.scrollHeight;
}

function atualizarProgresso(concluidos, total, empresa, processo) {
    const pct = Math.round((concluidos / total) * 100);

    const barra = document.getElementById('ob-barra');
    if (barra) barra.style.width = pct + '%';

    const badge = document.getElementById('ob-badge');
    if (badge) badge.textContent = concluidos + ' / ' + total;

    const status = document.getElementById('ob-status-atual');
    if (status) status.textContent = 'Enviando — Empresa: ' + empresa + ' | Processo: ' + processo + ' (' + pct + '%)';
}

function finalizarProgresso(totalCadastros) {
    const barra = document.getElementById('ob-barra');
    if (barra) { barra.style.width = '100%'; barra.style.background = 'linear-gradient(90deg,#28a745,#81c784)'; }

    const badge = document.getElementById('ob-badge');
    if (badge) { badge.textContent = totalCadastros + ' / ' + totalCadastros; badge.style.background = '#e8f8e8'; badge.style.color = '#1b5e20'; }

    const status = document.getElementById('ob-status-atual');
    if (status) { status.textContent = '✅ Todos os cadastros foram concluídos!'; status.style.color = '#1b5e20'; status.style.fontWeight = 'bold'; }

    const btn = document.getElementById('ob-btn-fechar');
    if (btn) { btn.disabled = false; btn.style.cursor = 'pointer'; btn.style.opacity = '1'; btn.style.background = '#28a745'; }
}

// ─── CONTROLE DE PROGRESSO ────────────────────────────────────────────────────
let totalCadastros = 0;
let cadastrosConcluidos = 0;

function enviarFormulario(event) {
    if (event) event.preventDefault();

    atualizarProgresso(cadastrosConcluidos, totalCadastros, empresas[empresaAtual], processos[processoAtual]);
    adicionarLog('Enviando empresa <b>' + empresas[empresaAtual] + '</b> — processo <b>' + processos[processoAtual] + '</b>…', 'info');

    var formData = new FormData(cadastro);

    $.ajax({
        url: cadastro.action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            cadastrosConcluidos++;
            console.log('Formulário enviado com sucesso! Empresa: ' + empresas[empresaAtual] + ', Processo: ' + processos[processoAtual]);
            adicionarLog('Sucesso — empresa <b>' + empresas[empresaAtual] + '</b>, processo <b>' + processos[processoAtual] + '</b>', 'success');
            proximoCadastro();
        },
        error: function (xhr, status, error) {
            cadastrosConcluidos++;
            console.error('Erro ao enviar formulário:', error);
            adicionarLog('Erro — empresa <b>' + empresas[empresaAtual] + '</b>, processo <b>' + processos[processoAtual] + '</b>: ' + error, 'error');
            proximoCadastro();
        }
    });
}

function proximoCadastro() {
    processoAtual++;
    if (processoAtual >= processos.length) {
        processoAtual = 0;
        empresaAtual++;
    }

    if (empresaAtual < empresas.length) {
        setTimeout(function () {
            preencherFormulario();
            enviarFormulario();
        }, 2000);
    } else {
        console.log("Todos os cadastros foram concluídos!");
        finalizarProgresso(totalCadastros);
    }
}

// Ponto de entrada — abre o modal
criarModal();
`,
  );

  document.body.appendChild(scriptInfo);
})();