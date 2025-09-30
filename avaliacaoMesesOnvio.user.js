function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (window.location.href === 'https://app.gestta.com.br/attendance/#/auth/login') {
  // go to onvio.com.br/login
}

if(window.location.host === 'https://onvio.com.br/login/#/') {
  // se bater nisso vai pedir codigo, colocar para logar no e-mail e ficar esperando em uma pasta específica, se aparecer +1, ele copia o código e logan o messenger
}

if(window.location.host === 'app.gestta.com.br') {
  
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function clickSpanByTextStart(textStart) {
  const spans = document.querySelectorAll('span');
  for (const span of spans) {
    if (span.textContent.trim().startsWith(textStart)) {
      span.click();
      console.log(`Clicado no span: "${span.textContent.trim()}"`);
      return true;
    }
  }
  console.warn(`Nenhum span encontrado começando com: "${textStart}"`);
  return false;
}

function linkElement(name, tag = 'button', container = document) {
  const element = Array.from(container.querySelectorAll(tag)).find(
    el => el.textContent.replace(/\s+/g, ' ').trim() === name
  );
  return element;
}

function clickExportButton() {
  
const button = linkElement('Exportar dados');
  if (button && button.tagName.toLowerCase() === 'button') {
    button.click();
    console.log('Botão de exportação clicado.');
    return true;
  } else {
    console.warn('Botão de exportação não encontrado.');
    return false;
  }
}

function getMonthYearString(offset = -2) {
  const now = new Date();
  now.setMonth(now.getMonth() + offset);

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
  const formatted = formatter.format(now).toLowerCase().split(' de ').join(' ')

  return formatted;
}

function getLastDayOfMonth(monthDate) {
  return new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
}

async function selecionarOutroPeriodo(offset = -2) {
  await clickSpanByTextStart('Outro');
  await delay(1000);

  const targetMonthYear = getMonthYearString(offset);
  let mes;
  let tentativas = 0;

  while (!mes && tentativas < 12) {
    mes = linkElement(targetMonthYear, 'div');

    if (!mes) {
      const prev = document.getElementsByName('previous-month');
      if (prev.length) {
        prev[0].click();
        console.log('Mês não encontrado, clicando em "previous-month"');
      } else {
        console.warn('Botão de mês anterior não encontrado.');
        break;
      }
      tentativas++;
      await delay(1000);
    }
  }

  if (mes) {
    const div = mes.parentElement;
    const table = div.querySelector('table tbody');

    const firstDay = linkElement('1');

    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    const lastDayNumber = getLastDayOfMonth(date);

    const lastDay = linkElement(String(lastDayNumber), 'button', table)

    if (firstDay && lastDay) {
      firstDay.click();
      await delay(500);
      lastDay.click();
      await delay(500);

      const filtrar = linkElement('Aplicar Período', 'div');

      if (filtrar) {
        filtrar.click();
        await delay(2000);
        clickExportButton();
        console.log('Exportação final concluída.');
      } else {
        console.warn('Botão "Aplicar Período" não encontrado.');
      }
    } else {
      console.warn('Não foi possível encontrar os dias para o mês.');
    }
  } else {
    console.warn('Mês alvo não encontrado após várias tentativas.');
  }
}

async function exportarMesAtual() {
  await clickSpanByTextStart('Mês atual');
  await delay(2000);
  clickExportButton();
  await delay(5000);
}

async function exportarMesAnterior() {
  await clickSpanByTextStart('Mês anterior');
  await delay(2000);
  clickExportButton();
  await delay(5000);
}

async function executarExportacoes() {
  console.log('Iniciando processo de exportação...');
  await exportarMesAtual();
  await exportarMesAnterior();
  await selecionarOutroPeriodo(-2); // Você pode alterar o offset aqui se quiser outro período
  console.log('Processo de exportação finalizado.');
}

executarExportacoes();


// Entrar, novamente no Entrar // div senha em cima input ou input name password