let game = null;

function getStartGame() {
    return {
        money: D(10),
        ladder: [],
        unlocks: {},

        gems: D(0),
        gemGens: D(0),
        gemUpgs: D(0),
        runes: [],
        runeEquip: [],
        scraps: D(0),

        milestones: {},

        tokens: D(0),
        tokenUpg: {},

        charge: D(0),
        charges: [],
        nextCharge: 1,
        chargerUpg: {},
        autoActive: true,
        automators: {},

        sigils: [],

        collapsed: D(0),
		
        options: {
            tickRate: 10,

            forceSci: false,
            pixelText: true,

            autoSave: true,
        },

        stats: {
            timePlayed: 0,
            presses: 0,
            runeBought: 0,
            chargerDist: 0,
            chargeClick: 0,
            sigilForged: 0,
        },

        currentTab: "buttons",
    }
}

function load() {
    try {
        game = JSON.parse(decodeURIComponent(atob(localStorage.getItem("ibsim"))));
        game = deepCopy(game, getStartGame())
    } catch {
        game = getStartGame();
    }
}

function save() {
    localStorage.setItem("ibsim", btoa(encodeURIComponent(JSON.stringify(game))));
}

function exportToClipboard() {
    navigator.clipboard.writeText(btoa(encodeURIComponent(JSON.stringify(game))));
}

function hardReset(wipeOptions = false) {
    exportToClipboard();
    if (wipeOptions) localStorage.removeItem("ibsim");
    else localStorage.setItem("ibsim", btoa(encodeURIComponent(JSON.stringify({options: game.options}))));
    game.options.autoSave = false;
    document.location.reload();
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (source[item] instanceof OmegaNum) target[item] = new OmegaNum(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}