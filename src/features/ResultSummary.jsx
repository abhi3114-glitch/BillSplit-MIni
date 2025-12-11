import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { calculateSplits, formatCurrency } from '../utils/calculator';
import { Wallet } from 'lucide-react';

export default function ResultSummary({ items, participants }) {
    const [payeeId, setPayeeId] = useState('');
    const [qrCodes, setQrCodes] = useState({});
    const { participantSplits, grandTotal } = useMemo(() => calculateSplits(items, participants), [items, participants]);

    // Ensure payeeId is valid and defaults correctly
    useEffect(() => {
        // Check if current payeeId is still in the friends list
        const isValidPayee = participants.some(p => p.id === payeeId);

        // If invalid or empty, reset to someone with UPI or just the first person
        if (!payeeId || !isValidPayee) {
            if (participants.length > 0) {
                const withUpi = participants.find(p => p.upi);
                setPayeeId(withUpi ? withUpi.id : participants[0].id);
            } else {
                setPayeeId('');
            }
        }
    }, [participants, payeeId]);

    const payee = participants.find(p => p.id === payeeId);

    useEffect(() => {
        const generateQRs = async () => {
            if (!payee || !payee.upi) {
                setQrCodes({});
                return;
            }

            const newQrs = {};
            for (const p of participants) {
                if (p.id === payeeId) continue; // Payee doesn't pay themselves

                const amount = participantSplits[p.id]?.total || 0;
                if (amount <= 0.01) continue; // Ignore negligible amounts

                // UPI String: upi://pay?pa=ADDRESS&pn=NAME&am=AMOUNT&cu=INR
                // &tn=Note (optional)
                const note = `BillSplit Share`;
                const upiString = `upi://pay?pa=${payee.upi}&pn=${encodeURIComponent(payee.name)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

                try {
                    const url = await QRCode.toDataURL(upiString, { margin: 1, width: 200, color: { dark: '#000000', light: '#ffffff' } });
                    newQrs[p.id] = url;
                } catch (err) {
                    console.error('QR Gen Error:', err);
                }
            }
            setQrCodes(newQrs);
        };

        generateQRs();
    }, [participants, participantSplits, payeeId, payee]);

    if (items.length === 0) return null;

    return (
        <div className="card-section result-section">
            <h2 className="section-title">
                <Wallet size={20} /> Bill Summary
            </h2>

            <div className="grand-total">
                <span>Total Bill</span>
                <span className="amount">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="payee-selector">
                <label className="input-label">Who paid the bill?</label>
                <select
                    value={payeeId}
                    onChange={(e) => setPayeeId(e.target.value)}
                    className="select-input"
                >
                    {participants.map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.upi ? '(Has UPI)' : ''}</option>
                    ))}
                </select>
                {!payee?.upi && (
                    <p className="warning-text">Select a payee with a UPI ID to generate QR codes.</p>
                )}
            </div>

            <div className="splits-grid">
                {participants.map(p => {
                    const share = participantSplits[p.id]?.total || 0;
                    const isPayee = p.id === payeeId;

                    if (share < 0.01 && !isPayee) return null;

                    return (
                        <div key={p.id} className="split-card">
                            <div className="split-header">
                                <span className="p-name">{p.name}</span>
                                <span className="p-amount">{isPayee ? 'Paid Full Bill' : formatCurrency(share)}</span>
                            </div>

                            {!isPayee && (
                                <div className="owe-details">
                                    <p className="subtext">Owes {payee?.name}</p>
                                    {qrCodes[p.id] ? (
                                        <div className="qr-container">
                                            <img src={qrCodes[p.id]} alt={`Pay ${formatCurrency(share)}`} />
                                            <p className="qr-hint">Scan to pay</p>
                                        </div>
                                    ) : (
                                        <p className="no-qr">Add UPI ID to {payee?.name} to see QR.</p>
                                    )}
                                </div>
                            )}

                            {isPayee && (
                                <div className="payee-details">
                                    <p className="subtext">Collects {formatCurrency(grandTotal - share)}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
