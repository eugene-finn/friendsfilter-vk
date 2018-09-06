export default class {
    constructor(apiVK) {
        this.apiVK = apiVK;
    }

    get user() {
        return this.apiVK.callAPI('users.get', { fields: 'photo_50' }).then(response => response);
    }

    get friends() {
        return this.apiVK.callAPI('friends.get', { fields: 'first_name, last_name, photo_50' }).then(response => response);
    }

}