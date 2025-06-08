import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import {
  addAcceptHeader,
  addContentTypeHeader,
  addTokenHeader,
  waitUntilElementVisible,
  waitForResultElementAndCloseAd,
  logInUser,
  deleteUser,
  createUser,
  deleteJsonFile,
} from '../support/commands.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('notes test', () => {
  it('create note', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    // Cria usuário e faz login
    await createUser(randomNumber);
    await logInUser(randomNumber);

    // Lê dados do usuário do arquivo de fixture
    const filePath = path.resolve(`./tests/fixtures/testdata-${randomNumber}.json`);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const { user_token, user_id } = fileContent;

    // Dados da nota
    const noteTitle = faker.lorem.sentence(4);
    const noteDescription = faker.lorem.sentence(5);
    const noteCategory = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);

    // Seleciona método POST
    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('android', 'new UiSelector().text("POST")');
    await postOption.click();

    // Define URL do endpoint
    const urlInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etUrl');
    await urlInput.setValue('https://practice.expandtesting.com/notes/api/notes');

    // Adiciona headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Define corpo JSON
    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      title: noteTitle,
      description: noteDescription,
      category: noteCategory,
    });
    await jsonInput.clearValue();
    await jsonInput.setValue(jsonBody);

    // Envia requisição
    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    // Clica na aba Raw para ver a resposta bruta
    const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    await rawTab.click();

    // Aguarda resposta e fecha anúncio se aparecer
    await waitForResultElementAndCloseAd();

    // Lê o texto da resposta
    const responseTextElement = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseText = await responseTextElement.getText();
    console.log(`Response string is: ${responseText}`);

    const response = JSON.parse(responseText);

    // Validações usando expect do WebdriverIO (mesmo padrão do create user)
    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Note successfully created');

    const noteData = response.data;
    expect(noteData.user_id).toBe(user_id);
    expect(noteData.title).toBe(noteTitle);
    expect(noteData.description).toBe(noteDescription);
    expect(noteData.category).toBe(noteCategory);
    expect(noteData.completed).toBe(false);

    // Atualiza arquivo JSON com dados da nota criada
    Object.assign(fileContent, {
      note_id: noteData.id,
      note_title: noteData.title,
      note_description: noteData.description,
      note_category: noteData.category,
      note_completed: noteData.completed,
      note_created_at: noteData.created_at,
      note_updated_at: noteData.updated_at,
    });
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));

    // Volta para nova requisição na UI do app
    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

    // Cleanup: deleta usuário, espera e apaga arquivo
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });
});
