const ffi = require("ffi")

// Define the functions from the DLL
const wootingAnalog = ffi.Library('./libs/wooting-analog-sdk.dll', {
  "wooting_kbd_connected": [ 'bool', [] ],
  "wooting_read_analog": [ 'uint8', ['uint8', 'uint8'] ]
});

const keyboardConnected = wootingAnalog.wooting_kbd_connected()

if(!keyboardConnected) {
  console.log('Keyboard not connected')
} else {
  // Every millisecond, read the W-key with index 2:2
  setInterval(() => {
    const row = 2
    const column = 2
    const analogValue = wootingAnalog.wooting_read_analog(row, column)

    console.log(`Analog value: ${analogValue}`)
  }, 1)
}
