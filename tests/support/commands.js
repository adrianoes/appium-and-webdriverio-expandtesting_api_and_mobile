import fs from 'fs';
import path from 'path';

export async function waitUntilElementVisible(strategy, selector, timeout = 20000) {
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

  await driver.back();
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

  await driver.back();
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


