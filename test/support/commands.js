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

