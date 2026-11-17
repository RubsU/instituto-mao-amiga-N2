# Instituto Mão Amiga: app + API (Projeto N2)

App em React Native (Expo, TypeScript) que consome uma API Spring Boot feita por mim. Pontos de coleta e doações têm CRUD completo pela API. Os favoritos ficam só no aparelho.

## Onde está a API

A API está na pasta **`api`** deste mesmo repositório. Como rodar, endpoints e prints do Swagger: [`api/README.md`](api/README.md).

## Como rodar

**1. API** (Java 17 ou mais novo)

```bash
cd api
./mvnw spring-boot:run     # ou: mvn spring-boot:run
```

Swagger em http://localhost:8080/swagger-ui.html. Na primeira execução a API carrega 27 pontos de exemplo em Goiânia.

**2. App**

```bash
npm install
npx expo install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx expo start
```

**3. Onde trocar o IP**

Em `src/services/api.ts`, na constante `API_URL`. Celular e computador na mesma rede Wi-Fi:

- celular real: `http://IP-DO-COMPUTADOR:8080/api/v1` (não use `localhost`)
- emulador Android: `http://10.0.2.2:8080/api/v1`
- navegador (Expo web): `http://localhost:8080/api/v1`

## Onde foi testado

Marque o que realmente foi feito e apague a outra linha:

- [ ] No celular, pela rede local (IP do computador: ________)
- [ ] No navegador (Expo web), não no celular

## Estrutura do app

```
App.tsx                         só monta a navegação
src/types/                      Ponto, Doacao, Page<T>, RootStackParamList
src/services/api.ts             único arquivo que chama fetch (get, post, put, del)
src/services/pontosService.ts   listar, buscar página (com filtro), buscar por id, cadastrar, editar, excluir
src/services/doacoesService.ts  buscar página (com filtro), buscar por id, cadastrar, editar, excluir
src/services/favoritosStorage.ts favoritos no AsyncStorage (só os id)
src/hooks/useListaPaginada.ts   rolagem infinita + busca + recarga ao voltar para a tela
src/screens/                    uma tela por arquivo
src/components/                 itens de lista (com React.memo), campo de texto, mensagem de estado
```

## Roteiro de demonstração (até 3 minutos)

1. **Abertura (10 s):** "O Instituto controlava pontos e doações em papel. Agora o app lê e grava tudo numa API própria."
2. **Buscar um ponto (20 s):** na lista, digitar "marista" no campo de busca; mostrar que a lista filtra pela API. Apagar o texto e rolar até carregar a próxima página.
3. **Cadastrar um ponto (25 s):** "+ Novo ponto", mostrar a validação com um campo vazio, depois preencher e cadastrar. O ponto novo aparece na lista sem fechar o app.
4. **Editar um ponto (20 s):** abrir o ponto, "Editar", mudar o horário, "Salvar alterações". Detalhe e lista mostram o valor novo.
5. **Excluir um ponto (15 s):** "Excluir", "Cancelar" (nada muda), depois confirmar. O ponto some da lista.
6. **Favoritar (15 s):** tocar no ♡ de dois pontos, abrir "Meus pontos", desmarcar um. Fechar e reabrir o app: o outro continua favorito.
7. **Doações (45 s):** "Doar" (escolher tipo, quantidade e ponto de destino vindo da API), cadastrar. No histórico, abrir a doação, editar a quantidade, excluir com confirmação. Usar o filtro por tipo de item.
8. **400 e 404 na API (20 s):** no Swagger, mostrar um POST com campo vazio respondendo 400 e um GET com id inexistente respondendo 404.
9. **Decisão técnica (10 s):** ver abaixo.

## Decisão técnica da semana

**Favoritos ficam no aparelho; pontos e doações ficam no servidor.** Pontos e doações são dados do Instituto, compartilhados e que precisam ser os mesmos em qualquer celular, então moram na API. Favorito é uma preferência de quem usa aquele aparelho; não precisa de servidor, funciona sem rede e não exige login. Por isso só os `id` dos favoritos ficam no AsyncStorage, e os dados do ponto são buscados na API a cada vez. Se o ponto for excluído no servidor, ele simplesmente some de "Meus pontos", sem quebrar a tela.

Outras decisões, se perguntarem:

- **Só o `api.ts` chama `fetch`:** URL, timeout e tratamento de erro ficam num lugar só; as telas não montam URL.
- **Detalhe recebe só o id:** a tela sempre mostra o dado atual do servidor, inclusive depois de editar.
- **Mesmo formulário para cadastrar e editar:** a tela decide o modo pelo que chega em `route.params`, sem copiar o formulário.
