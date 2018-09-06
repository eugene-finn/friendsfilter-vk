
export default class {
    constructor() {
        this.leftlist = document.querySelector('#friends__list_0');
        this.rightlist = document.querySelector('#friends__list_1');

        this.makeDnD([this.leftlist, this.rightlist]);
        // console.log(this.leftlist, 'this.leftlist');
        // console.log(this.rightlist, 'this.rightlist');

    }

    makeDnD(zones) {
        console.log(zones);
        let currentDrag;

        zones.forEach(zone => {
            zone.addEventListener('dragstart', (e) => {
                currentDrag = { leftlist: zone, node: e.target };
                console.log(currentDrag);

            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                console.log(zone);
            });

            zone.addEventListener('drop', (e) => {
                if (currentDrag) {
                    e.preventDefault();

                    if (currentDrag.leftlist !== zone) {
                        if (e.target.classList.contains('friends__item')) {
                            zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                        } else {
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                        }
                    }
                    currentDrag = null;
                }
            });
        })
    }

}