import { HANDS } from "./hands.js";

export function cosineSimilarity(v1, v2) {
  let dot = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < v1.length; i += 1) {
    dot += v1[i] * v2[i];
    norm1 += v1[i] * v1[i];
    norm2 += v2[i] * v2[i];
  }

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

export function simToMultiplier(similarity) {
  if (similarity <= 0.1) return 0.5;
  if (similarity >= 0.7) return 3.0;

  const normalized = (similarity - 0.1) / 0.6;
  const curved = Math.pow(normalized, 1.15);
  return roundToTwo(0.5 + curved * 2.5);
}

export function getPattern(cards) {
  return cards.map((card) => card.suit);
}

export function patternToText(pattern) {
  return pattern.length ? pattern.join(" -> ") : "(empty)";
}

export function findNamedHand(cards) {
  const pattern = getPattern(cards);
  return (
    HANDS.find((hand) => {
      if (hand.pattern.length !== pattern.length) {
        return false;
      }

      return hand.pattern.every((suit, index) => suit === pattern[index]);
    }) || null
  );
}

function getFallbackHand(cards) {
  if (cards.length === 0) {
    return {
      id: "empty",
      name: "Empty",
      pattern: [],
      baseMult: 0,
      description: "Add cards to score a chain.",
      named: false,
    };
  }

  if (cards.length === 1) {
    return {
      id: "single",
      name: "Single",
      pattern: getPattern(cards),
      baseMult: 1,
      description: "A single card scores its own chips.",
      named: false,
    };
  }

  return {
    id: "loose_chain",
    name: "Loose Chain",
    pattern: getPattern(cards),
    baseMult: 1,
    description: "No named hand match yet. Semantic links still score.",
    named: false,
  };
}

export function getActiveHand(cards) {
  const namedHand = findNamedHand(cards);
  if (namedHand) {
    return { ...namedHand, named: true };
  }
  return getFallbackHand(cards);
}

export function scoreCards(cards) {
  const activeHand = getActiveHand(cards);
  const totalChips = cards.reduce((sum, card) => sum + card.chips, 0);
  const highestChipCard = cards.reduce(
    (best, card) => (best === null || card.chips > best.chips ? card : best),
    null,
  );
  const links = [];

  for (let index = 0; index < cards.length - 1; index += 1) {
    const from = cards[index];
    const to = cards[index + 1];
    const similarity = cosineSimilarity(from.vector, to.vector);
    const multiplier = simToMultiplier(similarity);
    links.push({
      from: from.id,
      to: to.id,
      similarity,
      multiplier,
    });
  }

  const linkProduct = links.reduce((product, link) => product * link.multiplier, 1);
  const countedChips = activeHand.named
    ? totalChips
    : (highestChipCard ? highestChipCard.chips : 0);
  const rawScore = countedChips * activeHand.baseMult * linkProduct;
  const finalScore = cards.length === 0 ? 0 : Math.round(rawScore);

  return {
    hand: activeHand,
    pattern: getPattern(cards),
    totalChips,
    countedChips,
    highestChipCardId: highestChipCard ? highestChipCard.id : null,
    handMultiplier: activeHand.baseMult,
    links,
    linkProduct,
    finalScore,
    rawScore,
  };
}
