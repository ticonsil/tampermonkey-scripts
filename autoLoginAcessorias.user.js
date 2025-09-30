// ==UserScript==
// @name         AutoLogin
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Filtra todas as tarefas do mês atual - Script feito para rodar auomaticamente, use com cuidado!
// @author       TIConsil
// @match        https://app.acessorias.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/autoLoginAcessorias.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/autoLoginAcessorias.user.js
// ==/UserScript==

(function () {
  'use strict';
  if (typeof window.initInterval === 'undefined') {
    window.initInterval = setInterval(init, 60000);
  }
  function init() {
    if (window.location.pathname === '/sysmain.php' && !window.location.search.includes('m=3')) {
      console.log('pathname /sysmain.php')
      window.location.href = '/sysmain.php?m=3';
    } else if (window.location.pathname === '/index.php') {
      console.log('pathname /index.php')
      const email = document.getElementsByName('mailAC');
      const senha = document.getElementsByName('passAC');
      const botao = document.querySelector('div.botoes button');
      email[0].value = 'teste';
      senha[0].value = 'senha';
      botao.click();
    }
  }
  setTimeout(init, 5000);

  // if (document.querySelector(`.script-item[data-name="Excluir obrigações dp - Pessoal"]`)) return;

  // let scriptInfo = document.createElement('div');
  // scriptInfo.className = 'script-item';
  // scriptInfo.style.display = 'none';
  // scriptInfo.setAttribute('data-site', 'https://app.acessorias.com/sysmain.php?m=105*');
  // scriptInfo.setAttribute('data-name', 'Excluir obrigações dp - Pessoal');
  // scriptInfo.setAttribute('data-department', 'Pessoal');
  // scriptInfo.setAttribute('data-function', `
  //         const divODP = document.querySelector('div#divObrDpt3 div#ODP_3');
  //         const divODPNome = document.querySelector('div#divObrDpt3 div#ODP_3 div#ObrNome_3'); // Independente do departamento, o obrnome_3 se mantem
  //         const selects = divODP.querySelectorAll('select');
  //         const selectNome = divODPNome.querySelectorAll('select');

  //         function preencherSelects() {
  //             selects.forEach(select => {
  //                 select.value = 1;
  //                 select.dispatchEvent(new Event('change'));
  //             });
  //         }
  //         function preencherSelectsNome() {
  //             selectNome.forEach(select => {
  //                 select.value = 'D';
  //             });
  //         }
  //         function clicarSalvar() {
  //             const salvarButton = document.querySelector('button.btn.btn-sm.btn-success.col-xs-6.col-sm-6[onclick="check_form(this);"]');
  //                 salvarButton.click();
  //         }
  //         function executarSequencia() {
  //             preencherSelects();
  //             preencherSelectsNome();
  //             setTimeout(() => {
  //                 clicarSalvar();
  //             }, 1500);
  //         }
  //         executarSequencia();

  // `);
  // document.body.appendChild(scriptInfo);
})();
