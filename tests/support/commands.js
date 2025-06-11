import fs from 'fs/promises'; // para usar await

import path from 'path';
import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';
import supertest from 'supertest';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitUntilElementVisible(strategy, selector, timeout = 180000) {
  let elem;
  switch (strategy) {
    case 'id':
    case 'accessibility id':
    case 'android':
    case 'ios':
      elem = await $(`${strategy}=${selector}`);
      break;
    case 'xpath':
      // Para xpath não adiciona strategy=
      elem = await $(selector);
      break;
    case 'class name':
      elem = await $(`android=new UiSelector().className("${selector}")`);
      break;
    default:
      throw new Error(`Unsupported strategy: ${strategy}`);
  }
  await elem.waitForDisplayed({ timeout });
  return elem;
}

export async function waitForResultElementAndCloseAd() {
  try {
    await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult', 20000);
  } catch (error) {
    await closeFullScreenAd();
    await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult', 10000);
  }
}

export async function addAcceptHeader() {
  (await waitUntilElementVisible('class name', 'android.widget.ImageView')).click();
  (await waitUntilElementVisible('id', 'com.ab.apiclient:id/iconDown')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("Accept")')).click();
  (await waitUntilElementVisible('id', 'com.ab.apiclient:id/iconDownVal')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("application/xml")')).click();
}

export async function increasingRequestResponseTimeout() {
  (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("Settings")')).click();

  const timeoutConnection = await $('id=com.ab.apiclient:id/etTimeoutConnection');
  await timeoutConnection.clearValue();
  await timeoutConnection.setValue("120");

  const timeoutREAD = await $('id=com.ab.apiclient:id/etTimeoutREAD');
  await timeoutREAD.clearValue();
  await timeoutREAD.setValue("120");

  const timeoutWRITE = await $('id=com.ab.apiclient:id/etTimeoutWRITE');
  await timeoutWRITE.clearValue();
  await timeoutWRITE.setValue("120");

  (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();
}

export async function closeFullScreenAd() {
  // Implemente aqui se houver anúncios fullscreen
}

export async function addContentTypeHeader() {
  (await waitUntilElementVisible('class name', 'android.widget.ImageView')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().resourceId("com.ab.apiclient:id/iconDown").instance(1)')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("Content-Type")')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().resourceId("com.ab.apiclient:id/iconDownVal").instance(1)')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("application/json")')).click();
}

export async function deleteJsonFile(randomNumber) {
  const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);

  try {
    await fs.unlink(filePath);
    console.log("Json file deleted");
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log("Json file not found");
    } else {
      throw err;
    }
  }
}

export async function addTokenHeader(randomNumber) {
    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const userToken = data.user_token;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Abrir painel de header
    await (await wait('android=new UiSelector().className("android.widget.ImageView").instance(0)')).click();

    // Preencher "Key" com x-auth-token
    await (await wait('android=new UiSelector().text("Key")')).setValue('x-auth-token');

    // Preencher "Value" com o token do usuário
    await (await wait('android=new UiSelector().text("Value")')).setValue(userToken);
}

export async function addTokenHeaderUR(randomNumber) {
    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const userToken = data.user_token;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Abrir painel de header
    await (await wait('android=new UiSelector().className("android.widget.ImageView").instance(0)')).click();

    // Preencher "Key" com x-auth-token
    await (await wait('android=new UiSelector().text("Key")')).setValue('x-auth-token');

    // Preencher "Value" com o token do usuário
    await (await wait('android=new UiSelector().text("Value")')).setValue('@'+userToken);
}

export async function logInUserViaApi(randomNumber) {
    const rawData = await fs.readFile(`tests/fixtures/testdata-${randomNumber}.json`, 'utf-8');
    const user = JSON.parse(rawData);

    const response = await supertest('https://practice.expandtesting.com/notes/api')
        .post('/users/login')
        .send({
            email: user.user_email,
            password: user.user_password
        });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data.email).toBe(user.user_email);
    expect(response.body.data.name).toBe(user.user_name);
    expect(response.body.data.id).toBe(user.user_id);

    await fs.writeFile(`tests/fixtures/testdata-${randomNumber}.json`, JSON.stringify({
        ...user,
        user_token: response.body.data.token
    }, null, 2));
}

