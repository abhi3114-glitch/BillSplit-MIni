import React, { useState } from 'react';
import { Button, Input } from '../components/BaseComponents';
import { Plus, Trash2, User } from 'lucide-react';

export default function ParticipantList({ participants, onAdd, onRemove }) {
    const [name, setName] = useState('');
    const [upi, setUpi] = useState('');
    const [error, setError] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        setError('');
        onAdd({ name: name.trim(), upi: upi.trim() });
        setName('');
        setUpi('');
    };

    return (
        <div className="card-section">
            <h2 className="section-title">
                <User size={20} /> Participants
            </h2>

            <div className="participant-list">
                {participants.map(p => (
                    <div key={p.id} className="participant-item">
                        <div className="participant-info">
                            <span className="p-name">{p.name}</span>
                            {p.upi && <span className="p-upi">{p.upi}</span>}
                        </div>
                        <button className="icon-btn-danger" onClick={() => onRemove(p.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {participants.length === 0 && <p className="empty-msg">No friends added yet.</p>}
            </div>

            <form onSubmit={handleAdd} className="add-participant-form">
                <div className="form-row">
                    <Input
                        placeholder="Name (e.g. Alice)"
                        value={name}
                        onChange={e => { setName(e.target.value); setError(''); }}
                        containerClassName="flex-1"
                        error={error}
                    />
                    <Input
                        placeholder="UPI ID (optional)"
                        value={upi}
                        onChange={e => setUpi(e.target.value)}
                        containerClassName="flex-1"
                    />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                    <Plus size={18} /> Add Friend
                </Button>
            </form>
        </div>
    );
}
