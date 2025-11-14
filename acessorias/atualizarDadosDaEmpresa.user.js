// ==UserScript==
// @name         Atualizar Dados da Empresa
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Atualiza todos os dados da empresa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/atualizarDadosDaEmpresa.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/atualizarDadosDaEmpresa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Atualizar Dados da Empresa"]`
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'app.acessorias.com/sysmain.php?m=105*');
  scriptInfo.setAttribute(
    'data-name',
    'Atualizar Dados da Empresa'
  );
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
    function atualizarDados() {
    const empNewIdValue = document.querySelector('input#EmpNewID').value;
    const cnpjValue = document.querySelector('input#EmpCNPJ').value;
    const cnpjSemFormatacao = cnpjValue.replace(/\D/g, '');
    document.querySelector('input#EmpCNPJ').value = cnpjSemFormatacao;
    buscaCNPJ(cadastro.EmpCNPJ.value);
    setTimeout(() => {
        document.querySelector('input#EmpCNPJ').value = cnpjValue;
        async function processarDivs() {
            let index = 1;
            let divCtt;
            // Loop para percorrer todas as divs que começam com divCtt_0_
            while ((divCtt = document.querySelector('#divCtt_0_' + index})) !== null) {
                const oitavoInput = divCtt.querySelectorAll('input')[7];
                const segundoInput = divCtt.querySelector('div.input-group input:nth-of-type(2)');
                // Verifica se os inputs possuem valor
                if (!oitavoInput.value && !segundoInput.value) {
                    // Se não possuem valor, chama a função delCttDirect com os argumentos corretos
                    const idArgument = '0_' + index;
                    delCttDirect(idArgument, empNewIdValue);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const confirmButton = document.querySelector('div.swal2-modal div.swal2-actions button.swal2-confirm.btn.btn-danger.marginZ');
                    if (confirmButton) {
                        confirmButton.click();
                    }
                    // Espera mais 500ms antes de continuar
                    await new Promise(resolve => setTimeout(resolve, 700));
                }
                index++;
            }
        }
        processarDivs();
    }, 1500);
}
    atualizarDados();
`
  );

  document.body.appendChild(scriptInfo);
})();
