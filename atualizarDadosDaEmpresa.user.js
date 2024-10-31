// ==UserScript==
// @name         Atualizar Dados da Empresa
// @namespace    http://tampermonkey.net/
// @version      5.01
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
    // Salva o value de input#EmpNewID
    const empNewIdValue = document.querySelector('input#EmpNewID').value;
    // Pega e formata o valor de CNPJ
    const cnpjValue = document.querySelector('input#EmpCNPJ').value;
    const cnpjSemFormatacao = cnpjValue.replace(/\D/g, '');
    // Atualiza o valor do CNPJ
    document.querySelector('input#EmpCNPJ').value = cnpjSemFormatacao;
    buscaCNPJ(cadastro.EmpCNPJ.value);
    // Timeout de 1500ms antes de restaurar o CNPJ original e iniciar as verificações
    setTimeout(() => {
        // Restaura o valor original do CNPJ
        document.querySelector('input#EmpCNPJ').value = cnpjValue;
        // Função para verificar e deletar cada div de forma assíncrona
        async function processarDivs() {
            let index = 1;
            let divCtt;
            // Loop para percorrer todas as divs que começam com divCtt_0_
            while ((divCtt = document.querySelector(\`#divCtt_0_${index}\`)) !== null) {
                const oitavoInput = divCtt.querySelectorAll('input')[7];
                const segundoInput = divCtt.querySelector('div.input-group input:nth-of-type(2)');
                // Verifica se os inputs possuem valor
                if (!oitavoInput.value && !segundoInput.value) {
                    // Se não possuem valor, chama a função delCttDirect com os argumentos corretos
                    const idArgument = \`0_${index}\`;
                    delCttDirect(idArgument, empNewIdValue);
                    // Espera 500ms e clica no botão de confirmação
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
        // Chama a função para processar as divs
        processarDivs();
    }, 1500);
}
`
  );

  document.body.appendChild(scriptInfo);
})();
