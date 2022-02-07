export class PopOverHandler {
    version= '1.0.0'
    items= {}
    popUpDescription= document.querySelector('#popUpDescription');
    init(items, version) {
        this.version = version;
        this.items = items;

    }

    addPopupDescription(itemId, event) {
        this.popUpDescription =  document.querySelector('#popUpDescription');
        if (this.popUpDescription != null){
            this.popUpDescription.innerHTML = "";
            let item = this.items[itemId.toString()]
            let desc = `
       <div class="flex flex-col border  p-4 rounded  bg-indigo-500 relative z-30" x-cloak>
            <div class="flex flex-col ">
                <div class="flex justify-between z-30">
                    <div class="flex z-30">
                        <img alt=""
                         class="border border-1 border-black mr-2 block z-30"
                         style="max-width: 50px"
                         src="http://ddragon.leagueoflegends.com/cdn/${this.version}/img/item/${itemId}.png"/>
                        <div  class="z-30 text-base"><span class="font-bold ">${item.name}</span><br>${item.gold} gold</div>
                    </div>

                </div>
           </div>
            <div class="flex flex-col mt-2">
                <div class="font-bold">Stats :</div>`;
            for (let key in item.stats_description) {
                let stat = item.stats_description[key]
                if (key !== "Mythic") {
                    desc += `<div class="ml-2 w-full flex justify-between relative">
                              <div class="">${key}</div>
                              <div >${stat}</div>
                          </div>`
                } else {
                    desc += `<div  class="font-bold">Mythic: </div>`
                    for (let key2 in stat) {
                        desc += `<div class="ml-2 w-full flex justify-between relative">
                                 <div class="">${key2}</div>
                                 <div >${!key2.includes('Percent') ? stat[key2] : (stat[key2] * 100) + '%'}</div>
                             </div>`
                    }
                }
            }

            desc += `</div>
        </div>`
            let mainDiv = document.createElement("div");
            mainDiv.innerHTML = desc;
            this.popUpDescription.appendChild(mainDiv);


            setTimeout(() => {
                if (this.popUpDescription !=null){
                    let width = window.innerWidth
                    let height = window.innerHeight
                    let popupWidth = this.popUpDescription.clientWidth
                    let popupHeight = this.popUpDescription.clientHeight
                    let iconWidth = event.target.width
                    let iconHeight = event.target.height

                    this.popUpDescription.classList.add('hide')
                    let posX = event.clientX + iconWidth / 2
                    let posY = event.clientY - popupHeight / 2 + window.scrollY
                    if (width < posX + popupWidth) {
                        posX = event.clientX - popupWidth - iconWidth
                    }


                    if (height < event.clientY + popupHeight / 2 + 20) {
                        posY = event.clientY - popupHeight + window.scrollY
                    } else if (event.clientY - popupHeight - 20 < 0) {
                        posY = event.clientY + window.scrollY
                    }
                    this.popUpDescription.style.left = posX + 'px'
                    this.popUpDescription.style.top = posY + 'px'
                    this.popUpDescription.classList.remove('hide')
                }



            }, 25)
        }


    }
}
