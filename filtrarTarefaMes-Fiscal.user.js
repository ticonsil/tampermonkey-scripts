// ==UserScript==
// @name         Filtrar Tarefas do mês - Fiscal
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Filtra todas as tarefas do mês atual
// @author       Você
// @match        https://app.acessorias.com/sysmain.php?m=3*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    if (document.querySelector(`.script-item[data-name="Filtrar Tarefas do mês - Fiscal"]`)) return;

    let scriptInfo = document.createElement('div');
    scriptInfo.className = 'script-item';
    scriptInfo.style.display = 'none';
    scriptInfo.setAttribute('data-site', 'https://app.acessorias.com/sysmain.php?m=3/*');
    scriptInfo.setAttribute('data-name', 'Filtrar Tarefas do mês - Fiscal');
    scriptInfo.setAttribute('data-department', 'Fiscal');
    scriptInfo.setAttribute('data-function', `
    function callFiltrarTarefasDoMesFiscal() {
    if (!document.getElementById('EntE')) {
                setTimeout(callFiltrarTarefasDoMesFiscal, 100);
                return;
            }

            document.getElementById('EntP').checked = false;
            document.getElementById('EntJ').checked = false;
            document.getElementById('EntD').checked = false;
            document.getElementById('EntE').checked = true;
            document.getElementById('searchEmp').value = '';

            document.querySelectorAll('#divDatas input').forEach(input => input.value = '');

            document.querySelectorAll('ul.select2-selection__rendered span.select2-selection__choice__remove')
                .forEach(span => span.click());

            let today = new Date();
            let firstDay = ('0' + 1).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear();
            let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            lastDay = ('0' + lastDay.getDate()).slice(-2) + '/' + ('0' + (lastDay.getMonth() + 1)).slice(-2) + '/' + lastDay.getFullYear();

            document.getElementById('EntDtDe').value = firstDay;
            document.getElementById('EntDtAte').value = lastDay;

            setTimeout(() => document.getElementById('btFilter').click(), 100);
        }
        callFiltrarTarefasDoMesFiscal();
    `);
    document.body.appendChild(scriptInfo);
})();