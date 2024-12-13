export interface CurrentScore {
    battlesRun: number;
    totalBattles: number;
    scores: GroupScore[];
}

export interface GroupScore {
    group: string;
    score: number;
}

export function getTopGroups(currentScore: CurrentScore, amountOfGroups = 20) {
    const scores = currentScore.scores;
    return scores
        .toSorted((a, b) => a.score - b.score)
        .reverse()
        .slice(0, amountOfGroups);
}


export function convertScoresToData(scores: GroupScore[]): (string | number)[][] {
    const data = [];
    for (const score of scores) {
        data.push([score.group, score.score]);
    }

    return data;
}