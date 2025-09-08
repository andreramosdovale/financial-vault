Financial Vault - Desafio Técnico
📄 Sobre o Projeto
Financial Vault é uma aplicação full stack desenvolvida como parte de um desafio técnico para demonstrar habilidades em desenvolvimento de backend, frontend e DevOps. A aplicação consiste em uma API para processamento de pagamentos com garantia de idempotência e uma interface web para interagir com a mesma.

A arquitetura do backend foi construída seguindo os princípios da Clean Architecture, separando as camadas de Domínio, Aplicação e Infraestrutura para garantir um código desacoplado, testável e escalável.

🛠️ Tecnologias Utilizadas
🚀 Backend (API)
Node.js: Ambiente de execução JavaScript.

TypeScript: Superset do JavaScript com tipagem estática.

Hono: Framework web minimalista e ultra-rápido para Node.js.

Drizzle ORM: "ORM que não é um ORM", um query builder leve e totalmente tipado para TypeScript.

PostgreSQL: Banco de dados relacional.

Zod: Biblioteca para validação de schemas.

🎨 Frontend (Web)
Next.js: Framework React para construção de aplicações web modernas.

React: Biblioteca para construção de interfaces de usuário.

TypeScript: Consistência de tipagem em todo o projeto.

Tailwind CSS: Framework de CSS utility-first.

Shadcn/UI: Coleção de componentes de UI reutilizáveis.

Tanstack Query (React Query): Biblioteca para gerenciamento de estado assíncrono, cache e sincronização de dados.

🐳 DevOps
Docker & Docker Compose: Para criação de um ambiente de desenvolvimento local consistente e orquestração dos serviços.

🚀 Guia de Execução Local
Para executar este projeto em sua máquina local, siga os passos abaixo.

Pré-requisitos
Git instalado.

Docker e Docker Compose instalados e em execução.

Passos
Clone o repositório:

git clone <URL_DO_SEU_REPOSITORIO>
cd financial-vault

Verifique a Configuração:
O arquivo docker-compose.yml já contém todas as variáveis de ambiente necessárias para o ambiente de desenvolvimento local, incluindo a DATABASE_URL e o SUPER_SECRET_TOKEN.

Inicie a Aplicação (O Comando Único):
Na raiz do projeto (financial-vault), execute o seguinte comando. Ele irá construir as imagens Docker para a API e para o Frontend, e iniciar todos os contêineres.

docker-compose up --build

Use a flag -d para rodar em modo "detached" (em segundo plano).

Acesse os Serviços:

Frontend: Abra seu navegador e acesse http://localhost:3000

Backend API: A API estará acessível em http://localhost:3001

Execute as Migrações do Banco de Dados:
Para criar as tabelas no banco de dados, abra um novo terminal, navegue até a pasta da API e execute o script de migração via Docker:

cd api
pnpm db:migrate

Sua aplicação agora está totalmente funcional em seu ambiente local.

🚧 Melhorias Futuras e Próximos Passos
Este projeto representa uma base sólida, mas para um ambiente de produção, os seguintes pontos seriam os próximos a serem abordados:

1. Observabilidade e Monitoria (Winston)
   Apesar de a aplicação usar console.log para depuração, o próximo passo crucial é implementar uma solução de logging estruturado com Winston. Isso permitiria a criação de logs com diferentes níveis (info, warn, error), formatos (JSON) e "transports" para enviar os logs para serviços de monitoria como Datadog, New Relic ou Grafana Loki.

2. Melhorias no Frontend
   Separação de Componentes: O código da UI está atualmente concentrado em page.tsx para simplicidade. O próximo passo seria refatorar a interface, quebrando-a em componentes menores e reutilizáveis (ex: PaymentForm, FeedbackAlert).

Hooks Personalizados: A lógica de chamada à API (createPayment) pode ser extraída para um hook personalizado (ex: useCreatePayment) para limpar o componente da página e reutilizar a lógica em outros lugares.

Validação de Formulário: Adicionar validação de formulário mais robusta no lado do cliente com bibliotecas como zod e react-hook-form.

3. Publicação (Deploy)
   Apesar de o projeto estar pronto para deploy, a publicação final em serviços como a Vercel (para o frontend) e Railway/AWS (para o backend e banco de dados) não foi concluída. Isso envolveria a configuração de um pipeline de CI/CD para automatizar os builds e deploys a cada commit na branch principal.

4. Testes
   A arquitetura do backend foi projetada para ser testável, mas os testes unitários (para os casos de uso) e de integração (para os endpoints) ainda precisam ser implementados usando uma framework como Jest.
