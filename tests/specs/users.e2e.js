import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';
import {
  addAcceptHeader,
  addTokenHeader,
   addTokenHeaderUR,
  addContentTypeHeader,
  increasingRequestResponseTimeout,
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

describe('users test', () => {
  it('create user', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    const user_name = faker.person.fullName();
    const user_email = faker.string.alphanumeric(2).toLowerCase() + faker.internet.email().replace(/-/g, '').toLowerCase();
    const user_password = faker.internet.password({ length: 12, memorable: false });
  
     // Desativa o Wi-Fi
    execSync('adb shell svc wifi disable');
    await sleep(5000);
  
    await increasingRequestResponseTimeout();
  
    // Define método POST
    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('xpath', "//android.widget.CheckedTextView[@resource-id='android:id/text1' and @text='POST']");
    await postOption.click();
  
    // Define URL de criação
    const urlInput = await waitUntilElementVisible('xpath', "//android.widget.EditText[@resource-id='com.ab.apiclient:id/etUrl']");
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/register");
  
    await addAcceptHeader();
    await addContentTypeHeader();
  
    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      name: user_name,
      email: user_email,
      password: user_password
    });  
    await jsonInput.setValue(jsonBody);
  
    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();
  
    const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    await rawTab.click();
  
    await waitForResultElementAndCloseAd();
    const responseTextElement = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseTextElement.getText();
    console.log(`Response string is: ${responseStr}`);
  
    const responseJson = JSON.parse(responseStr);
    expect(responseJson.success).toBe(true);
    expect(String(responseJson.status)).toBe('201');
    expect(responseJson.message).toBe('User account created successfully');
    expect(responseJson.data.name).toBe(user_name);
    expect(responseJson.data.email).toBe(user_email);
  
    (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
    (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();
  
    // Cria arquivo com dados do usuário
    const testData = {
      user_email: user_email,
      user_password: user_password,
      user_id: responseJson.data.id,
      user_name: user_name,
    };
    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    fs.writeFileSync(filePath, JSON.stringify(testData, null, 2));

    // Login e delete
    await logInUser(randomNumber);
    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('create user br', async () => {
    const randomNumber = faker.string.alphanumeric(12);
    const user_name = faker.person.fullName();
    const user_email = faker.string.alphanumeric(2).toLowerCase() + faker.internet.email().replace(/-/g, '').toLowerCase();
    const user_password = faker.internet.password({ length: 12, memorable: false });

    // Desativa o Wi-Fi
    execSync('adb shell svc wifi disable');
    await sleep(5000);

    await increasingRequestResponseTimeout();

    // Define método POST
    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('xpath', "//android.widget.CheckedTextView[@resource-id='android:id/text1' and @text='POST']");
    await postOption.click();

    // Define URL de criação
    const urlInput = await waitUntilElementVisible('xpath', "//android.widget.EditText[@resource-id='com.ab.apiclient:id/etUrl']");
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/register");

    await addAcceptHeader();
    await addContentTypeHeader();

    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({
      name: user_name,
      email: '@'+user_email,
      password: user_password
    });
    await jsonInput.setValue(jsonBody);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    // const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    // await rawTab.click();

    // await waitForResultElementAndCloseAd();
    const responseTextElement = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseTextElement.getText();
    console.log(`Response string is: ${responseStr}`);

    const responseJson = JSON.parse(responseStr);
    expect(responseJson.success).toBe(false);
    expect(String(responseJson.status)).toBe('400');
    expect(responseJson.message).toBe('A valid email address is required');
    
  });

  it('login user', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);

    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));

    const { user_email, user_password, user_id, user_name } = data;

    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="POST"]');
    await postOption.click();

    const urlInput = await waitUntilElementVisible('xpath', '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/login");

    await addAcceptHeader();
    await addContentTypeHeader();

    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ email: user_email, password: user_password });
    await jsonInput.setValue(jsonBody);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    await rawTab.click();

    await waitForResultElementAndCloseAd();
    const responseText = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseText.getText();
    const response = JSON.parse(responseStr);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Login successful');
    expect(response.data.id).toBe(user_id);
    expect(response.data.name).toBe(user_name);
    expect(response.data.email).toBe(user_email);

    data.user_token = response.data.token;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    (await waitUntilElementVisible('xpath', '//android.widget.ImageButton')).click();
    (await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@text="New Request"]')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('login user br', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);

    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));

    const { user_email, user_password, user_id, user_name } = data;

    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="POST"]');
    await postOption.click();

    const urlInput = await waitUntilElementVisible('xpath', '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/login");

    await addAcceptHeader();
    await addContentTypeHeader();

    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ email: '@'+user_email, password: user_password });
    await jsonInput.setValue(jsonBody);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    const responseText = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseText.getText();
    const response = JSON.parse(responseStr);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('400');
    expect(response.message).toBe('A valid email address is required');

    (await waitUntilElementVisible('xpath', '//android.widget.ImageButton')).click();
    (await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@text="New Request"]')).click();

    await logInUser(randomNumber);
    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('login user ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);

    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));

    const { user_email, user_password, user_id, user_name } = data;

    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const postOption = await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="POST"]');
    await postOption.click();

    const urlInput = await waitUntilElementVisible('xpath', '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/login");

    await addAcceptHeader();
    await addContentTypeHeader();

    const jsonInput = await waitUntilElementVisible('id', 'com.ab.apiclient:id/etJSONData');
    const jsonBody = JSON.stringify({ email: user_email, password: '@'+user_password });
    await jsonInput.setValue(jsonBody);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    const responseText = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseText.getText();
    const response = JSON.parse(responseStr);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Incorrect email address or password');

    (await waitUntilElementVisible('xpath', '//android.widget.ImageButton')).click();
    (await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@text="New Request"]')).click();

    await logInUser(randomNumber);
    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get user', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_id, user_name, user_email } = fileData;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método GET
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("GET")')).click();

    // Insere a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/profile');

    // Adiciona headers
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Envia requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    // Visualiza a aba "Raw"
    await (await wait('android=new UiSelector().text("Raw")')).click();
    await waitForResultElementAndCloseAd();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Profile successful');
    expect(response.data.id).toBe(user_id);
    expect(response.data.name).toBe(user_name);
    expect(response.data.email).toBe(user_email);

    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('get user ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_id, user_name, user_email } = fileData;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método GET
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("GET")')).click();

    // Insere a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/profile');

    // Adiciona headers
    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    // Envia requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_id, user_name, user_email } = fileData;
    const user_phone = faker.string.numeric(12);
    const user_company = faker.company.name().slice(0, 24);

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método PATCH
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("PATCH")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/profile');

    // Adiciona os headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Preenche o corpo JSON da requisição
    const jsonBody = JSON.stringify({
        name: user_name,
        phone: user_phone,
        company: user_company
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    // Abre a aba "Raw" e lê a resposta
    await (await wait('android=new UiSelector().text("Raw")')).click();
    await waitForResultElementAndCloseAd();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toBe('Profile updated successful');
    expect(response.data.id).toBe(user_id);
    expect(response.data.name).toBe(user_name);
    expect(response.data.email).toBe(user_email);
    expect(response.data.phone).toBe(user_phone);
    expect(response.data.company).toBe(user_company);

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user br', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_id, user_name, user_email } = fileData;
    const user_phone = faker.string.numeric(12);
    const user_company = faker.company.name().slice(0, 24);

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método PATCH
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("PATCH")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/profile');

    // Adiciona os headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Preenche o corpo JSON da requisição
    const jsonBody = JSON.stringify({
        name: 'a@#',
        phone: user_phone,
        company: user_company
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
    expect(response.message).toBe('User name must be between 4 and 30 characters');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_id, user_name, user_email } = fileData;
    const user_phone = faker.string.numeric(12);
    const user_company = faker.company.name().slice(0, 24);

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método PATCH
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("PATCH")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/profile');

    // Adiciona os headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeaderUR(randomNumber);

    // Preenche o corpo JSON da requisição
    const jsonBody = JSON.stringify({
        name: user_name,
        phone: user_phone,
        company: user_company
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user password', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_password } = fileData;
    const user_updated_password = faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9]/,
    });

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método POST
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("POST")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/change-password');

    // Adiciona headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Corpo da requisição JSON
    const jsonBody = JSON.stringify({
        currentPassword: user_password,
        newPassword: user_updated_password
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    // Abre a aba "Raw" e lê a resposta
    await (await wait('android=new UiSelector().text("Raw")')).click();
    await waitForResultElementAndCloseAd();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toBe('The password was successfully updated');

    // Atualiza o JSON com a nova senha
    fileData.user_password = user_updated_password;
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user password br', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_password } = fileData;
    const user_updated_password = faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9]/,
    });

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método POST
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("POST")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/change-password');

    // Adiciona headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeader(randomNumber);

    // Corpo da requisição JSON
    const jsonBody = JSON.stringify({
        currentPassword: user_password,
        newPassword: "123"
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
    expect(response.message).toBe('New password must be between 6 and 30 characters');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('update user password ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token, user_password } = fileData;
    const user_updated_password = faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9]/,
    });

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona o método POST
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("POST")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/change-password');

    // Adiciona headers
    await addAcceptHeader();
    await addContentTypeHeader();
    await addTokenHeaderUR(randomNumber);

    // Corpo da requisição JSON
    const jsonBody = JSON.stringify({
        currentPassword: user_password,
        newPassword: user_updated_password,
    });

    await (await wait('id=com.ab.apiclient:id/etJSONData')).setValue(jsonBody);

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    // Cleanup
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('logout user', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token } = fileData;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona método DELETE
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("DELETE")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/logout');

    // Adiciona headers
    await addAcceptHeader();
    await addTokenHeader(randomNumber);

    // Limpa o corpo JSON (se necessário)
    const bodyInput = await wait('id=com.ab.apiclient:id/etJSONData');
    await bodyInput.clearValue();

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    // Acessa a aba "Raw" e obtém a resposta
    await (await wait('android=new UiSelector().text("Raw")')).click();
    await waitForResultElementAndCloseAd();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toBe('User has been successfully logged out');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    // Login novamente para obter novo token
    await logInUser(randomNumber);

    // Cleanup
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('logout user ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    await logInUser(randomNumber);

    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const { user_token } = fileData;

    const wait = async (locator) => {
        const el = await $(locator);
        await el.waitForDisplayed({ timeout: 20000 });
        return el;
    };

    // Seleciona método DELETE
    await (await wait('id=com.ab.apiclient:id/spHttpMethod')).click();
    await (await wait('android=new UiSelector().text("DELETE")')).click();

    // Define a URL do endpoint
    await (await wait('id=com.ab.apiclient:id/etUrl')).setValue('https://practice.expandtesting.com/notes/api/users/logout');

    // Adiciona headers
    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    // Limpa o corpo JSON (se necessário)
    const bodyInput = await wait('id=com.ab.apiclient:id/etJSONData');
    await bodyInput.clearValue();

    // Envia a requisição
    await (await $('id=com.ab.apiclient:id/btnSend')).click();

    const responseText = await (await $('id=com.ab.apiclient:id/tvResult')).getText();
    const response = JSON.parse(responseText);

    // Validações
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    // Retorna à tela inicial
    await (await wait('//android.widget.ImageButton')).click();
    await (await wait('android=new UiSelector().text("New Request")')).click();

    // Login novamente para obter novo token
    await logInUser(randomNumber);

    // Cleanup
    await deleteUser(randomNumber);
    await sleep(5000);
    deleteJsonFile(randomNumber);
  });

  it('delete user', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    
    await logInUser(randomNumber);

    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));
    const { user_token } = data;

    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const deleteOption = await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="DELETE"]');
    await deleteOption.click();

    const urlInput = await waitUntilElementVisible('xpath', '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/delete-account");

    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    await rawTab.click();

    await waitForResultElementAndCloseAd();
    const responseText = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseText.getText();
    const response = JSON.parse(responseStr);

    expect(response.success).toBe(true);
    expect(String(response.status)).toBe('200');
    expect(response.message).toBe('Account successfully deleted');

    (await waitUntilElementVisible('xpath', '//android.widget.ImageButton')).click();
    (await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@text="New Request"]')).click();

    await sleep(5000);

    deleteJsonFile(randomNumber);
  });

  it('delete user ur', async () => {
    const randomNumber = faker.string.alphanumeric(12);

    await createUser(randomNumber);
    
    await logInUser(randomNumber);

    const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));
    const { user_token } = data;

    const methodDropdown = await waitUntilElementVisible('id', 'com.ab.apiclient:id/spHttpMethod');
    await methodDropdown.click();
    const deleteOption = await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="DELETE"]');
    await deleteOption.click();

    const urlInput = await waitUntilElementVisible('xpath', '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]');
    await urlInput.setValue("https://practice.expandtesting.com/notes/api/users/delete-account");

    await addAcceptHeader();
    await addTokenHeaderUR(randomNumber);

    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    const responseText = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseText.getText();
    const response = JSON.parse(responseStr);

    expect(response.success).toBe(false);
    expect(String(response.status)).toBe('401');
    expect(response.message).toBe('Access token is not valid or has expired, you will need to login');

    (await waitUntilElementVisible('xpath', '//android.widget.ImageButton')).click();
    (await waitUntilElementVisible('xpath', '//android.widget.CheckedTextView[@text="New Request"]')).click();

    await sleep(5000);

    deleteJsonFile(randomNumber);
  });

});
