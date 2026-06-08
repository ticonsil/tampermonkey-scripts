// ==UserScript==
// @name         Adicionar empresas em massa
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Adiciona empresas em massa em uma obrigação
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=20*
// @grant        none
// @downloadURL  	https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Obriga%C3%A7%C3%B5es/AdicionarEmpresasEmMassa.user.js
// @updateURL    	https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Obriga%C3%A7%C3%B5es/AdicionarEmpresasEmMassa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Adiciona obrigação em massa"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=20*',
  );
  scriptInfo.setAttribute('data-name', 'Adiciona obrigação em massa');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
let valores = [];

// ─── MODAL ────────────────────────────────────────────────────────────────────
function criarModal() {
    const jaExiste = document.getElementById('obrigacao-modal');
    if (jaExiste) jaExiste.remove();

    const overlay = document.createElement('div');
    overlay.id = 'obrigacao-modal';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:rgba(0,0,0,.55)',
        'z-index:99999', 'display:flex', 'align-items:center', 'justify-content:center'
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
        'background:#fff', 'padding:28px 32px', 'border-radius:10px',
        'min-width:440px', 'box-shadow:0 6px 24px rgba(0,0,0,.25)',
        'font-family:Arial,sans-serif'
    ].join(';');

    const titulo = document.createElement('h3');
    titulo.textContent = 'Adicionar Empresas em Massa';
    titulo.style.cssText = 'margin:0 0 6px 0;color:#222;font-size:18px;';

    const sub = document.createElement('p');
    sub.textContent = 'Informe os IDs das empresas separados por vírgula:';
    sub.style.cssText = 'margin:0 0 14px 0;color:#555;font-size:13px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'empresas-obrigacao-input';
    input.placeholder = 'Ex: 283, 159, 139';
    input.style.cssText = [
        'width:100%', 'padding:10px 12px', 'border:1px solid #ccc',
        'border-radius:6px', 'font-size:14px', 'box-sizing:border-box',
        'outline:none', 'transition:border .2s'
    ].join(';');
    input.onfocus = function () { input.style.border = '1px solid #007bff'; };
    input.onblur  = function () { input.style.border = '1px solid #ccc'; };

    const erro = document.createElement('p');
    erro.id = 'obrigacao-erro';
    erro.textContent = 'Insira pelo menos um ID numérico válido.';
    erro.style.cssText = 'color:#e53935;font-size:12px;margin:6px 0 0 0;display:none;';

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

    btnCancelar.onclick = function () { overlay.remove(); };

    btnIniciar.onclick = function () {
        const val = document.getElementById('empresas-obrigacao-input').value;
        valores = val
            .split(',')
            .map(function (id) { return parseInt(id.trim(), 10); })
            .filter(function (id) { return !isNaN(id) && id > 0; });

        if (valores.length === 0) {
            document.getElementById('obrigacao-erro').style.display = 'block';
            return;
        }

        overlay.remove();
        executar();
    };

    input.onkeydown = function (e) { if (e.key === 'Enter') btnIniciar.click(); };

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

function executar() {
    const selectElement = document.getElementById("ObrAvEmpID");

    valores.forEach(valor => {
        const option = selectElement.querySelector('option[value="' + valor + '"]');
        if (option) {
            option.selected = true;
        }
    });

    setTimeout(() => { alocObr(); }, 1000);
}

criarModal();
`,
  );

  document.body.appendChild(scriptInfo);
})();
