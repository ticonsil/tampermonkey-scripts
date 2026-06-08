// ==UserScript==
// @name         Limpar Processos
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Limpar processo recorrente e tarefas agendadas
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Empresas/LimparProcessos.user.js
// @updateURL    https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Empresas/LimparProcessos.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (document.querySelector(`.script-item[data-name="Limpar Processos"]`))
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'app.acessorias.com/sysmain.php?m=105*');
  scriptInfo.setAttribute('data-name', 'Limpar Processos');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
 document.querySelectorAll('div#DivTar button.btn.btn-sm.btn-danger.col-xs-6.col-sm-6').forEach((button, index) => {
  button.click();
  document.querySelector('div.swal2-actions button.swal2-confirm.btn.btn-info.marginZ').click();
});

document.querySelectorAll('div#empProcZ button.btn.btn-sm.btn-danger.col-xs-4.col-sm-4').forEach((button, index) => {
  button.click();
 document.querySelector('button.swal2-confirm.btn.btn-danger.marginZ').click();
});
`,
  );

  document.body.appendChild(scriptInfo);
})();
