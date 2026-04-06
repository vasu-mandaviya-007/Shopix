import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Button, TextField } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import API_BASE_URL from '../config/config.js';

export default function AddVariant() {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        const res = await axios.get(
            `${API_BASE_URL}/api/products/admin/products/dropdown/`
        );

        setProducts(res.data);

        setLoading(false)

    };

    const submit = async () => {

        if (!selectedProduct || !url) {
            alert("Select product and enter URL");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${API_BASE_URL}/api/products/admin/scrape-variant/`,
                {
                    product_id: selectedProduct.id,
                    url,
                }
            );
            alert("Variant created");
            // setUrl("");
            // setSelectedProduct(null);
        } catch (err) {
            alert("Error while scraping");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Add Variant</h2>

            <Autocomplete
                disablePortal
                value={selectedProduct}
                options={products}

                getOptionLabel={(option) => option.title || ""}
                sx={{ width: 300 }}
                onChange={(e, new_val) => setSelectedProduct(new_val)}
                isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                }
                className="w-full!"
                renderInput={(params) => <TextField {...params} label="Product" />}
            />


            {/* URL INPUT */}
            <TextField
                fullWidth
                label="Flipkart URL"
                margin="normal"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />


            <Button onClick={submit} fullWidth loading={loading} loadingPosition='end' endIcon={<FaPlus />} variant='contained' className=' rounded-full! py-3! mt-8! ' >Create Variant</Button>


        </div>
    );
}
