# Fundação de arquitetura

## Limites

O frontend é um cliente não confiável. Regras de autorização, cálculos oficiais,
acesso a documentos e decisões sobre dados financeiros devem ser validados pela
API. A interface pode ocultar ações por experiência de uso, mas nunca substitui
a autorização do backend.

## Organização

- `app`: composição dos providers e infraestrutura de inicialização.
- `features`: componentes e regras de apresentação agrupados por domínio.
- `routes`: entrada das páginas e integração com o roteador.
- `shared`: código reutilizável sem dependência de uma feature específica.
- `config`: leitura centralizada de configurações públicas do Vite.

Features não devem importar umas às outras diretamente. Integrações compartilhadas
devem passar por `shared`, e dados remotos devem ser expostos por hooks da própria
feature usando TanStack Query.

## Segurança

- Não persistir tokens de sessão em `localStorage`.
- Preferir cookies `HttpOnly`, `Secure` e `SameSite` emitidos pela API.
- Não incluir segredos em variáveis `VITE_*`; elas são públicas no bundle.
- Tratar conteúdo vindo da API como não confiável.
- Downloads e documentos sensíveis devem usar URLs temporárias emitidas pela API.
- Logs do navegador não devem conter CPF, saldos, tokens ou documentos.

Autenticação, autorização, headers de segurança e integração real com a API serão
implementados quando os contratos do backend estiverem definidos.
