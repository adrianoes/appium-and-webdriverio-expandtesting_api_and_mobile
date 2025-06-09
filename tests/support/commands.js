import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';

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

export async function logInUser(randomNumber) {
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
}

export async function deleteUser(randomNumber) {
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

  // Adiciona token
  (await waitUntilElementVisible('class name', 'android.widget.ImageView')).click();
  const keyInput = await waitUntilElementVisible('android', 'new UiSelector().text("Key")');
  await keyInput.setValue("x-auth-token");
  const valueInput = await waitUntilElementVisible('android', 'new UiSelector().text("Value")');
  await valueInput.setValue(user_token);

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
}

export function deleteJsonFile(randomNumber) {
  const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Json file deleted");
  } else {
    console.log("Json file not found");
  }
}

export async function createUser(randomNumber) {
  const userName = faker.person.fullName();
  const userEmail = faker.string.alphanumeric(2).toLowerCase() + faker.internet.email().replace(/-/g, '').toLowerCase();
  const userPassword = faker.internet.password({ length: 12, memorable: false });

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
    name: userName,
    email: userEmail,
    password: userPassword
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
  expect(responseJson.data.id).toBe(user_id);
  expect(responseJson.data.name).toBe(user_name);
  expect(responseJson.data.email).toBe(user_email);

  (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();

  // Cria arquivo com dados do usuário
  const testData = {
    user_email: userEmail,
    user_password: userPassword,
    user_id: responseJson.data.id,
    user_name: userName,
  };
  const filePath = path.resolve(`tests/fixtures/testdata-${randomNumber}.json`);
  fs.writeFileSync(filePath, JSON.stringify(testData, null, 2));
}

export async function addTokenHeader(randomNumber) {
    const filePath = `tests/fixtures/testdata-${randomNumber}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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

export async function createNote(randomNumber) {
  const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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
  
  fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  
  (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();
}

export async function create2ndNote(randomNumber) {
  const filePath = `./tests/fixtures/testdata-${randomNumber}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const user_token = data.user_token;
  const user_id = data.user_id;

  const noteTitle2 = faker.lorem.words(4);
  const noteDescription2 = faker.lorem.words(5);
  const noteCategory2 = faker.helpers.arrayElement(['Home', 'Personal', 'Work']);

  // Seleciona método HTTP POST
  const methodDropdown = await $('id:com.ab.apiclient:id/spHttpMethod');
  await methodDropdown.click();
  const postOption = await $(`android=new UiSelector().text("POST")`);
  await postOption.click();

  // Insere URL do endpoint
  const urlInput = await $('id:com.ab.apiclient:id/etUrl');
  await urlInput.setValue("https://practice.expandtesting.com/notes/api/notes");

  // Adiciona headers necessários
  await addAcceptHeader();
  await addContentTypeHeader();
  await addTokenHeader(randomNumber);

  // Localiza campo JSON
  const jsonInputField = await $('id:com.ab.apiclient:id/etJSONData');

  // Prepara corpo JSON da segunda nota
  const jsonBody = JSON.stringify({
    title: noteTitle2,
    description: noteDescription2,
    category: noteCategory2,
  });

  await jsonInputField.clearValue();
  await jsonInputField.setValue(jsonBody);

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
  expect(response.message).toBe("Note successfully created");

  const noteData = response.data;

  expect(noteData.user_id).toBe(user_id);
  expect(noteData.title).toBe(noteTitle2);
  expect(noteData.description).toBe(noteDescription2);
  expect(noteData.category).toBe(noteCategory2);
  expect(noteData.completed).toBe(false);

  // Atualiza JSON local com dados da segunda nota
  data.note_id_2 = noteData.id;
  data.note_title_2 = noteData.title;
  data.note_description_2 = noteData.description;
  data.note_category_2 = noteData.category;
  data.note_completed_2 = noteData.completed;
  data.note_created_at_2 = noteData.created_at;
  data.note_updated_at_2 = noteData.updated_at;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  (await waitUntilElementVisible('class name', 'android.widget.ImageButton')).click();
  (await waitUntilElementVisible('android', 'new UiSelector().text("New Request")')).click();
}
