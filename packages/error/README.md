# @onerb/error

Utilitários de erro para projetos Onerb. Este pacote fornece uma classe de erro de aplicação e um tipo `Either` para modelar sucesso/erro sem exceções no domínio.

> Este pacote também é reexportado por `@onerb/core`, então você pode escolher entre instalar somente `@onerb/error` ou o pacote completo.

## Requisitos

- Node.js com suporte a ESM.
- TypeScript (opcional, recomendado para tipagem).

## Instalação

```bash
npm i @onerb/error
```

```bash
yarn add @onerb/error
```

```bash
pnpm add @onerb/error
```

## O que está disponível

- `AppError`: erro de aplicação com `code` e `detail`.
- `Either`, `Left`, `Right`, `left`, `right`: utilitários para fluxo de sucesso/erro sem `throw` no domínio.

## Importação

```ts
import { AppError, Either, left, right } from '@onerb/error';
```

## Uso

### 1) Domínio: só repassa o erro (sem `throw`)

Exemplo de caso de uso no domínio que valida dados e retorna `Either`. Se ocorrer erro, ele é repassado (retornando `Left`).

```ts
import { AppError, Either, left, right } from '@onerb/error';

type CreateUserInput = {
  email: string;
  name: string;
};

type User = {
  id: string;
  email: string;
  name: string;
};

function createUser(input: CreateUserInput): Either<AppError, User> {
  if (!input.email.includes('@')) {
    return left(
      new AppError('Email inválido', {
        code: 'user.create.email.invalid',
        detail: `email recebido: ${input.email}`,
      })
    );
  }

  const user: User = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
  };

  return right(user);
}
```

### 2) Aplicação: coordena e pode lançar `throw`

Na camada de aplicação, você pode coordenar chamadas do domínio e decidir transformar `Left` em exceção (por exemplo para integração com frameworks HTTP).

Um ponto importante é o `code` do `AppError`. Como ele é uma `string`, você tem liberdade para definir uma convenção. Dá para manter uma central de constantes mapeando erros, mas uma abordagem que costuma funcionar melhor em logs e rastreamento é o padrão `scope.action.source.cause` (ex.: `user.create.email.invalid` ou `order.update.owner.unauthorized`). Esse formato é único, explícito e indica exatamente onde o fluxo foi interrompido.

```ts
import { AppError } from '@onerb/error';

async function handleCreateUser(input: { email: string; name: string }) {
  const result = createUser(input);

  if (result.isLeft()) {
    // Aqui a aplicação decide lançar o erro
    throw result.fold((err) => err, (user) => user);
  }

  return result.fold(
    () => {
      throw new AppError('Erro inesperado', { code: 'UNEXPECTED' });
    },
    (user) => user
  );
}
```

### 3) Coordenação entre domínio e aplicação

A aplicação pode orquestrar múltiplas operações de domínio, repassando `Left` sem `throw` e só convertendo para exceção no ponto de integração.

```ts
import { AppError, Either, left, right } from '@onerb/error';

function validateEmail(email: string): Either<AppError, true> {
  if (!email.includes('@')) {
    return left(
      new AppError('Email inválido', {
        code: 'user.create.email.invalid',
      })
    );
  }
  return right(true);
}

function ensureName(name: string): Either<AppError, true> {
  if (name.trim().length === 0) {
    return left(
      new AppError('Nome obrigatório', {
        code: 'user.create.name.required',
      })
    );
  }
  return right(true);
}

function createUserDomain(input: { email: string; name: string }): Either<AppError, { id: string; email: string; name: string }> {
  const emailCheck = validateEmail(input.email);
  if (emailCheck.isLeft()) return emailCheck;

  const nameCheck = ensureName(input.name);
  if (nameCheck.isLeft()) return nameCheck;

  return right({ id: crypto.randomUUID(), email: input.email, name: input.name });
}

async function createUserApp(input: { email: string; name: string }) {
  const result = createUserDomain(input);

  if (result.isLeft()) {
    throw result.fold((err) => err, () => new Error('Inalcançável'));
  }

  return result.fold(
    () => {
      throw new AppError('Erro inesperado', { code: 'UNEXPECTED' });
    },
    (user) => user
  );
}
```

## Notas

- O `Either` ajuda a manter o domínio livre de exceções, favorecendo retornos explícitos.
- A decisão de lançar erros (`throw`) fica na camada de aplicação, onde há integração com infraestrutura (HTTP, filas, etc.).
