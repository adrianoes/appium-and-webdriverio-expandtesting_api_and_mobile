import fs from 'fs/promises'; // para usar await

import path from 'path';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';
import {
  addAcceptHeader,
  addContentTypeHeader,
  addTokenHeader,
  addTokenHeaderUR,
  waitUntilElementVisible,
  waitForResultElementAndCloseAd,
  logInUserViaApi,
  deleteUserViaApi,
  createUserViaApi,
  deleteJsonFile,
  createNoteViaApi,
  create2ndNoteViaApi
} from '../support/commands.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('notes test', () => {
    
  it('create note', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const { user_token, user_id } = fileContent;

    const noteTitle = faker.lorem.sentence(4);
    const noteDescription = faker.lorem.sentence(5);
    const noteCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);

    // HTTP Method: POST
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await $(`android=new UiSelector().text("POST")`);
    await postOption.click();

    // Endpoint URL
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue('https://practice.expandtesting.com/notes/api/notes');

    // Headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Body
    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      title: noteTitle,
      description: noteDescription,
      category: noteCategory,
    });

    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Send
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Raw response
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully created');

    const noteData = response.data;
    expect(noteData.user_id).toBe(user_id);
    expect(noteData.title).toBe(noteTitle);
    expect(noteData.description).toBe(noteDescription);
    expect(noteData.category).toBe(noteCategory);
    expect(noteData.completed).toBe(false);

    // Update testdata JSON
    Object.assign(fileContent, {
      note_id: noteData.id,
      note_title: noteData.title,
      note_description: noteData.description,
      note_category: noteData.category,
      note_completed: noteData.completed,
      note_created_at: noteData.created_at,
      note_updated_at: noteData.updated_at,
    });

    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2));

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('create note br', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const { user_token, user_id } = fileContent;

    const noteTitle = faker.lorem.sentence(4);
    const noteDescription = faker.lorem.sentence(5);
    const noteCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);

    // HTTP Method: POST
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await $(`android=new UiSelector().text("POST")`);
    await postOption.click();

    // Endpoint URL
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue('https://practice.expandtesting.com/notes/api/notes');

    // Headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Body
    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      title: noteTitle,
      description: noteDescription,
      category: "a",
    });

    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Send
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('400');
    expect(response.message).toBe('Category must be one of the categories: Home, Work, Personal');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('create note ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const { user_token, user_id } = fileContent;

    const noteTitle = faker.lorem.sentence(4);
    const noteDescription = faker.lorem.sentence(5);
    const noteCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);

    // HTTP Method: POST
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await $(`android=new UiSelector().text("POST")`);
    await postOption.click();

    // Endpoint URL
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue('https://practice.expandtesting.com/notes/api/notes');

    // Headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeaderUR(randomNumber);

    // Body
    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      title: noteTitle,
      description: noteDescription,
      category: noteCategory,
    });

    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Send
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();
    
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get notes', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);
    await create2ndNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    // Seleciona método HTTP GET
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const getOption = await $(`android=new UiSelector().text("GET")`);
    await getOption.click();

    // Insere URL para obter todas as notas
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/notes");

    // Adiciona headers necessários
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Visualiza aba "Raw"
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    // Captura e valida resposta
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe("200");
    expect(response.message).toBe("Notes successfully retrieved");

    const notes = response.data;
    expect(notes.length).toBe(2);

    const userId = data.user_id;

    // Nota 2 (mais recente, índice 0)
    const note2 = notes[0];
    expect(note2.id).toBe(data.note_id_2);
    expect(note2.user_id).toBe(userId);
    expect(note2.title).toBe(data.note_title_2);
    expect(note2.description).toBe(data.note_description_2);
    expect(note2.category).toBe(data.note_category_2);
    expect(note2.completed).toBe(data.note_completed_2);
    expect(note2.created_at).toBe(data.note_created_at_2);
    expect(note2.updated_at).toBe(data.note_updated_at_2);

    // Nota 1 (primeira criada, índice 1)
    const note1 = notes[1];
    expect(note1.id).toBe(data.note_id);
    expect(note1.user_id).toBe(userId);
    expect(note1.title).toBe(data.note_title);
    expect(note1.description).toBe(data.note_description);
    expect(note1.category).toBe(data.note_category);
    expect(note1.completed).toBe(data.note_completed);
    expect(note1.created_at).toBe(data.note_created_at);
    expect(note1.updated_at).toBe(data.note_updated_at);


    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get notes ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);
    await create2ndNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    // Seleciona método HTTP GET
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const getOption = await $(`android=new UiSelector().text("GET")`);
    await getOption.click();

    // Insere URL para obter todas as notas
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/notes");

    // Adiciona headers necessários
    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura e valida resposta
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe("401");
    expect(response.message).toBe("Access token is not valid or has expired, you will need to login");

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get note', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_title,
        note_description,
        note_category,
        note_completed,
        note_created_at,
        note_updated_at,
    } = fileContent;

    // Seleciona método HTTP GET
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const getOption = await $(`android=new UiSelector().text("GET")`);
    await getOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Abre aba "Raw"
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully retrieved');

    const noteData = response.data;
    expect(noteData.id).toBe(note_id);
    expect(noteData.user_id).toBe(user_id);
    expect(noteData.title).toBe(note_title);
    expect(noteData.description).toBe(note_description);
    expect(noteData.category).toBe(note_category);
    expect(noteData.completed).toBe(note_completed);
    expect(noteData.created_at).toBe(note_created_at);
    expect(noteData.updated_at).toBe(note_updated_at);

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get note ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_title,
        note_description,
        note_category,
        note_completed,
        note_created_at,
        note_updated_at,
    } = fileContent;

    // Seleciona método HTTP GET
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const getOption = await $(`android=new UiSelector().text("GET")`);
    await getOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_created_at,
    } = fileContent;

    const noteUpdatedTitle = faker.lorem.sentence(4);
    const noteUpdatedDescription = faker.lorem.sentence(5);
    const noteUpdatedCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);
    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PUT
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const putOption = await $(`android=new UiSelector().text("PUT")`);
    await putOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Prepara corpo JSON com dados atualizados
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
        title: noteUpdatedTitle,
        description: noteUpdatedDescription,
        category: noteUpdatedCategory,
        completed: noteUpdatedCompleted,
    });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Abre aba "Raw"
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully Updated');

    const noteData = response.data;
    expect(noteData.id).toBe(note_id);
    expect(noteData.user_id).toBe(user_id);
    expect(noteData.title).toBe(noteUpdatedTitle);
    expect(noteData.description).toBe(noteUpdatedDescription);
    expect(noteData.category).toBe(noteUpdatedCategory);
    expect(noteData.completed).toBe(true);
    expect(noteData.created_at).toBe(note_created_at);
    expect(noteData.updated_at).not.toBe(note_created_at);

    // Atualiza JSON local com novos dados
    Object.assign(fileContent, {
        note_title: noteData.title,
        note_description: noteData.description,
        note_category: noteData.category,
        note_completed: noteData.completed,
        note_updated_at: noteData.updated_at,
    });
    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2));

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note br', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_created_at,
    } = fileContent;

    const noteUpdatedTitle = faker.lorem.sentence(4);
    const noteUpdatedDescription = faker.lorem.sentence(5);
    const noteUpdatedCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);
    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PUT
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const putOption = await $(`android=new UiSelector().text("PUT")`);
    await putOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Prepara corpo JSON com dados atualizados
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
        title: noteUpdatedTitle,
        description: noteUpdatedDescription,
        category: "a",
        completed: noteUpdatedCompleted,
    });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('400');
    expect(response.message).toBe('Category must be one of the categories: Home, Work, Personal');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_created_at,
    } = fileContent;

    const noteUpdatedTitle = faker.lorem.sentence(4);
    const noteUpdatedDescription = faker.lorem.sentence(5);
    const noteUpdatedCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);
    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PUT
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const putOption = await $(`android=new UiSelector().text("PUT")`);
    await putOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeaderUR(randomNumber);

    // Prepara corpo JSON com dados atualizados
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
        title: noteUpdatedTitle,
        description: noteUpdatedDescription,
        category: noteUpdatedCategory,
        completed: noteUpdatedCompleted,
    });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note status', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_title,
        note_description,
        note_category,
        note_created_at,
        note_updated_at,
    } = fileContent;

    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PATCH
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const patchOption = await $(`android=new UiSelector().text("PATCH")`);
    await patchOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Prepara corpo JSON com atualização do status
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ completed: noteUpdatedCompleted });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Abre aba "Raw"
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully Updated');

    const noteData = response.data;
    expect(noteData.id).toBe(note_id);
    expect(noteData.user_id).toBe(user_id);
    expect(noteData.title).toBe(note_title);
    expect(noteData.description).toBe(note_description);
    expect(noteData.category).toBe(note_category);
    expect(noteData.completed).toBe(true);
    expect(noteData.created_at).toBe(note_created_at);
    expect(noteData.updated_at).not.toBe(note_updated_at);

    // Atualiza JSON local com novo status
    fileContent.note_completed = noteData.completed;
    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2));

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note status br', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_title,
        note_description,
        note_category,
        note_created_at,
        note_updated_at,
    } = fileContent;

    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PATCH
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const patchOption = await $(`android=new UiSelector().text("PATCH")`);
    await patchOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Prepara corpo JSON com atualização do status
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ completed: "a" });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('400');
    expect(response.message).toBe('Note completed status must be boolean');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update note status ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const {
        user_token,
        user_id,
        note_id,
        note_title,
        note_description,
        note_category,
        note_created_at,
        note_updated_at,
    } = fileContent;

    const noteUpdatedCompleted = true;

    // Seleciona método HTTP PATCH
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const patchOption = await $(`android=new UiSelector().text("PATCH")`);
    await patchOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeaderUR(randomNumber);

    // Prepara corpo JSON com atualização do status
    const jsonInput = await $('id:com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ completed: noteUpdatedCompleted });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('delete note', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const { user_token, note_id } = fileContent;

    // Seleciona método HTTP DELETE
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const deleteOption = await $(`android=new UiSelector().text("DELETE")`);
    await deleteOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Abre aba "Raw"
    const rawTab = await $(`android=new UiSelector().text("Raw")`);
    await rawTab.click();
    await waitForResultElementAndCloseAd();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully deleted');

    // Remove dados da nota do JSON local
    for (const key of Object.keys(fileContent)) {
        if (key.startsWith('note_')) {
        delete fileContent[key];
        }
    }
    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2));

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('delete note br', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const { user_token, note_id } = fileContent;

    // Seleciona método HTTP DELETE
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const deleteOption = await $(`android=new UiSelector().text("DELETE")`);
    await deleteOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/'@'+${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('400');
    expect(response.message).toBe('Note ID must be a valid ID');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('delete note ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    await createUserViaApi(randomNumber);
    await logInUserViaApi(randomNumber);
    await createNoteViaApi(randomNumber);

    const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
    const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const { user_token, note_id } = fileContent;

    // Seleciona método HTTP DELETE
    const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const deleteOption = await $(`android=new UiSelector().text("DELETE")`);
    await deleteOption.click();

    // Insere URL com ID da nota
    const urlInput = await $('id:com.ab.apiclient:id/etUrl');
    await urlInput.setValue(`https://practice.expandtesting.com/notes/api/notes/${note_id}`);

    // Adiciona headers obrigatórios
    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    // Envia requisição
    const sendButton = await $('id:com.ab.apiclient:id/btnSend');
    await sendButton.click();

    // Captura resposta e valida
    const responseText = await $('id:com.ab.apiclient:id/tvResult').getText();
    const response = JSON.parse(responseText);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUserViaApi(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

});
