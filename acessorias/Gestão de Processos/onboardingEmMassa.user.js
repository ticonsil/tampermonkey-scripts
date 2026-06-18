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

function enviarFormulario(event) {
    if (event) event.preventDefault();

    var formData = new FormData(cadastro);

    $.ajax({
        url: cadastro.action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Formulário enviado com sucesso! Empresa: ' + empresas[empresaAtual] + ', Processo: ' + processos[processoAtual]);
            proximoCadastro();
        },
        error: function (xhr, status, error) {
            console.error('Erro ao enviar formulário:', error);
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
    }
}

// Ponto de entrada — abre o modal
criarModal();
`,
  );

  document.body.appendChild(scriptInfo);
})();
