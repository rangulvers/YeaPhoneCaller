$(() => {
    const remote = require('electron').remote;
    const {clipboard,ipcRenderer} = require('electron')
    let numberToDial = clipboard.readText()
    $('#numberToDial').val(numberToDial)

    $('#startCall').click(function (e) {
        e.preventDefault();
        ipcRenderer.send('makecall-action',  $('#numberToDial').val());
        var window = remote.getCurrentWindow();
        window.minimize();
    });


    $('#closeScreen').click(function (e) {
        e.preventDefault();
        var window = remote.getCurrentWindow();
        window.minimize();
    });
})