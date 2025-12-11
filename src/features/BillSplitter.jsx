import React, { useState } from 'react';
import ParticipantList from './ParticipantList';
import ItemInput from './ItemInput';
import ResultSummary from './ResultSummary';
import { Share2, FileText, Zap } from 'lucide-react';
import { Button } from '../components/BaseComponents';
import { calculateSplits, formatCurrency } from '../utils/calculator';
import '../index.css'; // Ensure CSS is loaded if not globally

export default function BillSplitter() {
    const [participants, setParticipants] = useState([]);
    const [items, setItems] = useState([]);

    const addParticipant = ({ name, upi }) => {
        setParticipants([...participants, { id: Date.now().toString(), name, upi }]);
    };

    const removeParticipant = (id) => {
        setParticipants(participants.filter(p => p.id !== id));
        setItems(items.map(item => ({
            ...item,
            ownerIds: item.ownerIds.filter(oid => oid !== id)
        })));
    };

    const addItem = (item) => {
        setItems([...items, { ...item, id: Date.now().toString() }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const loadDemoData = () => {
        const demoParticipants = [
            { id: 'p1', name: 'Alice', upi: 'alice@upi' },
            { id: 'p2', name: 'Bob', upi: 'bob@okicici' },
            { id: 'p3', name: 'Charlie', upi: '' }
        ];
        const demoItems = [
            { id: 'i1', title: 'Pizza Margherita', price: 450, ownerIds: ['p1', 'p2', 'p3'], taxPct: 5, tipPct: 0 },
            { id: 'i2', title: 'Garlic Bread', price: 150, ownerIds: ['p2', 'p3'], taxPct: 5, tipPct: 0 },
            { id: 'i3', title: 'Diet Coke', price: 60, ownerIds: ['p1'], taxPct: 0, tipPct: 0 }
        ];
        setParticipants(demoParticipants);
        setItems(demoItems);
    };

    const exportData = () => {
        const { grandTotal, participantSplits } = calculateSplits(items, participants);

        const date = new Date().toLocaleString();
        let textContent = `BILL SPLIT SUMMARY\n------------------\nDate: ${date}\n\n`;

        textContent += `ITEMS:\n`;
        items.forEach(item => {
            const ownerNames = item.ownerIds.map(id => participants.find(p => p.id === id)?.name).join(', ');
            textContent += `- ${item.title}: ${formatCurrency(item.price)} (Shared by: ${ownerNames})\n`;
        });

        textContent += `\n------------------\n`;
        textContent += `TOTAL BILL: ${formatCurrency(grandTotal)}\n`;
        textContent += `------------------\n\n`;

        textContent += `SPLIT BREAKDOWN:\n`;
        participants.forEach(p => {
            const share = participantSplits[p.id]?.total || 0;
            textContent += `${p.name}: ${formatCurrency(share)}\n`;
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billsplit_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bill-splitter-container">
            <header className="app-header">
                <div className="logo-area">
                    <h1>BillSplit Mini</h1>
                    <p>Split bills & Pay via UPI</p>
                </div>
                <div className="header-actions">
                    <Button variant="secondary" onClick={loadDemoData} className="btn-sm">
                        <Zap size={16} /> Demo
                    </Button>
                    <Button variant="secondary" onClick={exportData} className="btn-sm">
                        <Share2 size={16} /> Export Bill
                    </Button>
                </div>
            </header>

            <main className="main-grid">
                <div className="input-column">
                    <ParticipantList
                        participants={participants}
                        onAdd={addParticipant}
                        onRemove={removeParticipant}
                    />
                    <ItemInput
                        items={items}
                        participants={participants}
                        onAdd={addItem}
                        onRemove={removeItem}
                    />
                </div>

                <div className="result-column">
                    <ResultSummary items={items} participants={participants} />
                </div>
            </main>
        </div>
    );
}
