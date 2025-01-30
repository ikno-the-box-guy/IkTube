const saveOptions = () => {
    const apiAddress = document.getElementById('api-input').value;

    chrome.storage.sync.set(
        { apiAddress: apiAddress },
        () => {}
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { apiAddress: '' },
        (items) => {
            document.getElementById('api-input').value = items.apiAddress;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('api-input').addEventListener('input', saveOptions);