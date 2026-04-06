import React, { useState } from 'react'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config/config.js';

const CreateCategory = ({ options, open, setOpen, setSelectedCategory, fetchCategories }) => {

    const [newCategory, setNewCategory] = useState("");
    const [parentCategory, setParentCategory] = useState(null)

    const addCategory = async () => {

        try {

            if (!newCategory) return toast.error("Category Name Required");

            const res = await axios.post(
                `${API_BASE_URL}/api/categories/admin/create-category/`,
                { name: newCategory, parent: parentCategory?.id || null }
            );

            setSelectedCategory({ id: res.data.id, name: res.data.name })
            
            await fetchCategories()
            
            setOpen(false);
            setNewCategory("")
            setParentCategory(null)
            toast.success("Category Saved")

        } catch (e) {
            toast.error("Failed to Save Category")
        }


    }

    return (
        <Dialog className='category-popup' open={open} fullWidth onClose={() => setOpen(false)}>
            <DialogTitle>Add Category</DialogTitle>
            <DialogContent className="p-4!">

                <TextField
                    fullWidth
                    label="Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />

                <Autocomplete
                    disablePortal
                    value={parentCategory}
                    options={options}
                    getOptionLabel={(option) => option.name || ""}
                    sx={{ width: 300 }}
                    onChange={(e, new_val) => setParentCategory(new_val)}
                    isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                    }
                    className="w-full! mt-4"
                    renderInput={(params) => <TextField {...params} label="Parent Category" />}
                />
            </DialogContent>
            <DialogActions className='py-4!'>
                <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addCategory} variant="contained">
                    Add Category
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateCategory
