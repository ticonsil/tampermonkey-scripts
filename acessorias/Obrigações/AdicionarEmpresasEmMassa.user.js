// ==UserScript==
// @name         Onboarding em Massa
// @namespace    http://tampermonkey.net/
// @version      5.2
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
// obs: Os números precisam ter 3 dígitos, ou seja: 001, 002, 003, etc...

const valores = [
  283, 159, 139, 473, 383, 164, 565, 136, 702, 49,
  637, 101, 103, 308, 183, 568, 485, 346, 404, 4,
  566, 134, 35, 413, 245, 244, 470, 713, 91, 469,
  703, 689, 657, 15, 142, 145, 1, 699, 86, 307,
  567, 405, 402, 427, 37, 601, 10, 14
];

const selectElement = document.getElementById("ObrAvEmpID");

valores.forEach(valor => {
  const option = selectElement.querySelector('option[value="' + valor + '"]');
  if (option) {
    option.selected = true;
  }
});

setTimeout(() => {alocObr()}, 1000)

// alocObr()
// Código acima envia a requisição
`,
  );

  document.body.appendChild(scriptInfo);
})();
