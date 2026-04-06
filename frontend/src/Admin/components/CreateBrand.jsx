import React, { useState } from 'react'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify'; 
import API_BASE_URL from '../../config/config.js';

const CreateBrand = ({ open, setOpen, setSelectedBrand, fetchCategories }) => {

    const [newBrand, setNewBrand] = useState("");

    const addBrand = async () => {

        try {

            if (!newBrand) return toast.error("Brand Name Required");

            const res = await axios.post(
                `${API_BASE_URL}/api/products/admin/add-brand/`,
                { brand: newBrand }
            );

            setSelectedBrand(res.data.brand)
            
            await fetchCategories()
            
            setOpen(false);
            setNewBrand("")
            toast.success("Brand Saved")

        } catch (e) {
            toast.error(e?.response?.data?.error || "Failed to Save Brand")
        }


    }

    return (
        <Dialog className='' open={open} fullWidth onClose={() => setOpen(false)}>
            <DialogTitle>Add Brand</DialogTitle>
            <DialogContent className="p-4!">

                <TextField
                    fullWidth
                    label="Brand Name"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                />

            </DialogContent>
            <DialogActions className='py-4!'>
                <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addBrand} variant="contained">
                    Add Brand
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateBrand
