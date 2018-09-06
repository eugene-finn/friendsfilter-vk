import '../scss/main.scss';

import ApiVK from './modules/api.vk';
import Controller from './MVC/controller';
import config from './config.json';

const apiVK = new ApiVK(config.vk.apiID, config.vk.perms, config.vk.version);
const controller = new Controller(apiVK);



