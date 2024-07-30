import './Sidebar.css';
import { useState } from 'react';

interface Filters {
    category: { name: string };
    store: string;
    name: string;
    priceMin: number;
    priceMax: number;
}

interface SidebarProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    applyFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, sortOrder, setSortOrder, applyFilters }) => {
    const [localFilters, setLocalFilters] = useState({ ...filters });

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters({ ...localFilters, category: { name: e.target.value } });
    };

    const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters({ ...localFilters, store: e.target.value });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters({ ...localFilters, name: e.target.value });
    };

    const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPriceMin = Math.min(Number(e.target.value), localFilters.priceMax - 1000); // Asegura que el precio mínimo sea menor que el máximo
        setLocalFilters({ ...localFilters, priceMin: newPriceMin });
    };

    const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPriceMax = Math.max(Number(e.target.value), localFilters.priceMin + 1000); // Asegura que el precio máximo sea mayor que el mínimo
        setLocalFilters({ ...localFilters, priceMax: newPriceMax });
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
    };

    const handleApplyFilters = () => {
        setFilters(localFilters);
        applyFilters();
    };

    return (
        <div className="p-4 border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>

            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Ordenar por precio</label>
                <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                >
                    <option value="asc">Menor a mayor</option>
                    <option value="desc">Mayor a menor</option>
                </select>
            </div>
            <div className="w-full mb-14 range-slider-container">
                <label className="block mb-2 text-center">Rango de Precio</label>
                <div className="relative w-full">
                    <div className="flex items-center justify-between mb-2">
                        <span>${localFilters.priceMin}</span>
                        <span>${localFilters.priceMax}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={localFilters.priceMin}
                            onChange={handlePriceMinChange}
                            className="range-slider min-range"
                            style={{ zIndex: 2 }} 
                        />
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={localFilters.priceMax}
                            onChange={handlePriceMaxChange}
                            className="range-slider max-range"
                            style={{ zIndex: 2 }} 
                        />
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded pointer-events-none" style={{ zIndex: 0 }}></div>
                        <div
                            className="absolute top-1/2 bg-red-600 rounded pointer-events-none"
                            style={{
                                left: `${(localFilters.priceMin / 100000) * 100}%`,
                                right: `${100 - (localFilters.priceMax / 100000) * 100}%`,
                                height: '8px', 
                                zIndex: 1,
                                transform: 'translateY(-50%)',
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Nombre</label>
                <input
                    type="text"
                    value={localFilters.name}
                    onChange={handleNameChange}
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Tipo</label>
                <input
                    type="text"
                    value={localFilters.category.name}
                    onChange={handleTypeChange}
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Bodega</label>
                <input
                    type="text"
                    value={localFilters.store}
                    onChange={handleStoreChange}
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <button onClick={handleApplyFilters} className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg">
                Aplicar Filtros
            </button>
        </div>
    );
};

export default Sidebar;

            {/* <div className="w-full mb-4">
                <label className="block mb-2 text-center">Precio Min</label>
                <input 
                    type="number" 
                    value={filters.priceMin} 
                    onChange={handlePriceMinChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Precio Max</label>
                <input 
                    type="number" 
                    value={filters.priceMax} 
                    onChange={handlePriceMaxChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div> */}
