import React, { useState } from 'react';
import { SpinResult } from './types';
import symbolImages from './symbols';

const paytable = [
    { symbol: 'sym1', three: 1, four: 2, five: 3 },
    { symbol: 'sym2', three: 1, four: 2, five: 3 },
    { symbol: 'sym3', three: 1, four: 2, five: 5 },
    { symbol: 'sym4', three: 2, four: 5, five: 10 },
    { symbol: 'sym5', three: 5, four: 10, five: 15 },
    { symbol: 'sym6', three: 5, four: 10, five: 15 },
    { symbol: 'sym7', three: 5, four: 10, five: 20 },
    { symbol: 'sym8', three: 10, four: 20, five: 50 },
];

const SlotMachine: React.FC = () => {
    const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [showPaytable, setShowPaytable] = useState<boolean>(false);

    const handleSpin = async () => {
        setIsSpinning(true);

        try {
            const response = await fetch('https://localhost:7185/api/Slot/Run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.status);
            }
            const data: SpinResult = await response.json();
            setSpinResult(data);
        } catch (error) {
            console.error('Error fetching spin result:', error);
        } finally {
            setIsSpinning(false);
        }
    };

    const renderSymbol = (symbol: string) => {
        const imageSrc = symbolImages[symbol];
        return imageSrc ? <img src={imageSrc} alt={symbol} className="w-[24px] h-[24px] m-auto" /> : <div>{symbol}</div>;
    };

    const totalWinnings = spinResult?.wins.reduce((total, win) => total + win.payout, 0) || 0;
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-8">Slot Machine</h1>

            <div className="grid grid-cols-5 gap-4 mb-8">
                {spinResult && spinResult.screen.flat().map((symbol, index) => (
                    <img
                        key={index}
                        src={`/slotImages/${symbol}.png`} // Assuming the images are named after the symbols
                        alt={symbol}
                        className="w-16 h-16 border-2 border-gray-700 rounded-md"
                    />
                ))}
            </div>

            <button 
                onClick={handleSpin} 
                disabled={isSpinning}
                className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    isSpinning ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                }`}
            >
                {isSpinning ? 'Spinning...' : 'Run'}
            </button>

            <button
                onClick={() => setShowPaytable(true)}
                className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300"
            >
                Show Paytable
            </button>

            {spinResult && spinResult.wins.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Total Wins: <span className="font-bold">{totalWinnings}</span></h2>
                    <div className="flex flex-wrap gap-4">
                        {spinResult.wins.map((win, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md">
                                <div className="mr-4">
                                    <span className="font-bold">{renderSymbol(win.symbol)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <div>Match Count: <span className="font-bold">{win.matchCount}</span></div>
                                    <div>Payout: <span className="font-bold">{win.payout}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Paytable Modal */}
            {showPaytable && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Paytable</h2>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-black">Symbol</th>
                                    <th className="border px-4 py-2 text-black">3 of a Kind</th>
                                    <th className="border px-4 py-2 text-black">4 of a Kind</th>
                                    <th className="border px-4 py-2 text-black">5 of a Kind</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paytable.map((row, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{renderSymbol(row.symbol)}</td>
                                        <td className="border px-4 py-2 text-black">{row.three}</td>
                                        <td className="border px-4 py-2 text-black">{row.four}</td>
                                        <td className="border px-4 py-2 text-black">{row.five}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={() => setShowPaytable(false)}
                            className="mt-4 px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-700 transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotMachine;
