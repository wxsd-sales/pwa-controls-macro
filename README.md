# PWA Controls Macro

This is a simple Macro which gives you the ability to easily toggle between Persistent Web App and Controller modes on your Webex Navigator. It also lets you change the Persistent Web App URL from a list which can be configured in the Macro.

![output_RMSTUx(1)](https://user-images.githubusercontent.com/21026209/166060186-c4f0d8ca-22c4-4598-977f-78dd47ab049e.gif)


## Overview

This Webex Device macro lets you configure multiple Persistent Web (PWA) Apps URLs and switch between them from a UI Extension panel. The macro also scans your device for an Webex Room Navigators and lets you toggle them between `Controller` and `PWA` mode. This can be done from another touch device in the room or from the main OSD interface on a Webex Board or Desk series.


## Setup

### Prerequisites & Dependencies: 

- RoomOS 10.12.x or above Webex Room Device with a Webex Room Navigator Paired 
  - *The Navigator must be paired with Room Device over a LAN connection and powered via POE, not connected directly to the Room Device*
- Web admin access to the device to upload the macro.
- A separate Controller (either Touch 10 or Navigator in Controller) if your Webex Device doesn't have a touch interface so that you can toggle between PWA and Controller modes.


### Installation Steps:
1. Download the ``pwa-controls.js`` file and upload it to your Webex Room devices Macro editor via the web interface.
2. Configure the Macro by changing the initial values, there are comments explaining each one.
3. Enable the Macro on the editor.
    
## Validation

Validated Hardware:

* Room Kit Pro + Touch 10 + Room Navigator
* Desk Pro + Room Navigator

This macro should work on other Webex Devices with Webex Room Navigators but has not been validated at this time.
    
## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).


## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=pwa-controls-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
