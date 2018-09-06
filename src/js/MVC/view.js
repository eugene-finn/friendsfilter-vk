export default class {
    constructor() {
        
    }

    render(templateName, model) {
        return require(`../../template/${templateName}.hbs`)(model);
    }
}





