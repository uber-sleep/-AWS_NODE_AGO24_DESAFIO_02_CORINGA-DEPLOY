
## Deploy de API Node.js em um servidor EC2 AWS
O passo a passo a seguir detalha a criação de uma instancia EC2 e as demais configurações para fazer o deploy da API CompassCar com sucesso.
### 1. Configuração Inicial do Servidor
#### 1.1. Criar uma Instância EC2 no AWS
1. No painel da AWS, selecione o serviço EC2 e crie uma nova instância.
2. Escolha a Amazon Machine Image (AMI) Ubuntu Server 22.04 LTS.
3. Defina o tipo de instância, usei uma t2.small mas a opção t2.micro do free tier pode ser suficiente, apesar de ter menos recursos.
4. Configure as regras de segurança:
    - Porta 22 para SSH
    - Porta 80 para HTTP 
    - Porta 443 para HTTPS 
    - Porta 300 para o servidor 
5. Finalize a criação da instância e baixe a chave privada .pem para acessar o servidor via SSH.
#### 1.2. Acessar a Instância via SSH
Execute o comando abaixo para se conectar à instância, substituindo chave.pem e ip-instancia pelos seus valores.
```bash
ssh -i "chave.pem" ubuntu@ip-instancia
```
### 2. Instalar Dependências no Servidor
#### 2.1. Instalar Node.js e NPM
Atualize os pacotes do Ubuntu:
```bash
sudo apt update
sudo apt upgrade -y
```
Instale o Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```
Verifique se o Node.js e o NPM foram instalados corretamente:
```bash
node -v
npm -v
```
#### 2.2. Instalar e Configurar o MySQL
Instale o MySQL:
```bash
sudo apt install mysql-server -y
```
Acesse o MySQL para criar um usuário e um banco de dados específicos para a aplicação:
```bash
sudo mysql -u root
```
Dentro do MySQL, execute os seguintes comandos para criar um banco de dados, um usuário e conceder permissões:
```sql
CREATE DATABASE nome_do_banco;
CREATE USER 'seu_usuario'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON nome_do_banco.* TO 'seu_usuario'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
#### 2.3. Instalar PM2 
PM2 é um gerenciador de processos que mantem a aplicação Node.js em execução e faz restart automático em caso de falhas.
```bash
sudo npm install -g pm2
```
### 3. Configurar a Aplicação no Servidor
#### 3.1. Enviar os Arquivos da Aplicação
Para enviar arquivos para o servidor, você pode usar o SCP (Secure Copy Protocol) no terminal:
```bash
scp -i "my-key.pem" -r /caminho/para/seu/projeto ubuntu@instance-ip:/home/ubuntu/
```
Alternativamente, utilize o Git para clonar o projeto diretamente do repositório:
```bash
git clone https://github.com/usuario/repositorio.git
```
#### 3.2. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto, com as configurações de conexão com o banco de dados e outras variáveis necessárias:
```plaintext
DB_HOST=localhost
DB_PORT=3306
DB_USER=nome_usuario
DB_PASS=senha_segura
DB_NAME=nome_do_banco
PORT=3000
```
#### 3.3. Instalar as Dependências do Projeto
Navegue até o diretório do projeto e instale as dependências:
```bash
cd /caminho/para/seu/projeto
npm install
```
### 4. Executar as Migrações e Configurar Banco de Dados
Se a aplicação usa TypeORM ou outro ORM, execute as migrações para criar as tabelas no banco de dados:
```bash
npx typeorm migration:run -d src/db/data-source.ts
```
### 5. Iniciar a Aplicação em Produção
Execute o comando para rodar a aplicação com PM2 e manter o serviço ativo:
```bash
pm2 start dist/server.js 
```
Verifique o status da aplicação:
```bash
pm2 status
```
Para salvar a configuração do PM2 e garantir que a aplicação reinicie após uma reinicialização do servidor, use:
```bash
pm2 startup
pm2 save
```
### 6. Pós-Deploy
Acesse o DNS publico para confirmar que a aplicação está no ar.