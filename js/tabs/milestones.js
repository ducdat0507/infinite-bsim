tabs.milestones = {
    name: "Milestones",
    condition: () => game.unlocks["mle1"],

    data: null,


    onStart() {
        this.data = {};
        this.data.rows = [];

        let moneyRow = createRow();
        moneyRow.name.textContent = "Money";
        this.data.money = moneyRow;
        container.append(moneyRow);

        let globalDiv = document.createElement("div");
        globalDiv.style.width = "100%";
        globalDiv.style.display = globalDiv.style.flexDirection = globalDiv.style.gap = "inherit";
        moneyRow.globalDiv = globalDiv;
        moneyRow.append(globalDiv);

        moneyRow.append(extraButtons);

        this.onTick();
    },
    onTick() {
        this.data.money.amount.textContent = format(game.money);
        this.data.money.rate.textContent = "+" + format(temp.moneySpeed) + "/s";

        let globalMilestoneList = Object.keys(milestones.global);

        {
            let row = this.data.money;
            while (row.items.length < globalMilestoneList.length) {
                let button = document.createElement("button");
                button.classList.add("pushy-button", "milestone");
                button.tabIndex = -1;
                button.onclick = ev => {
                    clickGlobalMilestone(button.milestone);
                    let milestone = milestones.global[button.milestone];
                    let level = game.milestones[button.milestone];
                    button.disabled = D.lt(milestone.goalTarget(), milestone.goalAmount(level));
                    button.blur();
                }
                row.globalDiv.append(button);
                row.items.push(button);

                let goal = document.createElement("div");
                button.append(goal);
                button.goal = goal;

                let reward = document.createElement("div");
                reward.style.marginTop = "4px";
                button.append(reward);
                button.reward = reward;
            }

            for (let b = 0; b < globalMilestoneList.length; b++) {
                let button = row.items[b];
                button.milestone = globalMilestoneList[b];
                let milestone = milestones.global[globalMilestoneList[b]];
                let level = game.milestones[button.milestone] ?? 0;
                let current = milestone.goalTarget();
                let goal = milestone.goalAmount(level);
                button.disabled = D.lt(current, goal);
                button.goal.textContent = "";
                button.goal.append(
                    milestone.goalText[0],
                    document.createElement("br"),
                    format(current, milestone.goalPrecision) + " / " + format(goal, milestone.goalPrecision),
                    document.createElement("br"),
                    milestone.goalText[1],
                    document.createElement("br"),
                );
                button.reward.textContent = "";
                button.reward.append(
                    milestone.rewardText[0].replace("{0}", format(milestone.rewardAmount(level), milestone.rewardPrecision)) + 
                        " → " + milestone.rewardText[0].replace("{0}", format(milestone.rewardAmount(D.add(1, level)), milestone.rewardPrecision)),
                    document.createElement("br"),
                    milestone.rewardText[1],
                );
            }
        }

        let rowMilestoneList = Object.keys(milestones.rows);

        while (this.data.rows.length < game.ladder.length) {
            let row = createRow();
            container.append(row);
            this.data.rows.push(row);
        }
        for (let a = 0; a < game.ladder.length; a++) {
            let data = game.ladder[a];
            let row = this.data.rows[a];
            let name = D.lt(data.tier, tierNames.length) ? tierNames[D(data.tier).toNumber()] : "Reset "+D(data.tier).toNumber();
            row.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
            row.amount.textContent = format(data.amount);
            row.name.textContent = name;

            while (row.items.length < rowMilestoneList.length) {
                let button = document.createElement("button");
                button.classList.add("pushy-button", "milestone");
                button.row = data.tier;
                button.tabIndex = -1;
                button.onclick = ev => {
                    clickRowMilestone(a, button.milestone);
                    let milestone = milestones.rows[button.milestone];
                    let level = game.ladder[a].milestones?.[button.milestone];
                    button.disabled = D.lt(milestone.goalTarget(a), milestone.goalAmount(level, a));
                    button.blur();
                }
                row.append(button);
                row.items.push(button);

                let goal = document.createElement("div");
                button.append(goal);
                button.goal = goal;

                let reward = document.createElement("div");
                reward.style.marginTop = "4px";
                button.append(reward);
                button.reward = reward;
            }

            row.multi = getRowMulti(data.tier);
            row.rate.textContent = "×" + format(row.multi);

            for (let b = 0; b < rowMilestoneList.length; b++) {
                let button = row.items[b];
                button.milestone = rowMilestoneList[b];
                let milestone = milestones.rows[rowMilestoneList[b]];
                let level = game.ladder[a].milestones?.[button.milestone] ?? 0;
                let current = milestone.goalTarget(a);
                let goal = milestone.goalAmount(level, a);
                button.disabled = D.lt(current, goal);
                button.goal.textContent = "";
                button.goal.append(
                    milestone.goalText[0].replace("{0}", name),
                    document.createElement("br"),
                    format(current, milestone.goalPrecision) + " / " + format(goal, milestone.goalPrecision),
                    document.createElement("br"),
                    milestone.goalText[1].replace("{0}", name),
                    document.createElement("br"),
                );
                button.reward.textContent = "";
                button.reward.append(
                    milestone.rewardText[0].replace("{0}", format(milestone.rewardAmount(level, a), milestone.rewardPrecision)) + 
                        " → " + milestone.rewardText[0].replace("{0}", format(milestone.rewardAmount(D.add(1, level), a), milestone.rewardPrecision)),
                    document.createElement("br"),
                    milestone.rewardText[1].replace("{0}", name),
                );
            }
        }
    },
    onEnd() {
        this.data = null;
    }
}