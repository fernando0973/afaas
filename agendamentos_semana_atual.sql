-- Agendamentos para a semana atual (27/10/2025 a 02/11/2025)
-- Semana que contém hoje (01/11/2025)

INSERT INTO afaas_agendamentos (
  profissional_id,
  cliente_id,
  data,
  hora_inicio,
  hora_fim,
  titulo,
  descricao,
  cancelado
) VALUES 
-- Domingo, 27/10/2025
(4, null, '2025-10-27', '09:00:00', '10:30:00', 'João Silva', 'Consulta de rotina', false),
(4, null, '2025-10-27', '14:00:00', '15:30:00', 'Maria Santos', 'Acompanhamento mensal', false),

-- Segunda, 28/10/2025  
(4, null, '2025-10-28', '08:00:00', '09:30:00', 'Pedro Costa', 'Primeira consulta', false),
(4, null, '2025-10-28', '16:00:00', '17:30:00', 'Ana Paula', 'Revisão de tratamento', false),

-- Terça, 29/10/2025
(4, null, '2025-10-29', '10:00:00', '11:30:00', 'Carlos Oliveira', 'Check-up geral', false),

-- Quarta, 30/10/2025
(4, null, '2025-10-30', '11:00:00', '12:30:00', 'Lucia Ferreira', 'Exame completo', false),
(4, null, '2025-10-30', '15:00:00', '16:30:00', 'Roberto Lima', 'Consulta de retorno', false),

-- Quinta, 31/10/2025
(4, null, '2025-10-31', '09:00:00', '10:30:00', 'Sandra Alves', 'Acompanhamento semanal', false),

-- Sexta, 01/11/2025 (hoje)
(4, null, '2025-11-01', '13:00:00', '14:30:00', 'Miguel Souza', 'Consulta preventiva', false),
(4, null, '2025-11-01', '16:00:00', '18:00:00', 'Fernanda Cruz', 'Avaliação especializada', false),

-- Sábado, 02/11/2025
(4, null, '2025-11-02', '10:00:00', '11:30:00', 'José Martins', 'Revisão mensal', false);