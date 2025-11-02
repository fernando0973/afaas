-- Script SQL para inserir agendamentos de teste
-- Execute este script diretamente no Supabase SQL Editor

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
-- Agendamentos para profissional ID 1
(1, null, '2025-11-01', '09:00:00', '10:30:00', 'João Silva', 'Consulta de rotina', false),
(1, null, '2025-11-01', '14:00:00', '15:30:00', 'Maria Santos', 'Acompanhamento mensal', false),
(1, null, '2025-11-02', '10:00:00', '11:30:00', 'Pedro Costa', 'Primeira consulta', false),
(1, null, '2025-11-03', '08:30:00', '10:00:00', 'Ana Paula', 'Revisão de tratamento', false),
(1, null, '2025-11-04', '15:00:00', '16:30:00', 'Carlos Oliveira', 'Check-up geral', false),

-- Agendamentos para outras datas da semana atual (26/10 a 02/11/2025)
(1, null, '2025-10-26', '09:00:00', '10:30:00', 'José Martins', 'Consulta de rotina', false),
(1, null, '2025-10-27', '14:00:00', '16:30:00', 'Lucia Ferreira', 'Exame completo', false),
(1, null, '2025-10-28', '08:00:00', '09:30:00', 'Roberto Lima', 'Consulta de retorno', false),
(1, null, '2025-10-29', '11:00:00', '12:30:00', 'Sandra Alves', 'Acompanhamento semanal', false),
(1, null, '2025-10-30', '16:00:00', '17:30:00', 'Miguel Souza', 'Consulta preventiva', false),
(1, null, '2025-10-31', '13:00:00', '15:00:00', 'Fernanda Cruz', 'Avaliação especializada', false),

-- Alguns agendamentos cancelados (não devem aparecer)
(1, null, '2025-11-01', '16:00:00', '17:30:00', 'Cliente Cancelado', 'Consulta cancelada', true),
(1, null, '2025-11-02', '11:30:00', '13:00:00', 'Outro Cancelado', 'Cancelado pelo cliente', true);