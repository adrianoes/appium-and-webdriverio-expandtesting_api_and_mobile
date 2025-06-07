# appium-and-webdriverio-expandtesting_mobile

Mobile testing in ApiClient apk using [expandtesting](https://practice.expandtesting.com/notes/api/api-docs/). This project contains basic examples on how to use Appium and WebdriverIO to test Mobile tests. Good practices such as hooks, custom commands and tags, among others, are used. All the necessary support documentation to develop this project is placed here. 

# Pre-requirements:

| Requirement                     | Version        | Note                                                            |
| :------------------------------ |:---------------| :-------------------------------------------------------------- |
| Visual Studio Code              | 1.89.1         | -                                                               |
| Node.js                         | 22.11.0        | -                                                               |
| JDK                             | 23             | -                                                               |
| Android Studio                  | 2024.2.1.11    | -                                                               |
| ApiClient apk                   | 2.4.7          | -                                                               |
| Appium                          | 2.19.0         | -                                                               |
| Appium Doctor                   | 1.16.2         | -                                                               |
| Appium Inspector                | 2024.12.1      | -                                                               |
| uiautomator2 driver             | 4.2.3          | -                                                               |
| Virtual device                  | Pixel 4        | -                                                               |
| Virtual device API              | 29             | -                                                               |
| faker-js/faker                  | 9.8.0          | -                                                               |
| @testing-library/webdriverio    | 3.2.1          | -                                                               |
| @wdio/allure-reporter           | 9.15.0         | -                                                               |
| @wdio/appium-service            | 9.15.0         | -                                                               |
| @wdio/cli                       | 9.15.0         | -                                                               |
| @wdio/local-runner              | 9.15.0         | -                                                               |
| @wdio/mocha-framework           | 9.15.0         | -                                                               |
| @wdio/visual-service            | 8.0.4          | -                                                               |
| wdio-wait-for                   | 3.1.0          | -                                                               |

# Installation:

- See [Visual Studio Code page](https://code.visualstudio.com/) and install the latest VSC stable version. Keep all the prefereced options as they are until you reach the possibility to check the checkboxes below: 
  - :white_check_mark: **Add "Open with code" action to Windows Explorer file context menu**; 
  - :white_check_mark: **Add "Open with code" action to Windows Explorer directory context menu**.
Check then both to add both options in context menu.
- See [Node.js page](https://nodejs.org/en) and install the aforementioned Node.js version. Keep all the preferenced options as they are.
- See [JDK Development Kit 23 downloads](https://www.oracle.com/in/java/technologies/downloads/#jdk23-windows), download the proper version for your OS and install it by keeping the preferenced options. 
- See [Anroid Studio download page](https://developer.android.com/), download the last version and install it by keeping the preferenced options. Open Virtual Device Manager and create an image as simple as possible. 
- Open your terminal in your project directory and execute ```npm init``` to initiate a project.
- Open your terminal in your project directory and execute ```npm i appium``` to install Appium.
- Open your terminal in your project directory and execute ```npm i appium-doctor``` to install Appium Doctor.
- Right click :point_right: **My Computer** and select :point_right: **Properties**. On the :point_right: **Advanced** tab, select :point_right: **Environment Variables**, and then edit JAVA_HOME to point to where the JDK software is located, for example, C:\Program Files\Java\jdk-23.
- Right click :point_right: **My Computer** and select :point_right: **Properties**. On the :point_right: **Advanced** tab, select :point_right: **Environment Variables**, and then edit ANDROID_HOME to point to where the sdk software is located, for example, C:\Users\user\AppData\Local\Android\Sdk.
- Right click :point_right: **My Computer** and select :point_right: **Properties**. On the :point_right: **Advanced** tab, select :point_right: **Environment Variables**, and then edit Path system variable with the new %JAVA_HOME%\bin and %ANDROID_HOME%\platform-tools entries.
- Open your terminal in your project directory and execute ```npm init wdio .``` to initiate a project. Configure the project as below instructions:
  - A project named "appium-and-webdriverio-expandtesting_mobile" was detected at "C:\appium-and-webdriverio-expandtesting_mobile", correct? Yes;
  - What type of testing would you like to do? E2E Testing - of Web or Mobile Applications;
  - Where is your automation backend located? On my local machine;
  - Which environment you would like to automate? Mobile - native, hybrid and mobile web apps, on Android or iOS;
  - Which mobile environment you'd like to automate? Android - native, hybrid and mobile web apps, tested on emulators and real devices;
  - Which framework do you want to use? Mocha;
  - Do you want to use Typescript to write tests? No;
  - What should be the location of your spec files? C:\appium-and-webdriverio-expandtesting_mobile\test\specs\**\*.js;
  - Do you want to use page objects? No;
  - Which reporter do you want to use? Allure;
  - Do you want to add a plugin to your test setup? Yes (wait-for, Testing Library);
  - Would you like to include Visual Testing to your setup? Yes;
  - Do you want to add a service to your test setup? Appium;
  - Do you want me to run ```npm install```? Yes;
  - Continue with Appium setup using appium-installer? Yes;
    - Select an option: Install Appium Server;
      - Choose your version: Select latest Server version;
    - Select an option: Install Appium Plugin;
      - Select Plugins to install: appium-wait-plugin, appium-gestures-plugin;
        - Source: npm;
  - Select an option: Exit;
- Open your terminal in your project directory and execute ```npx appium-doctor --android``` to run Appium Doctor and check Appium instalation status.
- Open your terminal in your project directory and execute ```npx appium driver install uiautomator2``` to install drivers for automationName and platformName capabilities.
- See [Appium Inspector download page](https://github.com/appium/appium-inspector/releases), download and install it. Configure capabilities as below and save it:
  ```
  {
    "platformName": "Android",
    "appium:platformVersion": "10.0",
    "appium:deviceName": "Pixel_4_API_29",
    "appium:automationName": "UIAutomator2",
    "appium:app": "C:\\appium-and-webdriverio-expandtesting_mobile\\apps\\apiClient.apk",
    "appium:adbExecTimeout": 120000,
    "appium:autoGrantPermissions": true,
    "appium:appActivity": "com.ab.apiclient.ui.Splash",
    "appium:appWaitActivity": "com.ab.apiclient.ui.Splash,com.ab.apiclient.*,com.ab.apiclient.ui.MainActivity",
    "appium:appWaitDuration": 20000,
    "appium:noReset": true,
    "appium:autoDismissAlerts": true,
    "appium:uiautomator2ServerInstallTimeout": 60000
  }
  ```  
- Open windows prompt as admin and execute ```npm install @faker-js/faker --save-dev``` to install Faker library.
- Open your terminal in your project directory and execute ```npx appium``` to start appium session.
- Execute Virtual Device Manager on Android Studio.
- Open Appium Inspector and start the appium session. 

# Tests:

- Execute ```npx wdio run wdio.conf.js``` to execute all tests. 
- Execute ```npx wdio run wdio.conf.js --watch``` to execute all tests and keep the browser open. 
- Execute ```npx wdio run wdio.conf.js --spec tests/specs/users.e2e.js``` to execute all tests in the users.e2e.js file. 
- Configure the desired test like ```it.only``` and execute ```npx wdio run wdio.conf.js --spec tests/specs/users.e2e.js``` to execute only the desired test in the users.e2e.js file.
- Execute the command block below to run all the tests, generate and open allure-report.
  ```
  npx wdio run wdio.conf.js
  npx allure generate allure-results 
  npx allure open allure-report
  ```

# Support:

- [expandtesting API documentation page](https://practice.expandtesting.com/notes/api/api-docs/)
- [expandtesting API demonstration page](https://www.youtube.com/watch?v=bQYvS6EEBZc)
- [Quickstart Intro](https://appium.io/docs/en/latest/quickstart/)
- [Download ApiClient : REST API Client APK](https://apiclient-rest-api-client.en.softonic.com/android/download)
- [ChatGPT](https://chatgpt.com/)
- [Error occured while starting App. Original error: com.abc.xyz.ui.SplashActivity or com.abc.xyz.dev.com.abc.xyz.ui.SplashActivity never started](https://stackoverflow.com/a/48531998)
- [Unable to install APK. Try to increase the 20000ms adb execution timeout represented by 'adbExecTimeout' capability"](https://github.com/appium/appium/issues/12287#issuecomment-1353643684)
- [Unable to resolve host "<URL here>" No address associated with host name [closed]](https://stackoverflow.com/a/31242237)
- [How to turn off Wifi via ADB?](https://stackoverflow.com/a/10038568)
- [how to handle app generated popups in appium](https://stackoverflow.com/a/54970700)
- [Getting Started](https://webdriver.io/docs/gettingstarted#run-test)
- [Original error: 'POST /elements' cannot be proxied to UiAutomator2 server because the instrumentation process is not running (probably crashed).](https://github.com/appium/appium/issues/15087#issuecomment-1211697568)

# Tips:

- UI and API tests to send password reset link to user's email and API tests to verify a password reset token and reset a user's password must be tested manually as they rely on e-mail verification. 
- Disable wifi when the apk presents connections problems.
- When downloading the artifact from github actions, unzip it and execute ```npx allure generate allure-results``` to generate allure report and then execute ```npx allure open allure-report``` to open it.

