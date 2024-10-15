// ==UserScript==
// @name         Excluir obrigações dp - Pessoal
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Exclui todas as obrigações do dp na aba de empresas
// @author       Você
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/deleteTaskDP.user.js
// ==/UserScript==

(function() {
    'use strict';

    var navbar = document.getElementById('navbar');
    if (navbar) {
        var buttonDiv = document.createElement('div');
        buttonDiv.style.position = 'fixed';
        buttonDiv.style.top = '5px';
        buttonDiv.style.left = '200px';
        buttonDiv.style.zIndex = '999';

        var button = document.createElement('button');
        button.innerHTML = 'Excluir Obrigações dp v2.6';
        button.style.backgroundColor = '#31B0D5';
        button.style.color = 'white';
        button.style.padding = '8px 15px';
        button.style.borderRadius = '4px';
        button.style.border = '1px solid #46b8da';

        // Adiciona o evento onclick com os códigos solicitados
        button.onclick = function() {
            const divODP = document.querySelector('div#divObrDpt3 div#ODP_3');
            const divODPNome = document.querySelector('div#divObrDpt3 div#ODP_3 div#ObrNome_3');
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
                }, 1500);
            }
            executarSequencia();
        };

        buttonDiv.appendChild(button);
        navbar.appendChild(buttonDiv);
    }
})();
