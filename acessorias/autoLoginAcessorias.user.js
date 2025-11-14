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
})();
