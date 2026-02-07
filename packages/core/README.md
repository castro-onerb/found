# @onerb/core

Pacote principal do ecossistema Onerb. Ele agrega os subpacotes oficiais e reexporta suas APIs, permitindo instalar tudo com uma única dependência.

## Instalação

```bash
npm i @onerb/core
```

```bash
yarn add @onerb/core
```

```bash
pnpm add @onerb/core
```

## Subpacotes

- `@onerb/error`: utilitários de erro e `Either`. Veja o README em [`packages/error/README.md`](../error/README.md).

## Reexportações

O `@onerb/core` reexporta todo o conteúdo de `@onerb/error`. Se você já usa `@onerb/core`, não precisa instalar o pacote de erro separadamente.

## Importação

```ts
import { AppError, Either, left, right } from '@onerb/core';
```
