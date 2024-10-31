// ==UserScript==
// @name         Limpar Processos Recorrentes e Tarefas Agendadas
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Limpa todos as tarefas agendadas e processos recorrentes de uma empresa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/limparProcRecorrenteETarefasAgendadas.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/limparProcRecorrenteETarefasAgendadas.user.js
// ==/UserScript==

(function () {
  'use strict';
  if (
    document.querySelector(
      `.script-item[data-name="Limpar Proc Recorrente e Tarefas Agendadas"]`
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=105*'
  );
  scriptInfo.setAttribute(
    'data-name',
    'Limpar Proc Recorrente e Tarefas Agendadas'
  );
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
function() {
            document.querySelectorAll('div#DivTar button.btn.btn-sm.btn-danger.col-xs-6.col-sm-6').forEach((button, index) => {
                button.click();
                document.querySelector('div.swal2-actions button.swal2-confirm.btn.btn-info.marginZ').click();
            });

            document.querySelectorAll('div#empProcZ button.btn.btn-sm.btn-danger.col-xs-4.col-sm-4').forEach((button, index) => {
                button.click();
                document.querySelector('button.swal2-confirm.btn.btn-danger.marginZ').click();
            });
        };

}`
  );
})();
