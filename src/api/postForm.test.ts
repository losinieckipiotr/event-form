import { rest } from 'msw'
import { setupServer } from 'msw/node'
import postForm, { FormData } from './postForm';

const resultOk = { result: 'OK' };

const testPostData: FormData = {
  firstName: 'a',
  lastName: 'b',
  email: 'a@a.com',
  date: new Date('2020-10-08'),
};

interface Data {
  firstName: string;
  lastName: string;
  email: string;
  date: string;
}

// let body: any = undefined;

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('posts form', async () => {
  server.use(
    rest.post('/api/postForm', (req, res, ctx) => {
      return res(ctx.json(resultOk));
    })
  );

  const r = await postForm(testPostData);
  expect(r).toBe(JSON.stringify(resultOk));
});

it('posts proper data', async () => {
  server.use(
    rest.post<Data>('/api/postForm', (req, res, ctx) => {
      // return body as response
      return res(ctx.json(req.body));
    })
  );

  const r = await postForm(testPostData);
  const r2 = JSON.parse(r);
  expect(r2.firstName).toBe(testPostData.firstName);
  expect(r2.lastName).toBe(testPostData.lastName);
  expect(r2.email).toBe(testPostData.email);
  expect(r2.date).toBe(testPostData.date.toJSON());
});

it('recives invalid content type', async () => {
  server.use(
    rest.post('/api/postForm', (req, res, ctx) => {
      // valid JSON but Content-Type: text/plain
      return res(ctx.text(JSON.stringify(resultOk)));
    })
  );

  const invalidResponseError = new Error('Invalid response');

  await expect(postForm(testPostData)).rejects.toStrictEqual(invalidResponseError);
});
