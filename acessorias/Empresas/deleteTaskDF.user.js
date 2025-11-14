// ==UserScript==
// @name         Excluir obrigações df - Fiscal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Exclui todas as obrigações do dp na aba de empresas
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/deleteTaskDF.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/deleteTaskDF.user.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector(`.script-item[data-name="Excluir obrigações df - Fiscal"]`)) return;


    let scriptInfo = document.createElement('div');
    scriptInfo.className = 'script-item';
    scriptInfo.style.display = 'none';
    scriptInfo.setAttribute('data-site', 'https://app.acessorias.com/sysmain.php?m=105*');
    scriptInfo.setAttribute('data-name', 'Excluir obrigações df - Fiscal');
    scriptInfo.setAttribute('data-department', 'Fiscal');
    scriptInfo.setAttribute('data-function', `
            const divODP = document.querySelector('div#divObrDpt2 div#ODP_2');
            const divODPNome = document.querySelector('div#divObrDpt2 div#ODP_2 div#ObrNome_21'); // Independente do departamento, o obrnome_3 se mantem.
            // Observa-se que no dia 23/05/2025 foi alterado de div#ObrNome_3 para div#ObrNome_21
            const selects = divODP.querySelectorAll('select');
            const selectNome = divODPNome.querySelectorAll('select');

            function preencherSelects() {
                selects.forEach(select => {
                    select.value = 1;
                    select.dispatchEvent(new Event('change'));
                });
            }
            function preencherSelectsNome() {
                selectNome.forEach(select => {
                    select.value = 'D';
                });
            }
            function clicarSalvar() {
                const salvarButton = document.querySelector('button.btn.btn-sm.btn-success.col-xs-6.col-sm-6[onclick="check_form(this);"]');
                    salvarButton.click();
            }
            function executarSequencia() {
                preencherSelects();
                preencherSelectsNome();
                setTimeout(() => {
                    clicarSalvar();
                }, 2500);
            }
            executarSequencia();

    `);
    document.body.appendChild(scriptInfo);
})();
