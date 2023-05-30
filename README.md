<h1>Huggy Challenge</h1>

<strong>Esse é um projeto criado para o desafio de Front-end Pleno da <a href="https://www.huggy.io/pt-br">Huggy.io</a>.</strong>

<h3>Passos para inicializar o projeto:</h3>
<ol style="display: flex; flex-direction: column; gap: 1em">
<li>Clone o repositório para o local desejado e após abrí-lo, rode no terminal do projeto apenas:<h4>"yarn"</h4> ou <h4>"yarn install"</h4>Lembre-se de ter instalado o yarn globalmente no seu PC. Caso não tenha certeza se possui ou não rode: <h4>"yarn --version"</h4> no CMD para verificar se a versão aparece, caso não apareça ou retorne algum erro rode: <h4>"npm install --global yarn"</h4> utilizando o <strong>powershell em modo administrador</strong>.</li>

<li>Agora será necessário logar no site da Huggy <a href="https://www.huggy.app/">clicando aqui</a> e após isso ir no menu de <strong style="color: white">"configurações"</strong> e depois em <strong style="color: white">"Seus aplicativos"</strong>.</li>

<li>Agora será necessário você criar um aplicativo clicando em <strong style="color: white">"Adicionar aplicativo"</strong>.</li>

<li>Após criado, você verá que na área de <strong style="color: white">"Autenticação OAuth"</strong> será disponibilizado dois campos respectivamente chamados <strong style="color: white">"ID do Cliente"</strong> e <strong style="color: white">"Segredo do Cliente"</strong></li>

<li>Será necessário você copiar os dois códigos para o locais respectivos no <strong style="color: white">".env"</strong> dentro do projeto onde:<h4>VITE_CLIENT_ID="${ID do Cliente}"</h4> e <h4>VITE_CLIENT_SECRET="${Segredo do Cliente}"</h4>

<li>Após isso deverá abrir 3 terminais no projeto, onde, no primeiro você irá roda:<h4>yarn dev</h4>no segundo você irá rodar o <strong style="color: white">ngrok</strong>, caso não tenha instalado em seu computador, pode instalá-lo clicando <a href="">aqui</a>. Após instalá-lo, você irá rodar o seguinte comando:<h4>ngrok http 5173 (o número refere-se à porta que foi aberta pelo vite no primeiro terminal, caso não seja o mesmo número digite colocando o número da porta que você aberta seu projeto)</h4>no terceiro você irá rodar o servidor da API com o axios utilizando o comando:<h4>yarn start</h4>perceba que ele abre na porta <strong style="color: white">8080</strong>, caso você queira mudar a porta utilizada pela API, vai no arquivo <strong style="color: white">server.ts</strong> que se encontra na pasta <strong style="color: white">src</strong> na raíz. No final do arquivo mude de <strong style="color: white">8080</strong> para a porta que desejar utilizar. Mas lembre-se, é recomendável deixar na porta já estabelecida para evitar problemas e também onde estiver no projeto <strong style="color: white">localhost:8080</strong> você deverá alterar a porta para a desejada. É indicado alterar apenas em casos da porta já estar sendo utilizada.3</li>

<li>O ngrok do segundo terminal irá lhe gerar um link na área <strong style="color: white">Web Interface</strong>, você clicar nele e irá abrir uma nova aba no seu navegador padrão, você verá que há um link do ngrok, você precisará copiar esse link e na área do seu aplicativo criado por você na Huggy você deverá inserí-lo em <strong style="color: white">URL de Redirecionamento</strong>. Também será preciso você colocar no arquivo <strong style="color: white">".env"</strong> na raiz do projeto, seguindo a reegra do <strong style="color: white">passo 5</strong>:<h4>VITE_REDIRECT_URI="${URL de Redirecionamento}/callback"</h4></li>

<li>Esses são os passos necessários para rodar o projeto!</li>

</ol>
