import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';
import {
  addAcceptHeader,
  addContentTypeHeader,
  increasingRequestResponseTimeout,
  waitUntilElementVisible,
  waitForResultElementAndCloseAd,
  logInUser,
  deleteUser,
  deleteJsonFile,
} from '../support/commands.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('User API Test', () => {
  it('should create, authenticate and delete user', async () => {
    const randomNumber = faker.string.alphanumeric(12);
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

    // Login e delete
    await logInUser(randomNumber);
    await deleteUser(randomNumber);

    await sleep(5000);
    deleteJsonFile(randomNumber);
  });
});
