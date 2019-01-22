$(() => {
    const remote = require('electron').remote;
    var Store = require('../comps/store.js')
    const store = new Store({
        configName: 'user-settings',
        defaults: {
            phoneSettings: {
                'ip': '',
                'user': '',
                'password': ''
            }
        }
    });

    let phoneSettings = store.get('phoneSettings')
    $('#user').val(phoneSettings.user),
    $('#password').val(phoneSettings.password),
    $('#phoneIp').val(phoneSettings.ip)

    $('#saveSettings').click(function (e) {
        console.log('Save Setting')
        e.preventDefault();
        let phoneSettings = {
            'user': $('#user').val(),
            'password': $('#password').val(),
            'ip': $('#phoneIp').val()
        }
        store.set('phoneSettings', phoneSettings)
        var window = remote.getCurrentWindow();
        window.minimize();
    });
})