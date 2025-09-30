// ==UserScript==
// @name         Filtrar Processo de Onboarding + administrativos - Todas
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Filtra os processos de onboarding, alvaras, aberturas de empresa, e alterações contratuais - Script feito para rodar auomaticamente, use com cuidado!
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=125*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/filtrarProcessosAcessorias.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/filtrarProcessosAcessorias.user.js
// ==/UserScript==
(function () {
  'use strict';
  async function init() {
    await delay(1000);

    filtrarProcessosEspecificos(); // Já possui limpeza
    await delay(300);
    console.log('Terminado!');
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function baixarRelatorio() {
    const buttonBaixarXLS = document.querySelector('#btPrintXLS');
    printOpts();
    buttonBaixarXLS.click();
  }

  async function filtrarProcessosEspecificos() {
    limparFiltros();
    document.getElementById('PusA').checked = true;
    document.getElementById('PusC').checked = true;
    // document.getElementById('PusS').checked = true;
    // document.getElementById('PusD').checked = true;

    const select = document.getElementById('EntFilterZ');
    const optgroupAnexos = Array.from(
      select.getElementsByTagName('optgroup')
    ).find(optgroup => optgroup.label === 'Filtrar por tipos de processos');

    const selecionarOpcao = async valores => {
      valores.forEach(valor => {
        const option = optgroupAnexos.querySelector(`option[value="${valor}"]`);
        if (option) {
          option.selected = true;
        }
      });

      select.dispatchEvent(new Event('change'));
      await delay(300);
      await enviarFormulario();
      await delay(300);
      baixarRelatorio();
      await delay(10000);

      const opcoesSelecionadas =
        optgroupAnexos.querySelectorAll('option:checked');
      opcoesSelecionadas.forEach(option => (option.selected = false));
      select.dispatchEvent(new Event('change'));
    };

    await selecionarOpcao([
      // Onboardings em Geral
      'PROC323', // Onboarding de Clientes - Administrativo
      'PROC322', // Onboarding de Clientes - Contábil
      'PROC324', // Onboarding de Clientes - Financeiro
      'PROC321', // Onboarding de Clientes - Fiscal
      'PROC320', // Onboarding de Clientes - Pessoal

      // Regulatório
      'PROC103', // Controle Alvará Bombeiros
      'PROC104', // Controle Alvará Vigilância
      'PROC134', // Controle Licença Meio Ambiente
      'PROC376', // CONTROLE RENOVAÇÃO CRA
      'PROC183', // Controle Renovação CRM
      'PROC375', // CONTROLE RENOVAÇÃO CRO
      'PROC107', // Alvará Funcionamento Renovação Anual

      //Societário
      'PROC172', // Abertura de empresa
      'PROC85', // Alteração Contratual
    ]);
  }

  function limparFiltros() {
    document.getElementById('searchEmp').value = '';

    const inputsProcDt = document
      .querySelectorAll('input[name^="ProcDt"]')
      .forEach(input => (input.value = ''));

    let processosFiltrados;
    while (
      (processosFiltrados = document.querySelectorAll(
        'ul.select2-selection__rendered span.select2-selection__choice__remove'
      )).length > 0
    ) {
      processosFiltrados[0].click();
    }
  }

  function enviarFormulario(event) {
    if (event) event.preventDefault();
  
    const formData = new FormData(cadastro);
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: cadastro.action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log(`Formulário enviado com sucesso!`);
          resolve(response);
        },
        error: function (xhr, status, error) {
          console.error('Erro ao enviar formulário:', error);
          reject(error);
        },
      });
    });
  }

  init();
  setInterval(init, 155520000); // 12 horas

  if (
    document.querySelector(
      `.script-item[data-name="Filtrar todos os processos - Onboarding e ADM"]`
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=3/*'
  );
  scriptInfo.setAttribute('data-name', 'Filtrar processos de Onboarding e ADM');
  scriptInfo.setAttribute('data-department', 'Administrativo');
  scriptInfo.setAttribute(
    'data-function',
    `
        // box aqui avisando que ele está rodando - Informar quanto tempo falta para a próxima é interessante, você consegue?
      `
  );
  document.body.appendChild(scriptInfo);
})();
