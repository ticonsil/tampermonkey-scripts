// ==UserScript==
// @name         Onboarding em Massa
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Cadastrar Onboarding em Massa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=125*
// @grant        none
// @downloadURL  https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Gest%C3%A3o%20de%20Processos/onboardingEmMassa.user.js
// @updateURL    https://github.com/ticonsil/tampermonkey-scripts/raw/refs/heads/main/acessorias/Gest%C3%A3o%20de%20Processos/onboardingEmMassa.user.js
// ==/UserScript==
(function () {
  'use strict';

  if (
    document.querySelector(
      `.script-item[data-name="Cadastrar Onboarding em Massa"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'app.acessorias.com/sysmain.php?m=125*');
  scriptInfo.setAttribute('data-name', 'Cadastrar Onboarding em Massa');
  scriptInfo.setAttribute('data-department', 'TI');
  scriptInfo.setAttribute(
    'data-function',
    `
    // Arrays com os dados
const processos = [323, 322, 324, 321, 320];
const responsaveis = [59459, 91751, 60804, 60815, 94707];
const empresas = [406, 414, 409]; // Exemplo com 3 empresas, ajuste conforme necessário

// Índices para controlar o progresso
let empresaAtual = 0;
let processoAtual = 0;

function preencherFormulario() {
    document.querySelector("select#PusProcID").value = processos[processoAtual].toString();
    document.querySelector("select#PusRespLogID").value = responsaveis[processoAtual].toString();
    $('#PusEmpID').val(empresas[empresaAtual].toString());
    descP(document.querySelector('input#PusTitulo')); 
}

function descP(inputy) { 
    if ($("#PusProcID").val() > 0) {
        inputy.value = $("#PusProcID").find(":selected").text();
    }
}

function enviarFormulario(event) {
    if (event) event.preventDefault();

    var formData = new FormData(cadastro);

    $.ajax({
        url: cadastro.action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log('Formulário enviado com sucesso! Empresa: ' + empresas[empresaAtual] + ', Processo: ' + processos[processoAtual]);
            proximoCadastro();
        },
        error: function(xhr, status, error) {
            console.error('Erro ao enviar formulário:', error);
            proximoCadastro(); // Continua mesmo em caso de erro
        }
    });
}

function proximoCadastro() {
    processoAtual++;
    if (processoAtual >= processos.length) {
        processoAtual = 0;
        empresaAtual++;
    }
    
    if (empresaAtual < empresas.length) {
        setTimeout(function() {
            preencherFormulario();
            enviarFormulario();
        }, 2000); // Espera 2 segundos antes do próximo envio
    } else {
        console.log("Todos os cadastros foram concluídos!");
    }
}

// Inicia o processo
preencherFormulario();
cadastro.onsubmit = enviarFormulario;
enviarFormulario();
`,
  );

  document.body.appendChild(scriptInfo);
})();
