import React, { useMemo, useState } from 'react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CreatePaymentLinkPayload {
  name: string;
  email: string;
  phone: string;
  amount: number;
  currency: Currency;
  receiptId: string;
  callbackUrl: string;
  acceptMultiple: boolean;
  expiry?: {
    date: string; // yyyy-mm-dd
    hour: string; // 00-23
    minute: string; // 00-59
  } | null;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  } | null;
}

interface CreatePaymentLinkModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePaymentLinkPayload) => void;
}

const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const CreatePaymentLinkModal: React.FC<CreatePaymentLinkModalProps> = ({ open, onClose, onCreate }) => {
  const [acceptMultiple, setAcceptMultiple] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [receiptId, setReceiptId] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [showExpiry, setShowExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryHour, setExpiryHour] = useState('00');
  const [expiryMinute, setExpiryMinute] = useState('00');
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', country: '' });

  const isValid = useMemo(() => {
    if (!name || !email || !phone || amount === '' || Number(amount) <= 0 || !receiptId) return false;
    if (showExpiry && !expiryDate) return false;
    return true;
  }, [name, email, phone, amount, receiptId, showExpiry, expiryDate]);

  const reset = () => {
    setAcceptMultiple(false);
    setName('');
    setEmail('');
    setPhone('');
    setAmount('');
    setCurrency('INR');
    setReceiptId('');
    setCallbackUrl('');
    setShowExpiry(false);
    setExpiryDate('');
    setExpiryHour('00');
    setExpiryMinute('00');
    setShowAddress(false);
    setAddress({ line1: '', line2: '', city: '', state: '', pincode: '', country: '' });
  };

  const handleCreate = () => {
    if (!isValid) return;
    onCreate({
      name,
      email,
      phone,
      amount: Number(amount),
      currency,
      receiptId,
      callbackUrl,
      acceptMultiple,
      expiry: showExpiry
        ? { date: expiryDate, hour: expiryHour, minute: expiryMinute }
        : null,
      address: showAddress ? { ...address } : null,
    });
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 bg-[#0c2c5c] text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Create a payment link</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">Fill in the details to generate a payment link</p>

            <div className="mb-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={acceptMultiple} onChange={(e) => setAcceptMultiple(e.target.checked)} />
                Accept Multiple Payments
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter customer's name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <p className="text-xs text-gray-500 mt-1">Name is required.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Email <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter customer's email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter customer's phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Receipt ID <span className="text-red-500">*</span></label>
                <input value={receiptId} onChange={(e) => setReceiptId(e.target.value)} placeholder="Enter a unique receipt ID" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-3 gap-2 md:col-span-1">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
                  <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0.00" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 invisible">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Callback URL</label>
                <input value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="mt-6">
              {showExpiry ? (
                <button type="button" className="text-sm text-gray-700 inline-flex items-center gap-1" onClick={() => setShowExpiry(false)}>
                  Remove expiry details <span className="text-gray-500">•</span>
                </button>
              ) : (
                <button type="button" className="text-sm text-blue-600" onClick={() => setShowExpiry(true)}>Add expiry details</button>
              )}

              {showExpiry && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date <span className="text-red-500">*</span></label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hour <span className="text-red-500">*</span></label>
                    <select value={expiryHour} onChange={(e) => setExpiryHour(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      {hourOptions.map(h => (<option key={h} value={h}>{h}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minute <span className="text-red-500">*</span></label>
                    <select value={expiryMinute} onChange={(e) => setExpiryMinute(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      {minuteOptions.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {showAddress ? (
                <button type="button" className="text-sm text-gray-700 inline-flex items-center gap-1" onClick={() => setShowAddress(false)}>
                  Remove address fields <span className="text-gray-500">•</span>
                </button>
              ) : (
                <button type="button" className="text-sm text-blue-600" onClick={() => setShowAddress(true)}>Add address fields</button>
              )}

              {showAddress && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address line 1</label>
                      <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address line 2</label>
                      <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pin code</label>
                      <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex items-center justify-end gap-3">
            <button onClick={() => { reset(); onClose(); }} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
            <button disabled={!isValid} onClick={handleCreate} className={`px-4 py-2 rounded-md text-white ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}>Create Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentLinkModal;


