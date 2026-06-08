// ==UserScript==
// @name         Inativar empresa
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Inativa 100% uma empresa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Empresas/InativarEmpresa.user.js
// @updateURL    https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Empresas/InativarEmpresa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Inativar empresa"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'app.acessorias.com/sysmain.php?m=105*');
  scriptInfo.setAttribute('data-name', 'Inativar empresa');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
   // limpa as obrigações
document.querySelectorAll('.page-content .form-group')[10].querySelectorAll('select').forEach(function(select) {
    select.selectedIndex = 1;
});

// deixa ela como inativa
document.querySelectorAll('#EmpAtiva')[0].value = 'N';

// Limpa todas tarefas agendadas
 document.querySelectorAll('div#DivTar button.btn.btn-sm.btn-danger.col-xs-6.col-sm-6').forEach((button, index) => {
  button.click();
  document.querySelector('div.swal2-actions button.swal2-confirm.btn.btn-info.marginZ').click();
});

// Limpa todos os processos recorrentes
document.querySelectorAll('div#empProcZ button.btn.btn-sm.btn-danger.col-xs-4.col-sm-4').forEach((button, index) => {
  button.click();
 document.querySelector('button.swal2-confirm.btn.btn-danger.marginZ').click();
});

// Limpa todos os contatos
document.querySelectorAll('div#divRelCtt_0 button.btn.btn-sm.btn-danger.col-xs-4.col-sm-4').forEach((button, index) => {
  button.click();
 document.querySelector('button.swal2-confirm.btn.btn-danger.marginZ').click();
});
`,
  );

  document.body.appendChild(scriptInfo);
})();
