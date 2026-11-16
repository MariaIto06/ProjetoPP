-- Execute no banco de dados autorizado para sua turma.
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'dbFilmes')
  EXEC('CREATE SCHEMA dbFilmes');
GO
CREATE TABLE dbFilmes.Categorias (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE dbFilmes.Filmes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  categoria_id INT NOT NULL REFERENCES dbFilmes.Categorias(id),
  diretor VARCHAR(100) NOT NULL,
  ano_lancamento INT NULL,
  duracao_minutos INT NULL
);
INSERT INTO dbFilmes.Categorias (nome) VALUES ('Drama'), ('Comédia'), ('Suspense'), ('Ação'), ('Terror');
INSERT INTO dbFilmes.Filmes (titulo,categoria_id,diretor,ano_lancamento,duracao_minutos) VALUES
('Filme Exemplo 1',1,'Diretor A',2001,100),
('Filme Exemplo 2',2,'Diretor B',2002,101),
('Filme Exemplo 3',3,'Diretor C',2003,102),
('Filme Exemplo 4',4,'Diretor D',2004,103),
('Filme Exemplo 5',5,'Diretor E',2005,104),
('Filme Exemplo 6',1,'Diretor F',2006,105),
('Filme Exemplo 7',2,'Diretor G',2007,106),
('Filme Exemplo 8',3,'Diretor H',2008,107);
