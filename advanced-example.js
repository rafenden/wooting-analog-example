const ffi = require("ffi")
const ref = require('ref')

// Define the functions from the DLL
const wootingAnalog = ffi.Library('./libs/wooting-analog-sdk.dll', {
  "wooting_kbd_connected": [ 'bool', [] ],
  "wooting_set_disconnected_cb": ['void', ['pointer']],
  "wooting_read_full_buffer": [ 'int', [ref.refType('uint8'), 'int'] ],
});

// Create a callback that can be used by the FFI library
const ffiCallback = ffi.Callback('void', [], () => {
  console.log('Keyboard disconnected')
})

// Set the disconnected callback so you get a log if the keyboard disconnects while reading
wootingAnalog.wooting_set_disconnected_cb(ffiCallback)

// We use a typed array as a buffer to get the raw analog values of the keys that are pressed
// The analog values will be filled as [scan_code, analog_value, scan_code, analog_value, scan_code, analog_value, .....]
const bufferSize = 32
const analogBuffer = new Uint8Array(bufferSize)

// Log all the keys that are pressed every millisecond
setInterval(() => {
  const itemsRead = wootingAnalog.wooting_read_full_buffer(analogBuffer, bufferSize)

  let bufferInfo = `Keys pressed: ${itemsRead} `
  
  for(let i = 0; i < itemsRead; i++) {
    const key = analogBuffer[i * 2]
    const analogValue = analogBuffer[i * 2 + 1]
    
    bufferInfo += `Key: ${key} Value: ${analogValue} `
  }

  console.log(bufferInfo)
}, 1)

// Keep a reference to the callback to prevent it from getting garbage collected
process.on('exit', function() {
  ffiCallback
})
