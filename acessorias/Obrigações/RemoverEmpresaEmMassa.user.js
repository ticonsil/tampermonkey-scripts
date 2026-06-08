// ==UserScript==
// @name         Remover empresas em massa
// @namespace    http://tampermonkey.net/
// @version      5.2
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
const idsToCheck = [094, 005, 160, 102, 110, 119, 123, 125, 129, 133, 561, 180, 143, 795];

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
    // Verifica se o modal apareceu pelo select
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

    // Aguarda o modal fechar antes do próximo
    await sleep(1200);
  }

  console.log('Processo finalizado!');
}

inativarEmpresas();
`,
  );

  document.body.appendChild(scriptInfo);
})();
