/**
 * Calculates the split for each participant based on items and their assigned consumers.
 * 
 * @param {Array} items - List of bill items { id, price, ownerIds, taxPct, tipPct }
 * @param {Array} participants - List of participants { id, name }
 * @returns {Object} result - { 
 *   participantSplits: { [id]: { total: number, items: [] } },
 *   grandTotal: number
 * }
 */
export function calculateSplits(items, participants) {
    const participantSplits = {};

    // Initialize
    participants.forEach(p => {
        participantSplits[p.id] = { total: 0, breakdown: [] };
    });

    let grandTotal = 0;

    items.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const consumers = item.ownerIds || [];

        if (consumers.length === 0) return; // Or assign to everyone? For now, skip if no owner.

        // Base cost per person
        const baseSplit = price / consumers.length;

        // Tip and Tax
        // Assuming taxPct and tipPct are percentages e.g. 5 for 5%
        const tax = baseSplit * ((item.taxPct || 0) / 100);
        const tip = baseSplit * ((item.tipPct || 0) / 100);
        const finalShare = baseSplit + tax + tip;

        consumers.forEach(consumerId => {
            if (participantSplits[consumerId]) {
                participantSplits[consumerId].total += finalShare;
                participantSplits[consumerId].breakdown.push({
                    itemId: item.id,
                    itemName: item.name,
                    amount: finalShare,
                    base: baseSplit,
                    tax,
                    tip
                });
                grandTotal += finalShare;
            }
        });
    });

    return { participantSplits, grandTotal };
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
}
