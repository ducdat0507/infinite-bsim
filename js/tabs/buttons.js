tabs.buttons = {
    name: "Buttons",
    condition: () => game.unlocks["rne1"],

    data: null,

    onStart() {
        this.data = {};
        this.data.rows = [];

        let moneyRow = createRow();
        moneyRow.name.textContent = "Money";
        this.data.money = moneyRow;
        container.append(moneyRow);
        this.data.money.append(extraButtons);

        updateVisibleUnlocks();
        this.onTick();
    },
    onTick() {
        this.data.money.amount.textContent = format(game.money);
        this.data.money.rate.textContent = "+" + format(temp.moneySpeed) + "/s";

        while (this.data.money.items.length < visibleUnlocks.length) {
            let button = document.createElement("button");
            button.classList.add("pushy-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                performUnlock(button.target);
                if (game.unlocks[button.target]) {
                    button.remove();
                    this.data.money.items.splice(this.data.money.items.indexOf(button), 1);
                    updateVisibleUnlocks();
                } else {
                    button.blur();
                }
            }
            this.data.money.append(button);
            this.data.money.items.push(button);

            let gain = document.createElement("div");
            button.append(gain);
            button.gain = gain;

            let cost = document.createElement("div");
            button.append(cost);
            button.cost = cost;
            
            this.data.money.append(extraButtons);
        }
        for (let a = 0; a < visibleUnlocks.length; a++) {
            let button = this.data.money.items[a];
            let target = visibleUnlocks[a];
            let data = unlocks[target];
            button.target = target;
            button.gain.textContent = data.desc();
            button.cost.textContent = data.conDisplay();
            button.disabled = !data.condition();
        }


        while (this.data.rows.length < game.ladder.length) {
            let row = createRow();
            container.append(row);
            this.data.rows.push(row);
        }
        let prevName = "Money";
        for (let a = 0; a < game.ladder.length; a++) {
            let data = game.ladder[a];
            let row = this.data.rows[a];
            let name = D.lt(data.tier, tierNames.length) ? tierNames[D(data.tier).toNumber()] : "Reset "+D(data.tier).toNumber();
            row.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
            row.amount.textContent = format(data.amount);
            row.name.textContent = name;

            while (row.items.length < 8) {
                let button = document.createElement("button");
                button.classList.add("pushy-button");
                button.row = data.tier;
                button.tabIndex = -1;
                button.onclick = ev => {
                    clickButton(button.row, button.tier);
                    let cost = getButtonCost(data.tier, button.tier);
                    button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
                    button.blur();
                }
                row.append(button);
                row.items.push(button);

                let gain = document.createElement("div");
                button.append(gain);
                button.gain = gain;

                let cost = document.createElement("div");
                button.append(cost);
                button.cost = cost;
            }

            if (game.unlocks.btn5) data.level = getHighestButton(data.tier, a == 0 ? game.money : game.ladder[a - 1].amount).max(data.level);
            let offset = D.sub(data.level, 6).max(0);
            let multi = getRowMulti(data.tier);
            let needsUpdate = allDirty || D.neq(multi, row.multi) || D.neq(row.items[0]?.tier ?? -1, offset);
            row.multi = multi;
            row.rate.textContent = "×" + format(row.multi);

            for (let b = 0; b < 8; b++) {
                let button = row.items[b];
                button.tier = D.add(offset, b);
                let cost = getButtonCost(data.tier, button.tier);
				if (needsUpdate) {
                    button.gain.textContent = "+" + format(getButtonGain(data.tier, button.tier).mul(row.multi)) + " " + name;
                    button.cost.textContent = (a == 0 ? "−" : "≥") + format(cost) + " " + prevName;
                    if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
                }
                button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
            }

            prevName = name;
        }
    },
    onEnd() {
        this.data = null;
    }
}