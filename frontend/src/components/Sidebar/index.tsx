import './Sidebar.css';
import { useState, useEffect } from 'react';

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
    resetFilters: () => void;
    products?: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, sortOrder, setSortOrder, applyFilters, resetFilters, products = [] }) => {
    const [localFilters, setLocalFilters] = useState({ ...filters });
    const [filtersApplied, setFiltersApplied] = useState(false);

    useEffect(() => {
        setLocalFilters({ ...filters });
    }, [filters]);

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
        const newPriceMin = Math.min(Number(e.target.value), localFilters.priceMax - 1000);
        setLocalFilters({ ...localFilters, priceMin: newPriceMin });
    };

    const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPriceMax = Math.max(Number(e.target.value), localFilters.priceMin + 1000);
        setLocalFilters({ ...localFilters, priceMax: newPriceMax });
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
    };

    const handleApplyFilters = () => {
        setFilters(localFilters);
        setFiltersApplied(true);
        applyFilters(); 
    };

    const handleResetFilters = () => {
        setLocalFilters({ ...filters }); 
        setFilters({ ...filters }); 
        setSortOrder(''); 
        setFiltersApplied(false);

        
        resetFilters();
    };

    useEffect(() => {
        if (filtersApplied) {
            applyFilters();
        }
    }, [filters, filtersApplied, applyFilters]);

    return (
        <div className="p-4 border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-[#800020]">Filtros</h2>

            <div className="w-full mb-4">
                <label className="block mb-2 text-center text-[#800020]">Ordenar por Precio</label>
                <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="w-full p-1 rounded-lg"
                    style={{ border: '1px solid' }}
                >
                    <option className="text-center text-[#800020]" value="asc">Menor a mayor</option>
                    <option className="text-center text-[#800020]" value="desc">Mayor a menor</option>
                </select>
            </div>

            <div className="w-full mb-14 range-slider-container">
                <label className="block mb-2 text-center text-[#800020]">Rango de Precio</label>
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
                            className="absolute top-1/2 bg-slate-300 pointer-events-none rounded-lg"
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
                <label className="block mb-2 text-center text-[#800020]">Nombre</label>
                <input
                    type="text"
                    value={localFilters.name}
                    onChange={handleNameChange}
                    className="w-full p-1 rounded-lg"
                    style={{ border: '1px solid #800000' }}
                />
            </div>
           
            <div className="w-full mb-4">
                <label className="block mb-2 text-center text-[#800020]">Tipo</label>
                <input
                    type="text"
                    value={localFilters.category.name}
                    onChange={handleTypeChange}
                    className="w-full p-1 rounded-lg"
                    style={{ border: '1px solid #800000' }}
                />
            </div>

            <div className="w-full mb-4">
                <label className="block mb-2 text-center text-[#800020]">Bodega</label>
                <input
                    type="text"
                    value={localFilters.store}
                    onChange={handleStoreChange}
                    className="w-full p-1 rounded-lg"
                    style={{ border: '1px solid #800000' }}
                />
            </div>

            <div className="flex space-x-2 w-full">
                <button onClick={handleApplyFilters} className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg">
                    Aplicar Filtros
                </button>
                <button onClick={handleResetFilters} className="flex-1 px-4 py-2 text-bold text-[#800020]">
                    Quitar Filtros
                </button>
            </div>
        </div>
    );
};

export default Sidebar;