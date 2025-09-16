// Ano no rodapé
document.querySelectorAll('#ano-atual').forEach(el => el.textContent = new Date().getFullYear());

// Saudação temporal na home
const saudEl = document.getElementById('saudacao-tempo');
if (saudEl) {
  const atualizarSaudacao = () => {
    const agora = new Date();
    const hora = agora.getHours();
    const saudacao = hora < 12 ? "Bom dia" : (hora < 18 ? "Boa tarde" : "Boa noite");
    saudEl.textContent = `${saudacao}! Agora é ${agora.toLocaleString('pt-BR')}.`;
  };
  atualizarSaudacao();
  setInterval(atualizarSaudacao, 1000 * 60); // atualiza por minuto
}

// Validação e resumo do formulário de cadastro
const form = document.getElementById('form-cadastro');
const resumo = document.getElementById('resumo');

if (form) {
  // Restrições simples de agendamento: não permitir data passada e horário fora do expediente
  const dataInput = document.getElementById('data');
  const horaInput = document.getElementById('hora');

  // Data mínima = hoje
  const hojeISO = new Date().toISOString().split('T')[0];
  dataInput.setAttribute('min', hojeISO);

  form.addEventListener('submit', function (e) {
    // Bootstrap validation style
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    // Regras temporais simples
    const data = dataInput.value;
    const hora = horaInput.value;

    // Impede seleção passada (defensivo, além do min)
    const selecionado = new Date(`${data}T${hora}:00`);
    const agora = new Date();
    if (selecionado < agora) {
      e.preventDefault();
      e.stopPropagation();
      alert('Escolha uma data/horário no futuro.');
      return;
    }

    // Janela de atendimento 08:00–20:00
    const [hh, mm] = hora.split(':').map(Number);
    if (hh < 8 || (hh > 20 || (hh === 20 && mm > 0))) {
      e.preventDefault();
      e.stopPropagation();
      alert('Horário fora do atendimento (08:00 às 20:00).');
      return;
    }

    // Se tudo ok, monta resumo, salva em localStorage e previne reload só para mostrar prévia
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());
    // Normaliza radios/checkbox
    dados.servico = document.querySelector('input[name="servico"]:checked')?.value || '';
    dados.novidades = document.getElementById('novidades').checked ? 'sim' : 'não';

    localStorage.setItem('cadastroMinimercado', JSON.stringify(dados));
    resumo.textContent = JSON.stringify(dados, null, 2);

    // Feedback simples
    const toast = document.createElement('div');
    toast.className = 'alert alert-success mt-3';
    toast.role = 'status';
    toast.textContent = 'Cadastro e agendamento registrados localmente (prévia).';
    form.after(toast);
    setTimeout(() => toast.remove(), 5000);
  });

  // Carrega prévia salva (se existir)
  const salvo = localStorage.getItem('cadastroMinimercado');
  if (salvo && resumo) {
    resumo.textContent = JSON.stringify(JSON.parse(salvo), null, 2);
  }
}
