import { execSync } from 'child_process';
import {
  addAcceptHeader,
  increasingRequestResponseTimeout,
  waitForResultElementAndCloseAd,
  waitUntilElementVisible,
} from '../support/commands.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Health API test', () => {
  it('should check API health', async () => {
    // Desativa o Wi-Fi via ADB
    execSync('adb shell svc wifi disable');

    // Aguarda 5 segundos
    await sleep(5000);

    // Aumenta o tempo de timeout de requisições na aplicação
    await increasingRequestResponseTimeout();

    // Preenche o campo da URL da requisição
    const urlInput = await waitUntilElementVisible(
      'xpath',
      '//android.widget.EditText[@resource-id="com.ab.apiclient:id/etUrl"]'
    );
    await urlInput.setValue('https://practice.expandtesting.com/notes/api/health-check');

    // Adiciona header: Accept: application/xml
    await addAcceptHeader();

    // Clica no botão "Send"
    const sendBtn = await waitUntilElementVisible('id', 'com.ab.apiclient:id/btnSend');
    await sendBtn.click();

    // Abre a aba "Raw" para visualizar a resposta
    const rawTab = await waitUntilElementVisible('android', 'new UiSelector().text("Raw")');
    await rawTab.click();

    // Aguarda o resultado e fecha anúncio, se necessário
    await waitForResultElementAndCloseAd();

    // Lê a resposta exibida no app
    const responseTextElement = await waitUntilElementVisible('id', 'com.ab.apiclient:id/tvResult');
    const responseStr = await responseTextElement.getText();
    console.log(`Response string is: ${responseStr}`);

    // Converte resposta para JSON
    const responseJson = JSON.parse(responseStr);

    // Validações
    expect(responseJson.success).toBe(true);
    expect(String(responseJson.status)).toBe('200');
    expect(responseJson.message).toBe('Notes API is Running');
  });
  
});
