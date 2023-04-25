/********************************************************
 * 
 * Author:    William Mills
 *            Technical Solutions Specialist 
 *            wimills@cisco.com
 *            Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 07/27/22
 * 
 * This Webex Device Macro lets you easily switch between pre-configured 
 * Persistent Web App URLs and also lets you toggle any paired Webex
 * Room Navigator between Controller or PWA mode.
 * 
 * Full Readme and source code available on Github:
 * https://github.com/wxsd-sales/pwa-controls-macro
 * 
 ********************************************************/

import xapi from 'xapi';

/*********************************************************
 * Configure the settings below
**********************************************************/


const config = {
  button: {
    name: 'PWA Controls',
    icon: 'Sliders',
    panelId: 'pwa-controls'
  },
  naviatorLocation: 'InsideRoom',
  urls: [
    { text: 'Cisco.com', url: 'https://www.cisco.com/' },
    { text: 'Presence on device', url: 'https://wxsd-sales.github.io/presence-on-device/' },
    { text: 'Example.com', url: 'https://www.example.com' }
  ]
}


/*********************************************************
 * Do not change below
**********************************************************/

// Create our Button & Panel list and sync the UI
createPanel();


// Subscribe to events, status and config changes
xapi.Event.UserInterface.Extensions.Widget.Action.on(widgetEvent);
xapi.Config.UserInterface.HomeScreen.Peripherals.WebApp.URL.on(syncUI);
xapi.Status.Peripherals.ConnectedDevice.on(peripheralsChange);

/*********************************************************
 * Functions for Macros operation
**********************************************************/


function setPWAURL(option) {
  console.log('Setting PWA URL to: ' + config.urls[option].url);
  xapi.Config.UserInterface.HomeScreen.Peripherals.WebApp.URL.set(config.urls[option].url);
}


function peripheralsChange(event) {
  console.log(event)
  if (!event.hasOwnProperty('Type')) return;
  console.log('Peripherals type changed, updating UI')
  createPanel();
}


// Enables or disables a specific navigator for PWA or Controller
function setDeviceMode(navigator, on) {

  const mode = on ? 'PersistentWebApp' : 'Controller';
  const message = `Setting ${navigator} to ${mode} mode`;
  alertUser(`${message}, this will take 20 seconds`);

  xapi.Command.Peripherals.TouchPanel.Configure({
    ID: navigator,
    Location: config.naviatorLocation,
    Mode: mode
  });
}


// Alerts user of a PWA/Controller change
function alertUser(message) {
  console.log('Alert: ' + message);
  xapi.Command.UserInterface.Message.Alert.Display({
    Duration: 20,
    Title: config.button.name,
    Text: message
  });
}

// Updates the UI with the current states
async function syncUI() {
  console.log('Syncing UI')

  const currentURL = await xapi.Config.UserInterface.HomeScreen.Peripherals.WebApp.URL.get();
  const navigators = await listNavigators();

  // Update the Site select panel
  config.urls.forEach((site, i) => {
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: `${config.button.panelId}-site-${i}`,
      Value: site.url.startsWith(currentURL) ? 'on' : 'off'
    })
  })

  // Update the navigator select list panel
  navigators.forEach(navigator => {
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: navigator.ID,
      Value: (navigator.Type == 'PersistentWebApp') ? 'on' : 'off',
    });
  })
}

// Handles user input events for widgets
async function widgetEvent(event) {
  const navigators = await listNavigators();
  if (event.WidgetId.startsWith(config.button.panelId + '-site')) {
    const selected = event.WidgetId.split('-').pop();
    setPWAURL(selected)
  }
  if (navigators.find(navigator => navigator.ID == event.WidgetId)) {
    setDeviceMode(event.WidgetId, event.Value === 'on')
  }
}

// This function will return a list of all Navigators attached to the system
async function listNavigators() {
  const devices = await xapi.Status.Peripherals.ConnectedDevice.get();
  return devices.filter(device => device.Name.endsWith('Room Navigator'));
}


/*********************************************************
 * UI Panel Section
**********************************************************/

async function createPanel() {

  let sites = '';
  config.urls.forEach((site, i) => {
    const row = `
      <Row>
        <Name>${site.text}</Name>
        <Options>size=1</Options>
        <Widget>
          <WidgetId>${config.button.panelId}-site-${i}</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>`;
    sites = sites.concat(row);
  })

  let devices = '';
  const navigators = await listNavigators();
  navigators.forEach(device => {
    const row = `
      <Row>
        <Name>${device.ID}</Name>
        <Options>size=4</Options>
        <Widget>
          <WidgetId>${device.ID}</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>`;
    devices = devices.concat(row);
  });

  const panel = `
  <Extensions>
    <Panel>
      <Type>Statusbar</Type>
      <Location>HomeScreen</Location>
      <Icon>${config.button.icon}</Icon>
      <Color>#CF7900</Color>
      <Name>${config.button.name}</Name>
      <ActivityType>Custom</ActivityType>
      <Page>
        <Name>Site Select</Name>
        ${sites}
        <Options/>
      </Page>
      <Page>
        <Name>Navigator Select</Name>
        <Row>
          <Name>Navigators mac</Name>
          <Widget>
            <WidgetId>${config.button.panelId}-status-text</WidgetId>
            <Name>Controller / PWA</Name>
            <Type>Text</Type>
            <Options>size=2;fontSize=normal;align=right</Options>
          </Widget>
        </Row>
        ${devices}
        <Options/>
      </Page>
    </Panel>
  </Extensions>`;

  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: config.button.panelId },
    panel
  )
    .then(result => syncUI())
}
