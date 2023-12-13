tabs.sigils = {
    name: "Sigils",
    condition: () => game.unlocks["sig1"],

    data: null,

    onStart() {
        this.data = {};
        this.data.rows = [];

        let scrapRow = createRow();
        scrapRow.name.textContent = "Glyphs";
        this.data.scrap = scrapRow;
        container.append(scrapRow);

        {
            let forgeBtn = document.createElement("button");
            forgeBtn.classList.add("pushy-button", "milestone");
            forgeBtn.onclick = () => {
                forgeSigil();
                forgeBtn.disabled = D.lt(game.scraps, getSigilCost());
                forgeBtn.blur();
            }
            this.data.forge = forgeBtn;
            scrapRow.append(forgeBtn);

            let gain = document.createElement("b");
            gain.textContent = "Forge a sigil"
            forgeBtn.append(gain);
            forgeBtn.gain = gain;

            let cost = document.createElement("div");
            cost.style.marginTop = "4px";
            forgeBtn.append(cost);
            forgeBtn.cost = cost;
        }

        scrapRow.append(extraButtons);

        let spRow = createRow();
        spRow.classList.add("rune-details");
        spRow.name.textContent = "Sigil Points";
        this.data.sp = spRow;
        container.append(spRow);

        let detailsRow = createRow();
        detailsRow.classList.add("rune-details");
        detailsRow.amount.textContent = "Total sigil effects";
        this.data.details = detailsRow;
        container.append(detailsRow);

        let detailsInfo = document.createElement("div");
        detailsInfo.classList.add("desc-info");
        detailsRow.descInfo = detailsInfo;
        detailsRow.append(detailsInfo);

        this.onTick();
    },
    onTick() {
        this.data.scrap.amount.textContent = format(game.scraps);
        this.data.sp.amount.textContent = format(temp.sigilPoints);

        let sigilCost = getSigilCost();
        this.data.forge.disabled = D.lt(game.scraps, sigilCost);
        this.data.forge.cost.textContent = "−" + format(sigilCost) + " Glyphs";
        
        while (this.data.sp.items.length < game.sigils.length) {
            let ctn = document.createElement("div");
            ctn.classList.add("sigil-entry");
            this.data.sp.append(ctn);
            this.data.sp.items.push(ctn);

            let name = document.createElement("div");
            ctn.append(name);
            ctn.name = name;

            let amount = document.createElement("div");
            ctn.append(amount);
            ctn.amount = amount;
        }

        for (let b = 0; b < game.sigils.length; b++) {
            let ctn = this.data.sp.items[b];
            ctn.name.textContent = rarityNames[b] + " Sigil";
            ctn.amount.textContent = "×" + format(game.sigils[b]);
        }
        
        while (this.data.details.items.length < game.sigils.length) {
            let ctn = document.createElement("li");
            this.data.details.descInfo.append(ctn);
            this.data.details.items.push(ctn);

        }

        for (let b = 0; b < game.sigils.length; b++) {
            let ctn = this.data.details.items[b];
            let tier = game.ladder[b].tier;
            let name = D.lt(tier, tierNames.length) ? tierNames[D(tier).toNumber()] : "Reset "+D(tier).toNumber();
            ctn.textContent = "×" + format(temp.sigilEffects[b], 2) + " all " + name + " gains";
			if(b == 0 && game.unlocks.col1)ctn.textContent = "×" + format(temp.sigilEffects[b], 2) + " all " + name + "/Collapsed Layer gains";
        }
    },
    onEnd() {
        this.data = null;
    }
}