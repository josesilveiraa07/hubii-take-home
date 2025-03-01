# Requisitos Funcionais

## Set-up inicial

```bash
$ git clone https://github.com/josesilveiraa07/hubii-take-home # clona o repositório
```

1. Criar todos os arquivos com base nos arquivos .env.example, apps/api-gateway/.env.example, apps/orders/.env.example e apps/products/.env.example
   no mesmo lugar dos arquivos mencionados, mas com o nome .env.development.
2. Alterar os valores das variáveis de ambiente.

```bash
$ cd hubii-take-home # entra no diretório do repositório
$ pnpm install # instala as dependências utilizando o pnpm
$ pnpm compose:dev # roda todos os containers necessários para a aplicação subir
```

Após esses passos, a documentação com tipos e retornos estará disponível no endereço http://localhost:3000/docs.

## Microsserviço de Produtos

- **CRUD de Produtos**: Implementação completa de operações de criação, leitura, atualização e exclusão de produtos.
- **Controle de Estoque**: Gerenciamento simples de estoque, permitindo adicionar e subtrair quantidades de produtos.

## Microsserviço de Pedidos

- **Realização de Pedidos**: Capacidade de criar pedidos, associando-os a produtos específicos.
- **Atualização de Estoque**: Subtração automática do estoque de produtos quando um pedido é realizado.
- **Integração com Calculadora de Frete**: Integração com um serviço externo de cálculo de frete para fornecer estimativas de custo e prazo de entrega.

---

# Requisitos Não Funcionais

## Qualidade de Código

- **Código Limpo e Organizado**: O código deve ser bem estruturado, fácil de entender e manter.
- **Testes Unitários**: Implementação de testes unitários para garantir a qualidade e funcionalidade do código.
- **Testes E2E (Bônus)**: Implementação de testes end-to-end para validar o fluxo completo da aplicação.

## Documentação

- **Documentação Clara e Concisa**: Documentação detalhada e de fácil compreensão, cobrindo todos os aspectos do projeto.

## Arquitetura

- **Arquitetura Limpa (Bônus)**: Utilização de princípios de arquitetura limpa para garantir a separação de preocupações e facilidade de manutenção.
- **API Federation (Bônus)**: Implementação de API federation para unificar múltiplos microsserviços em uma única API.
