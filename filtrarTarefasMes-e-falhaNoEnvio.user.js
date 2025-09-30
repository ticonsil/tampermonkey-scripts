// ==UserScript==
// @name         Filtrar tarefas Mensal e com falhas no envio - Todas
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Filtra todas as tarefas do mês atual - Script feito para rodar auomaticamente, use com cuidado!
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=3*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/filtrarTarefaMes-Fiscal.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/filtrarTarefaMes-Fiscal.user.js
// ==/UserScript==
(function () {
  'use strict';
  async function init() {
    // colocar verificação do site em cada passo. Se voltar para o login, ele irá repetir o processo do início
    await callFiltrarTarefasDoMes();
    await delay(300);
    await enviarFormulario();
    await delay(300);
    baixarRelatorio();
    await delay(20000); // 1 minuto
    await filtrarEBaixarFalhaNoEnvio(); // 20 a 30 segundos
    await delay(10001);
    gestaoDeProcessos();
    await delay(100);
    console.log('Terminado!');
  }
  let contagem = 0;

  function delay(ms) {
    console.log(`delay de ${ms}ms`)
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function baixarRelatorio() {
    const buttonBaixarXLS = document.querySelector('#btPrintXLS');
    printOpts();
    buttonBaixarXLS.click();
    console.log(`Clicado no botão de download ${contagem += 1} vez(es)`);

  }

  async function filtrarEBaixarFalhaNoEnvio() {
    const select = document.getElementById('EntFilterZ');
    const optgroupAnexos = Array.from(
      select.getElementsByTagName('optgroup')
    ).find(optgroup => optgroup.label === 'Anexos e Documentos');

    const selecionarOpcao = async valor => {
      const option = optgroupAnexos.querySelector(`option[value="${valor}"]`);
      if (option) option.selected = true;
      console.log(`opções selecionadas como true: ${valor}`);

      select.dispatchEvent(new Event('change'));
      console.log('Evento dispachado');

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

    await selecionarOpcao('GPC'); // agendado
    await selecionarOpcao('GPI'); // imediato
  }
  // select com id EntFilterZ -> fazer algo para filtrar aqui
  // tem um optgroup de data-select2-id="49"
  // <option value="GPC" selected="" data-select2-id="2">Entregas com falha no envio agendado</option>
  // <option value="GPI" selected="" data-select2-id="3">Entregas com falha no envio imediato</option>

  // caso queira: <option value="GPN" data-select2-id="57">Somente anexos não acessados/visualizados</option>

  function callFiltrarTarefasDoMes() {
    if (!document.getElementById('EntE')) {
      setTimeout(callFiltrarTarefasDoMes, 100);
      console.log('entrega não marcada');
      return;
    }

    document.getElementById('EntP').checked = true;
    document.getElementById('EntJ').checked = true;
    document.getElementById('EntD').checked = true;
    document.getElementById('EntE').checked = true;
    document.getElementById('searchEmp').value = '';
    console.log('todas entregas marcadas');

    document
      .querySelectorAll('#divDatas input')
      .forEach(input => (input.value = ''));
      console.log('Inputs Zerados');


      let tarefasFiltradas;
      while ((tarefasFiltradas = document.querySelectorAll('ul.select2-selection__rendered span.select2-selection__choice__remove')).length > 0) {
        tarefasFiltradas[0].click();
      }
    console.log('Removido Tarefas Filtradas');

    // document
    //   .querySelectorAll(
    //     'ul.select2-selection__rendered span.select2-selection__choice__remove'
    //   )
    //   .forEach(span => span.click());

    let today = new Date();
    let firstDay =
      ('0' + 1).slice(-2) +
      '/' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '/' +
      today.getFullYear();
    let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay =
      ('0' + lastDay.getDate()).slice(-2) +
      '/' +
      ('0' + (lastDay.getMonth() + 1)).slice(-2) +
      '/' +
      lastDay.getFullYear();

    document.getElementById('EntPzDe').value = firstDay;
    document.getElementById('EntPzAte').value = lastDay;
    console.log('Filtrado os dias');
  }

  // document.getElementById('btFilter')
  // p(document.getElementById('btFilter'),'iFilter');
  // cadastro.submit

  function enviarFormularioAntiga(event) {
    if (event) event.preventDefault();

    var formData = new FormData(cadastro);

    $.ajax({
      url: cadastro.action,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(`Formulário enviado com sucesso!`);
      },
      error: function (xhr, status, error) {
        console.error('Erro ao enviar formulário:', error);
      },
    });
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
  

  function gestaoDeProcessos() {
    window.location.href = '/sysmain.php?m=125';
  }

  init();
  setInterval(init, 6000000000);

  if (
    document.querySelector(
      `.script-item[data-name="Filtrar tarefas do mês atual - Todas"]`
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
  scriptInfo.setAttribute('data-name', 'Filtrar tarefas Mensal e com falhas');
  scriptInfo.setAttribute('data-department', 'Fiscal');
  scriptInfo.setAttribute(
    'data-function',
    `
        // box aqui avisando que ele está rodando - Informar quanto tempo falta para a próxima é interessante, você consegue?
      `
  );
  document.body.appendChild(scriptInfo);
})();
