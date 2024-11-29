let bluetoothDevice = null;
let enteredPassword = "";
const correctPassword = "1234";

// Función para conectar al dispositivo Bluetooth
async function connectBluetooth() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }]
        });
        const server = await bluetoothDevice.gatt.connect();
        console.log('Dispositivo conectado');
        document.getElementById('statusMessage').textContent = 'Conectado al dispositivo Bluetooth';
    } catch (error) {
        console.error('Error al conectar al dispositivo Bluetooth:', error);
        alert('Error al conectar al dispositivo Bluetooth');
    }
}

// Función para registrar la tecla presionada
function pressKey(key) {
    if (enteredPassword.length < 4) {
        enteredPassword += key;
        document.getElementById('passwordField').value += "*";
    }
}

// Función para validar la contraseña
function validatePassword() {
    if (enteredPassword === correctPassword) {
        controlServo("00");
        alert("Contraseña correcta. ¡Puerta abierta!");
        enteredPassword = "";
        document.getElementById('passwordField').value = "";
    } else {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
        enteredPassword = "";
        document.getElementById('passwordField').value = "";
    }
}
function controlServo(angle) {
    if (!bluetoothDevice) {
        alert('No estás conectado al dispositivo Bluetooth');
        return;
    }

    const message = angle === '1' ? '00' : '11';
    sendBluetoothMessage(message);
    updateStatusMessage(`Moviendo el servo a ${angle === '1' ? '0°' : '240°'}`, 'green');
}

// Función para controlar el servo
function controlServo(command) {
    if (!bluetoothDevice) {
        alert('No estás conectado al HC-10');
        return;
    }
    sendBluetoothMessage(command);
    document.getElementById('statusMessage').textContent = "Servo activado";
}

// Función para enviar un mensaje Bluetooth
async function sendBluetoothMessage(message) {
    try {
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        await characteristic.writeValue(data);
        console.log('Mensaje enviado correctamente:', message);
    } catch (error) {
        console.error('Error al enviar el mensaje Bluetooth:', error);
    }
}


// Función para conectar al dispositivo Bluetooth
async function connectBluetooth() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }]
        });
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        console.log('Dispositivo conectado');
        updateStatusMessage('Conectado al dispositivo Bluetooth', 'green');
    } catch (error) {
        console.error('Error al conectar al dispositivo Bluetooth:', error);
        updateStatusMessage('Error al conectar al dispositivo Bluetooth', 'red');
    }
}


// Función para controlar el relé
function controlRelay(state) {
    if (!bluetoothDevice) {
        alert('No estás conectado al dispositivo Bluetooth');
        return;
    }

    const message = state === '99' ? '99' : '88';
    sendBluetoothMessage(message);
    updateStatusMessage(state === '99' ? 'Relé encendido' : 'Relé apagado', 'green');
}

// Función para enviar mensaje Bluetooth
async function sendBluetoothMessage(message) {
    try {
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        const encoder = new TextEncoder();
        const data = encoder.encode(message);

        console.log(`Enviando mensaje: ${message}`);
        await characteristic.writeValue(data);
        console.log('Mensaje enviado correctamente');
    } catch (error) {
        console.error('Mensaje enviado correctamente', error);
        updateStatusMessage('Mensaje enviado correctamente', 'green');
    }
}

// Función para actualizar el mensaje de estado
function updateStatusMessage(message, color) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.style.color = color;
}
