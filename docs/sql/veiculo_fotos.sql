USE sgv;

CREATE TABLE IF NOT EXISTS veiculo_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  veiculo_id INT NOT NULL,
  caminho VARCHAR(255) NOT NULL,
  nome_arquivo VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fotos_veiculo (veiculo_id),
  CONSTRAINT fk_fotos_veiculo FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
);
