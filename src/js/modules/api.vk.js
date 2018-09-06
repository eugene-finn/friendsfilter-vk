export default class {
    constructor(apiID, perms, version = 5.73) {
        this.apiID = apiID;
        this.perms = perms;
        this.version = version;
    }

    connect() {
        if (this.inited != this.apiID) {
            VK.init({
                apiId: this.apiID
            });

            this.inited = this.apiID;
        }

        return new Promise((resolve, reject) => {
            VK.Auth.getLoginStatus(response => {
                if (response.status === 'connected') {
                    resolve();
                } else {
                    reject(new Error('Не авторизован'));
                }
            });
        });
    }

    auth() {
        return this.connect().catch(() => {
            return new Promise((resolve, reject) => {
                VK.Auth.login(response => {
                    if (response.session) {
                        resolve();
                    } else {
                        reject(new Error('Авторизация провалена'));
                    }
                })
            })
        });
    }

    callAPI(method, params) {
        return this.auth().then(() => {
            return new Promise((resolve, reject) => {
                params = params || {};
                params.v = this.version;

                VK.Api.call(method, params, response => {
                    if (response.eror) {
                        reject(new Error(response.error.msg));
                    } else {
                        resolve(response.response);
                    }
                });
            });
        });
    }

    remoke(callback) {
        VK.Auth.revokeGrants(callback);
    }
}