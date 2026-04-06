import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CreateCategory from "./components/CreateCategory";
import CreateBrand from "./components/CreateBrand";
import API_BASE_URL from "../config/config.js";


export default function AddProduct() {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true)

    const [open, setOpen] = useState(false);
    const [openBrand, setOpenBrand] = useState(false)

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await axios.get(
            `${API_BASE_URL}/api/products/admin/add-product-data/`
        );
        setCategories(res.data.category);
        setBrands(res.data.brands);
        setLoading(false)
    };

    const submit = async () => {

        console.log(selectedCategory);
        console.log(selectedBrand);

        const categories_ids = selectedCategories.map(cat => (cat.id)) || []
        console.log(categories_ids);


        if (!selectedCategory || !url) {
            alert("Select product and enter URL");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${API_BASE_URL}/api/products/admin/scrape-product/`,
                {
                    category_id: selectedCategory.id || null,
                    brand_id: selectedBrand?.uid || null,
                    categories: categories_ids,
                    url,
                }
            );

            alert("Product created");

            // setUrl("");
            // setSelectedCategory(null);
            // setSelectedBrand(null);
            // setSelectedCategories([]);

        } catch (err) {
            alert("Error while scraping");
        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="p-6">

            <h2 className="text-xl font-bold mb-4">Add Product</h2>

            <div className="flex items-center gap-5">
                <Autocomplete
                    disablePortal
                    value={selectedCategory}
                    options={categories}
                    getOptionLabel={(option) => option.name || ""}
                    sx={{ width: 300 }}
                    onChange={(e, new_val) => setSelectedCategory(new_val)}
                    isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                    }
                    className="w-full!"
                    renderInput={(params) => <TextField {...params} label="Primary Category" />}
                />

                <IconButton onClick={(e) => { e.currentTarget.blur(), setOpen(true) }}>
                    <FaPlus className="text-green-600" />
                </IconButton>
            </div>

            <CreateCategory open={open} options={categories} setOpen={setOpen} setSelectedCategory={setSelectedCategory} fetchCategories={fetchCategories} />

            <CreateBrand open={openBrand} setOpen={setOpenBrand} setSelectedBrand={setSelectedBrand} fetchCategories={fetchCategories} />

            <div className="mt-10"></div>

            <div className="flex items-center gap-5">
                <Autocomplete
                    disablePortal
                    value={selectedBrand}
                    options={brands}
                    getOptionLabel={(option) => option.name || ""}
                    sx={{ width: 300 }}
                    onChange={(e, new_val) => setSelectedBrand(new_val)}
                    isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                    }
                    className="w-full!"
                    renderInput={(params) => <TextField {...params} label="Brand" />}
                />
                <IconButton onClick={(e) => { e.currentTarget.blur(), setOpenBrand(true) }}>
                    <FaPlus className="text-green-600" />
                </IconButton>
            </div>

            <div className="mt-10"></div>

            <Autocomplete
                multiple
                disablePortal
                value={selectedCategories}
                options={categories}
                filterSelectedOptions
                getOptionLabel={(option) => option.name || ""}
                sx={{ width: 300 }}
                onChange={(e, new_val) => setSelectedCategories(new_val)}
                isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                }
                className="w-full!"
                renderInput={(params) => <TextField {...params} label="Categories" />}
            />


            {/* URL INPUT */}
            <TextField
                fullWidth
                label="Flipkart URL"
                margin="normal"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />


            <Button onClick={submit} fullWidth loading={loading} loadingPosition='end' endIcon={<FaPlus />} variant='contained' className=' rounded-full! py-3! mt-8! ' >Create Product</Button>


        </div>
    );
}
