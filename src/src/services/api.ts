
//   Celular real:        http://IP-DO-COMPUTADOR:8080/api/v1   (não use localhost)
//   Emulador Android:    http://10.0.2.2:8080/api/v1
//   Navegador (Expo web): http://localhost:8080/api/v1
export const API_URL = 'http://192.168.1.236:8080/api/v1';;

const TEMPO_LIMITE_MS = 10000;

// Erro lançado quando a API responde com erro (status 400, 404...) ou não é alcançada (status 0)
export class ApiError extends Error {
  readonly status: number;
  readonly detalhes: string[];

  constructor(status: number, mensagem: string, detalhes: string[] = []) {
    super(mensagem);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.status = status;
    this.detalhes = detalhes;
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

type CorpoDeErro = {
  mensagem?: string;
  detalhes?: string[];
};

async function enviar(metodo: Metodo, caminho: string, corpo?: unknown): Promise<Response> {
  const controlador = new AbortController();
  const relogio = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(corpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controlador.signal,
    });
  } catch {
    // API desligada, IP errado, sem rede ou demorou demais
    throw new ApiError(0, 'Não foi possível conectar à API.');
  } finally {
    clearTimeout(relogio);
  }

  if (!resposta.ok) {
    let corpoErro: CorpoDeErro = {};
    try {
      corpoErro = (await resposta.json()) as CorpoDeErro;
    } catch {
      // resposta de erro sem corpo JSON
    }
    throw new ApiError(
      resposta.status,
      corpoErro.mensagem ?? `A API respondeu com o código ${resposta.status}.`,
      corpoErro.detalhes ?? []
    );
  }

  return resposta;
}

export async function get<T>(caminho: string): Promise<T> {
  const resposta = await enviar('GET', caminho);
  return (await resposta.json()) as T;
}

export async function post<T>(caminho: string, corpo: unknown): Promise<T> {
  const resposta = await enviar('POST', caminho, corpo);
  return (await resposta.json()) as T;
}

export async function put<T>(caminho: string, corpo: unknown): Promise<T> {
  const resposta = await enviar('PUT', caminho, corpo);
  return (await resposta.json()) as T;
}

export async function del(caminho: string): Promise<void> {
  await enviar('DELETE', caminho);
}

// Mensagem que a pessoa entende, para qualquer erro vindo de uma chamada à API
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError) {
    if (erro.status === 0) {
      return 'Não foi possível conectar à API. Confira se ela está ligada e se o celular está na mesma rede do computador.';
    }
    if (erro.status === 400) {
      return erro.detalhes.length > 0
        ? `Dados inválidos: ${erro.detalhes.join('; ')}`
        : 'A API recusou os dados enviados.';
    }
    if (erro.status === 404) {
      return 'Item não encontrado. Ele pode ter sido excluído.';
    }
    return 'A API encontrou um problema. Tente novamente em instantes.';
  }
  return 'Algo deu errado. Tente novamente.';
}
