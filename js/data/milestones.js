let milestones = {
    global: {
        presses: {
            goalTarget: (row) => game.stats.presses,
            goalAmount: (x) => D.add(x, 1).pow(2).mul(10000),
            goalText: ["Make", "manual button presses for"],
            goalPrecision: 0,
            rewardAmount: (x, row) => D.pow(milestones.global.meta.rewardAmount(game.milestones.meta ?? 0), x),
            rewardText: ["×{0}", "all Money gains"],
            rewardPrecision: 0,
        },
        playtime: {
            goalTarget: (row) => game.stats.timePlayed / 3600,
            goalAmount: (x) => D.pow(x, 2).add(x).add(1),
            goalText: ["Reach", "hours of playtime for"],
            goalPrecision: 2,
            rewardAmount: (x, row) => D.pow(milestones.global.meta.rewardAmount(game.milestones.meta ?? 0), x),
            rewardText: ["×{0}", "all Money gains"],
            rewardPrecision: 0,
        },
        meta: {
            goalTarget: (row) => temp.totalMilestones,
            goalAmount: (x) => D.add(x, 1).mul(D.add(x, 15)),
            goalText: ["Complete", "milestones for"],
            goalPrecision: 0,
            rewardAmount: (x, row) => D.mul(D.pow(2,(D(game.milestones.collapse||0)).sub(1)), x).add(2),
            rewardText: ["×{0}", "all above milestones' effect"],
            rewardPrecision: 1,
        },
        collapse: {
            goalTarget: (row) => game.collapsed,
            goalAmount: (x) => D.add(x, 1),
            goalText: ["Collapse", "layers for"],
            goalPrecision: 0,
            rewardAmount: (x, row) => D.pow(2, x),
            rewardText: ["×{0}", "above milestones' effect(Resets previous milestone)"],
            rewardPrecision: 0,
        },
    },
    rows: {
        presses: {
            goalTarget: (row) => game.ladder[row].presses,
            goalAmount: (x, row) => D.pow(x, 2).add(x).div(2).add(1).mul([2500, 100, 10, 5, 3][D(game.ladder[row].tier).toNumber()] ?? D.mul(game.ladder[row].tier, 2).sub(5)),
            goalText: ["Press {0} buttons", "times for"],
            goalPrecision: 0,
            rewardAmount: (x, row) => D.pow(milestones.rows.level.rewardAmount(game.ladder[row].milestones?.level ?? 0), x),
            rewardText: ["×{0}", "all {0} gains"],
            rewardPrecision: 0,
        },
        level: {
            goalTarget: (row) => D.add(game.ladder[row].level, 1.00000001),
            goalAmount: (x, row) => D.add(x, 1).mul(10),
            goalText: ["Reach level", "{0} button for"],
            goalPrecision: 0,
            rewardAmount: (x) => D.mul(0.5, x).add(2),
            rewardText: ["×{0}", "above milestone's effect"],
            rewardPrecision: 1,
        },
    },
}

function clickGlobalMilestone(id) {
    let data = milestones.global[id];
    let level = game.milestones[id] ?? 0;
    if (D.gte(data.goalTarget(), data.goalAmount(level))) {
        game.milestones[id] = D.add(level, 1);
        if(id=="collapse")delete game.milestones.meta;
		updateMilestoneStats();
    }
}

function clickRowMilestone(row, id) {
    let data = milestones.rows[id];
    let level = game.ladder[row].milestones?.[id] ?? 0;
    if (D.gte(data.goalTarget(row), data.goalAmount(level, row))) {
        if (!game.ladder[row].milestones) game.ladder[row].milestones = {};
        game.ladder[row].milestones[id] = D.add(level, 1);
        updateMilestoneStats();
    }
}