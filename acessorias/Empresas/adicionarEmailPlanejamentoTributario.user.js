// ==UserScript==
// @name         Adicionar Email Planejamento Tributario - Fiscal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona os e-mails de: João, Wellington e Murilo
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/acessorias/Empresas/adicionarEmailPlanejamentoTributario.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/acessorias/Empresas/adicionarEmailPlanejamentoTributario.user.js
// ==/UserScript==

(function () {
  'use strict';

  const nomeScript = 'Adicionar e-mail Planejamento - Fiscal'
  if (
    document.querySelector(
      `.script-item[data-name=${nomeScript}]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=105*',
  );
  scriptInfo.setAttribute('data-name', `${nomeScript}`);
  scriptInfo.setAttribute('data-department', 'Fiscal');
  scriptInfo.setAttribute(
    'data-function',
    `
  const contatos = [
    {
      nome: 'João Paulo',
      email: 'joaopaulo@sollutionconsultoria.com',
    },
    {
      nome: 'Murilo - Consil',
      email: 'financeiro01@consilcontabilidade.com',
    },
    {
      nome: 'Wellington Boldrini',
      email: 'wtboldrini@outlook.com',
    },
  ];

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function adicionarContatos() {
    for (const contato of contatos) {
      const inputNome = document.querySelector('input#CttNome_0');
      const inputEmail = document.querySelector('input#CttEMail_0');
      inputNome.value = contato.nome;
      inputEmail.value = contato.email;
      addCtt('0', true);
      await sleep(1000);
    }
  }
  adicionarContatos();

    `,
  );
  document.body.appendChild(scriptInfo);
})();
