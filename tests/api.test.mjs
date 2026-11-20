import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  listarPontos, buscarPonto, criarPonto, atualizarPonto, excluirPonto,
} from '../src/services/api.js';

const originalFetch = globalThis.fetch;
const URL = 'https://geopoint-6x4u.onrender.com/api/points';
const ponto = {
  name: 'Praça Central', description: 'Praça da cidade',
  latitude: -28.2825, longitude: -52.7869,
};
const json = (dados, status = 200) => ({
  ok: true, status, json: async () => dados,
});

afterEach(() => { globalThis.fetch = originalFetch; });

test('GET /api/points lista os registros', async () => {
  globalThis.fetch = async (url) => {
    assert.equal(url, URL);
    return json([{ id: 'p1', ...ponto }]);
  };
  assert.equal((await listarPontos()).length, 1);
});

test('GET /api/points/{id} codifica o identificador', async () => {
  globalThis.fetch = async (url) => {
    assert.equal(url, `${URL}/a%2Fb`);
    return json({ id: 'a/b', ...ponto });
  };
  assert.equal((await buscarPonto('a/b')).id, 'a/b');
});

test('POST envia JSON com coordenadas numéricas', async () => {
  globalThis.fetch = async (url, opcoes) => {
    assert.equal(url, URL);
    assert.equal(opcoes.method, 'POST');
    assert.equal(opcoes.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(opcoes.body), ponto);
    return json({ id: 'uuid', ...ponto }, 201);
  };
  assert.equal((await criarPonto(ponto)).id, 'uuid');
});

test('PUT atualiza o ponto existente', async () => {
  globalThis.fetch = async (url, opcoes) => {
    assert.equal(url, `${URL}/uuid`);
    assert.equal(opcoes.method, 'PUT');
    assert.deepEqual(JSON.parse(opcoes.body), ponto);
    return json({ id: 'uuid', ...ponto });
  };
  assert.equal((await atualizarPonto('uuid', ponto)).name, ponto.name);
});

test('DELETE 204 não tenta ler JSON', async () => {
  globalThis.fetch = async (url, opcoes) => {
    assert.equal(url, `${URL}/uuid`);
    assert.equal(opcoes.method, 'DELETE');
    return { ok: true, status: 204, json: () => { throw Error('Não chamar'); } };
  };
  assert.equal(await excluirPonto('uuid'), null);
});

test('Resposta de erro expõe mensagem da API', async () => {
  globalThis.fetch = async () => ({
    ok: false, status: 400, statusText: 'Bad Request',
    json: async () => ({ message: 'Latitude inválida' }),
  });
  await assert.rejects(criarPonto(ponto), /Latitude inválida/);
});

test('Falha de conexão mostra mensagem compreensível', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(listarPontos(), /Não foi possível conectar/);
});