export async function deleteUserViaApi(randomNumber) {
    const rawData = await fs.readFile(`tests/fixtures/testdata-${randomNumber}.json`, 'utf-8');
    const { user_token } = JSON.parse(rawData);

    const response = await supertest('https://practice.expandtesting.com/notes/api')
        .delete('/users/delete-account')
        .set('X-Auth-Token', user_token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Account successfully deleted');
}

export async function createUserViaApi(randomNumber) {
    const user = {
        user_email: faker.internet.exampleEmail().toLowerCase(),
        user_name: faker.person.fullName(),
        user_password: faker.internet.password({ length: 8 })
    };

    const response = await supertest('https://practice.expandtesting.com/notes/api')
        .post('/users/register')
        .send({
      name: user.user_name,
      email: user.user_email,
      password: user.user_password
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe(201);
    expect(response.body.message).toBe('User account created successfully');
    expect(response.body.data.email).toBe(user.user_email);
    expect(response.body.data.name).toBe(user.user_name);


    await fs.writeFile(`tests/fixtures/testdata-${randomNumber}.json`, JSON.stringify({
        user_email: user.user_email,
        user_id: response.body.data.id,
        user_name: user.user_name,
        user_password: user.user_password
    }, null, 2));
}

export async function createNoteViaApi(randomNumber) {
    const rawData = await fs.readFile(`tests/fixtures/testdata-${randomNumber}.json`, 'utf-8');
    const user = JSON.parse(rawData);

    const note = {
        note_title: faker.word.words(3),
        note_description: faker.word.words(5),
        note_category: faker.helpers.arrayElement(['Home', 'Work', 'Personal'])
    };

    const response = await supertest('https://practice.expandtesting.com/notes/api')
        .post('/notes')
        .set('X-Auth-Token', user.user_token)
        .type('form')
        .send({
            title: note.note_title,
            description: note.note_description,
            category: note.note_category
        });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Note successfully created');
    expect(response.body.data.title).toBe(note.note_title);
    expect(response.body.data.description).toBe(note.note_description);
    expect(response.body.data.category).toBe(note.note_category);
    expect(response.body.data.user_id).toBe(user.user_id);

    console.log(response.body.message);

    await fs.writeFile(`tests/fixtures/testdata-${randomNumber}.json`, JSON.stringify({
        ...user,
        note_id: response.body.data.id,
        note_title: response.body.data.title,
        note_description: response.body.data.description,
        note_completed: response.body.data.completed,
        note_category: response.body.data.category,
        note_created_at: response.body.data.created_at,
        note_updated_at: response.body.data.updated_at
    }, null, 2));
}

export async function create2ndNoteViaApi(randomNumber) {
    const rawData = await fs.readFile(`tests/fixtures/testdata-${randomNumber}.json`, 'utf-8');
    const user = JSON.parse(rawData);

    const note = {
        note_title_2: faker.word.words(3),
        note_description_2: faker.word.words(5),
        note_category_2: faker.helpers.arrayElement(['Home', 'Work', 'Personal'])
    };

    const response = await supertest('https://practice.expandtesting.com/notes/api')
        .post('/notes')
        .set('X-Auth-Token', user.user_token)
        .type('form')
        .send({
            title: note.note_title_2,
            description: note.note_description_2,
            category: note.note_category_2
        });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Note successfully created');
    expect(response.body.data.title).toBe(note.note_title_2);
    expect(response.body.data.description).toBe(note.note_description_2);
    expect(response.body.data.category).toBe(note.note_category_2);
    expect(response.body.data.user_id).toBe(user.user_id);

    console.log(response.body.message);

    await fs.writeFile(`tests/fixtures/testdata-${randomNumber}.json`, JSON.stringify({
        ...user,
        note_id_2: response.body.data.id,
        note_title_2: response.body.data.title,
        note_description_2: response.body.data.description,
        note_completed_2: response.body.data.completed,
        note_category_2: response.body.data.category,
        note_created_at_2: response.body.data.created_at,
        note_updated_at_2: response.body.data.updated_at
    }, null, 2));
}