

const Sidebar = ({ filters, setFilters }) => {
    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, type: e.target.value });
    };

    const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, store: e.target.value });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, name: e.target.value });
    };

    const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, priceMin: e.target.value });
    };

    const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, priceMax: e.target.value });
    };

    return (
        <div className="p-4 border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Type</label>
                <input 
                    type="text" 
                    value={filters.type} 
                    onChange={handleTypeChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Store</label>
                <input 
                    type="text" 
                    value={filters.store} 
                    onChange={handleStoreChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Name</label>
                <input 
                    type="text" 
                    value={filters.name} 
                    onChange={handleNameChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Price Min</label>
                <input 
                    type="number" 
                    value={filters.priceMin} 
                    onChange={handlePriceMinChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-2 text-center">Price Max</label>
                <input 
                    type="number" 
                    value={filters.priceMax} 
                    onChange={handlePriceMaxChange} 
                    className="w-full p-2 rounded"
                    style={{ border: '1px solid #800000' }} // Vino tinto
                />
            </div>
        </div>
    );
};

export default Sidebar;
