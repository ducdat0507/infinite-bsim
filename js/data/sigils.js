function getSigilCost() {
    return D(50);
}

let sigilTime = Date.now();

function forgeSigil(cooldown = 200, amount = 1) {
    let cost = getSigilCost();
    let time = Date.now();
    if (D.gte(game.scraps, cost) && time - sigilTime >= cooldown) {
        let bulk = D.div(game.scraps, cost).floor().min(amount);
        game.scraps = D.sub(game.scraps, D.mul(cost, bulk));
        let rarity = Math.min(Math.floor(Math.log(1 / (1 - Math.random()))), 9);
        while (game.sigils.length <= rarity) game.sigils.push(D(0));
        game.sigils[rarity] = D.add(game.sigils[rarity], bulk);
        game.stats.sigilForged++;
        sigilTime = time;
        updateSigilEffects();
    }
}