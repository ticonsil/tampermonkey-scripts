// ==UserScript==
// @name         Remover empresas em massa
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Remove empresas em massa em uma obrigação
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=21*
// @grant        none
// @downloadURL  	https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Obriga%C3%A7%C3%B5es/RemoverEmpresaEmMassa.user.js
// @updateURL    	https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Obriga%C3%A7%C3%B5es/RemoverEmpresaEmMassa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Remove obrigação em massa"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=21*',
  );
  scriptInfo.setAttribute('data-name', 'Remove obrigação em massa');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
let idsToCheck = []; // preenchido pelo modal

// ─── MODAL ────────────────────────────────────────────────────────────────────
function criarModal() {
    const jaExiste = document.getElementById('remover-modal');
    if (jaExiste) jaExiste.remove();

    const overlay = document.createElement('div');
    overlay.id = 'remover-modal';
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
    titulo.textContent = 'Remover Empresas em Massa';
    titulo.style.cssText = 'margin:0 0 6px 0;color:#222;font-size:18px;';

    const sub = document.createElement('p');
    sub.textContent = 'Informe os IDs das empresas separados por vírgula:';
    sub.style.cssText = 'margin:0 0 14px 0;color:#555;font-size:13px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'empresas-remover-input';
    input.placeholder = 'Ex: 94, 5, 160';
    input.style.cssText = [
        'width:100%', 'padding:10px 12px', 'border:1px solid #ccc',
        'border-radius:6px', 'font-size:14px', 'box-sizing:border-box',
        'outline:none', 'transition:border .2s'
    ].join(';');
    input.onfocus = function () { input.style.border = '1px solid #dc3545'; };
    input.onblur  = function () { input.style.border = '1px solid #ccc'; };

    const erro = document.createElement('p');
    erro.id = 'remover-erro';
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
        'padding:8px 22px', 'background:#dc3545', 'color:#fff',
        'border:none', 'border-radius:6px', 'cursor:pointer', 'font-size:14px',
        'font-weight:bold'
    ].join(';');

    btnCancelar.onclick = function () { overlay.remove(); };

    btnIniciar.onclick = function () {
        const val = document.getElementById('empresas-remover-input').value;
        idsToCheck = val
            .split(',')
            .map(function (id) { return parseInt(id.trim(), 10); })
            .filter(function (id) { return !isNaN(id) && id > 0; });

        if (idsToCheck.length === 0) {
            document.getElementById('remover-erro').style.display = 'block';
            return;
        }

        overlay.remove();
        inativarEmpresas();
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

// ─── LÓGICA ORIGINAL (sem alterações) ─────────────────────────────────────────
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function inativarEmpresas() {
    const divs = [...document.querySelectorAll('#ObrEmpresas > div')];
    for (const div of divs) {
        const idNumber = div.id.split('_')[1];
        if (!idsToCheck.includes(Number(idNumber))) continue;
        const firstLink = div.querySelector('span.action-buttons a');
        if (!firstLink) {
            console.warn('Botão não encontrado para ID ' + idNumber + ', pulando...');
            continue;
        }
        firstLink.click();

        await sleep(1200);
        const dado = document.querySelector('select.swal2-select.col-sm-12.col-xs-12.marginZ');
        if (!dado) {
            console.warn('Modal não encontrado para ID ' + idNumber + ', encerrando.');
            break;
        }
        dado.value = 'D';
        dado.dispatchEvent(new Event('change'));
        await sleep(300);
        const botaoInativar = document.querySelector('button.swal2-confirm.btn.btn-danger.marginZ');
        if (!botaoInativar) {
            console.warn('Botão de confirmar não encontrado para ID ' + idNumber + ', encerrando.');
            break;
        }
        botaoInativar.click();
        console.log('Empresa ID ' + idNumber + ' inativada.');

        await sleep(1200);
    }

    console.log('Processo finalizado!');
}

// Ponto de entrada
criarModal();
`,
  );

  document.body.appendChild(scriptInfo);
})();
