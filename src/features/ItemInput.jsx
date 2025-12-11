import React, { useState } from 'react';
import { Button, Input } from '../components/BaseComponents';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function ItemInput({ items, participants, onAdd, onRemove }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [selectedOwners, setSelectedOwners] = useState([]);
    const [error, setError] = useState('');

    const toggleOwner = (id) => {
        if (selectedOwners.includes(id)) {
            setSelectedOwners(selectedOwners.filter(oid => oid !== id));
        } else {
            setSelectedOwners([...selectedOwners, id]);
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Item name is required');
            return;
        }
        if (!price || parseFloat(price) <= 0) {
            setError('Valid price is required');
            return;
        }

        setError('');
        // If no owners selected, default to all implies "Split Equally".
        const owners = selectedOwners.length > 0 ? selectedOwners : participants.map(p => p.id);

        // Safety check if no participants exist yet
        if (owners.length === 0) {
            setError('Add at least one friend first');
            return;
        }

        onAdd({
            title,
            price: parseFloat(price),
            ownerIds: owners
        });

        setTitle('');
        setPrice('');
        setSelectedOwners([]);
    };

    return (
        <div className="card-section">
            <h2 className="section-title">
                <ShoppingBag size={20} /> Items
            </h2>

            <div className="items-list">
                {items.map(item => (
                    <div key={item.id} className="item-row">
                        <div className="item-main">
                            <span className="item-title">{item.title}</span>
                            <span className="item-price">₹{item.price.toFixed(2)}</span>
                        </div>
                        <div className="item-meta">
                            <span className="item-owners">
                                Shared by: {item.ownerIds.length === participants.length ? 'Everyone' :
                                    item.ownerIds.map(oid => participants.find(p => p.id === oid)?.name).join(', ')
                                }
                            </span>
                        </div>
                        <button className="icon-btn-danger" onClick={() => onRemove(item.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {items.length === 0 && <p className="empty-msg">No items added yet.</p>}
            </div>

            <form onSubmit={handleAdd} className="add-item-form">
                <div className="form-row">
                    <Input
                        placeholder="Item (e.g. Pizza)"
                        value={title}
                        onChange={e => { setTitle(e.target.value); setError(''); }}
                        containerClassName="flex-2"
                    />
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="₹0.00"
                        value={price}
                        onChange={e => { setPrice(e.target.value); setError(''); }}
                        containerClassName="flex-1"
                    />
                </div>
                {error && <p className="input-error-msg" style={{ marginBottom: '0.5rem' }}>{error}</p>}

                {participants.length > 0 && (
                    <div className="owner-selector">
                        <p className="label-sm" style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Assign to:</p>
                        <div className="chips">
                            <button
                                type="button"
                                className={`chip ${selectedOwners.length === 0 ? 'active' : ''}`}
                                onClick={() => setSelectedOwners([])}
                            >
                                Everyone
                            </button>
                            {participants.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    className={`chip ${selectedOwners.includes(p.id) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (selectedOwners.length === 0) {
                                            setSelectedOwners([p.id]);
                                        } else {
                                            toggleOwner(p.id);
                                        }
                                    }}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <Button type="submit" variant="secondary" className="w-full mt-2">
                    <Plus size={18} /> Add Item
                </Button>
            </form>
        </div>
    );
}
