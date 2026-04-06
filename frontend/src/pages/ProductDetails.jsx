import { Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsHeart, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FaAngleRight, FaStoreAlt, FaTruck } from 'react-icons/fa';
import { RxShare2 } from 'react-icons/rx';
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ReactImageMagnify from "react-image-magnify";
import axios from 'axios';
import { CiCircleInfo } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import Skel from '../components/skeleton/Skel';
import { CartContext } from '../context/CartContext';
import ProductDetailSkeleton from '../components/skeleton/ProductDetailSkeleton';
import API_BASE_URL from '../config/config.js';
import { PiSpinner } from 'react-icons/pi';
import { FaCartPlus, FaTruckFast } from 'react-icons/fa6';
import { formatPriceINR } from '../utils/formatPriceINR.js';
import RelatedProducts from '../components/RelatedProducts.jsx';

const ProductDetails = () => {

    const { cartItems, cartLoading, addToCart, clearCart } = useContext(CartContext);

    const [loading, setLoading] = useState(true);
    const [isProductFound, setisProductFound] = useState(true);

    // FIX 1: Destructure slug properly
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [attributesMap, setAttributesMap] = useState({});

    const [activeImage, setActiveImage] = useState(null);
    const [activeTab, setactiveTab] = useState("description");
    const [showSharePopup, setshowSharePopup] = useState(false);

    const [zoomSize, setZoomSize] = useState({ width: "", height: "" });
    const [allKeys, setAllKeys] = useState([]);

    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState(null);

    // ==========================================
    // EFFECT 1: Fetch Data Only Once (Ya jab product badle)
    // ==========================================
    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/products/${slug}`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data);

                // Attribute mapping logic
                const map = {};
                response.data?.variants.forEach(variant => {
                    variant.attribute_values.forEach(attr => {
                        const name = attr.attribute_name;
                        const value = attr.value;
                        if (!map[name]) map[name] = [];
                        map[name].push({ value: value, variant: attr.variant });
                    });
                });
                setAttributesMap(map);

                const allKey = response.data.variants[0].attribute_values.map((attr) => attr.attribute_name);
                setAllKeys(allKey);

            })
            .catch(error => {
                setisProductFound(false);
                setLoading(false);
                console.error("Error fetching product details:", error);
            });
    }, [slug]);

    // ==========================================
    // EFFECT 2: MAGIC FOR BACK BUTTON 🪄
    // Ye tab chalega jab API data le aayegi YA URL me variant change hoga (Back/Forward button se)
    // ==========================================
    useEffect(() => {

        if (product && product.variants) {
            // URL se current variant padho
            const variantFromUrl = searchParams.get("variant");
            console.log("Variant : ", variantFromUrl);

            if (variantFromUrl && variantFromUrl !== "undefined") {
                const found = product.variants.find(v => v.uid === variantFromUrl);
                if (found) {
                    setSelectedVariant(found);
                } else {
                    setSelectedVariant(product.product.display_variant || product.variants[0]);
                }
            } else {
                console.log(product.product.display_variant)
                // Agar URL me koi variant nahi hai (User direct listing se aaya hai)
                setSelectedVariant(product.product.display_variant || product.variants[0]);
            }
            setLoading(false);

        }

    }, [searchParams, product]); // Depend on searchParams!


    // Active Image Update Logic
    useEffect(() => {
        if (selectedVariant) {
            const mainImg = selectedVariant?.images?.filter(img => img.is_main);
            if (mainImg?.length > 0) {
                setActiveImage(mainImg[0]?.image);
            } else {
                setActiveImage(selectedVariant?.images ? selectedVariant?.images[0]?.image : null);
            }
        }
    }, [selectedVariant]);

    // ... (Container Size logic wahi same rahega) ...
    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current?.children[0]) {
            const updateSize = () => {
                const rect = containerRef.current?.children[0]?.getBoundingClientRect();
                const width = 1800
                const height = (rect?.height * width) / rect?.width;
                setContainerSize({ width: width, height: height });
            };
            updateSize();
            const observer = new ResizeObserver(updateSize);
            observer.observe(containerRef.current?.children[0]);
            return () => observer.disconnect();
        }
    }, [selectedVariant, activeImage, slug, loading]);


    // Helper Functions
    const getUniqueValuesForKey = (key) => {
        const values = product.variants.map(v => v.attribute_values.find(attr => attr.attribute_name === key)?.value);
        return [...new Set(values)];
    };

    const getImageForColor = (colorValue) => {
        const matchingVariant = product.variants.find((v) =>
            v.attribute_values.find((a) => a.attribute_name.toLowerCase() === "color" && a.value === colorValue)
        );
        return matchingVariant?.images[0]?.image || "https://placehold.co/50";
    };

    const checkCombinationExists = (key, value) => {
        const currentAttributes = selectedVariant?.attribute_values.reduce((acc, curr) => {
            acc[curr.attribute_name] = curr.value;
            return acc;
        }, {});
        const proposedAttributes = { ...currentAttributes, [key]: value };
        return product.variants.some((v) =>
            v.attribute_values.every((attr) => proposedAttributes[attr.attribute_name] === attr.value)
        );
    };

    // ==========================================
    // SELECTION HANDLER (Ab ye sirf URL change karega, state EFFECT 2 khud sambhal lega)
    // ==========================================
    const handleSelect = (key, value) => {
        const currentAttributes = selectedVariant.attribute_values.reduce((acc, curr) => {
            acc[curr.attribute_name] = curr.value;
            return acc;
        }, {});

        const newAttributes = { ...currentAttributes, [key]: value };

        const bestMatch = product.variants.find((v) =>
            v.attribute_values.every((attr) => newAttributes[attr.attribute_name] === attr.value)
        );

        if (bestMatch) {
            // Sirf URL change karo, useEffect apne aap update kar dega!
            setSearchParams({ variant: bestMatch.uid });
        } else {
            const fallback = product.variants.find((v) =>
                v.attribute_values.find(attr => attr.attribute_name === key && attr.value === value)
            );
            if (fallback) {
                setSearchParams({ variant: fallback.uid });
            }
        }
    };

    const handleImageHover = (img) => { setActiveImage(img); }
    const showTab = (tabName) => { setactiveTab(tabName); }

    const handleCopyUrl = (e) => {
        navigator.clipboard.writeText(window.location.href);
        e.target.innerText = "Copied!";
        e.target.disabled = true;
        setTimeout(() => {
            e.target.innerText = "Copy";
            e.target.disabled = false;
        }, 2000);
    }

    return (
        isProductFound
            ? loading
                ?
                <ProductDetailSkeleton />
                :
                <div className='container lg:px-10 max-md:px-10 mx-auto mt-8'>

                    {/* Share Product Popup */}
                    <div className={`fixed w-full h-full top-0 left-0 bg-black/30 z-50 ${showSharePopup ? "visible" : "invisible"} `} onClick={() => setshowSharePopup(false)}></div>

                    <div className={`transition-all scale-50 lg:scale-100 z-50 ${showSharePopup ? "-translate-y-1/2 opacity-100 pointer-events-auto duration-300" : "-translate-y-2/3 opacity-0 pointer-events-none duration-0"} share-container fixed top-1/2 left-1/2 -translate-x-1/2 w-118 rounded-xl bg-white shadow-xl border border-gray-300 `}>
                        <div className='relative p-6'>
                            <div className='mb-2'>
                                <h4>Share</h4>
                                <IoClose onClick={() => setshowSharePopup(false)} className='absolute w-10 h-10 p-2 text-black/70 hover:text-red-500 rounded-full cursor-pointer hover:bg-gray-100 top-3 right-3' />
                            </div>
                            <div className='mb-4'>
                                <div style={{ scrollbarWidth: "thin" }} className='flex items-center overflow-x-auto mt-4 gap-2'>

                                    <a href={`https://wa.me/?text=${window.location.href}`} target='_blank' className='hover:bg-gray-100 p-2 rounded-sm text-center'>
                                        <svg className='w-13 rounded-full' xmlns="http://www.w3.org/2000/svg" aria-label="WhatsApp" role="img" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#25d366"></rect><path fill="#25d366" stroke="#ffffff" strokeWidth="26" d="M123 393l14-65a138 138 0 1150 47z"></path><path fill="#ffffff" d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"></path></g></svg>
                                        <span className='text-xs'>WhatsApp</span>
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target='_blank' className='hover:bg-gray-100 p-2 rounded-sm text-center'>
                                        <svg className='w-13 rounded-full' xmlns="http://www.w3.org/2000/svg" aria-label="Facebook" role="img" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#1877f2"></rect><path d="M355.6 330l11.4-74h-71v-48c0-20.2 9.9-40 41.7-40H370v-63s-29.3-5-57.3-5c-58.5 0-96.7 35.4-96.7 99.6V256h-65v74h65v182h80V330h59.6z" fill="#ffffff"></path></g></svg>
                                        <span className='text-xs'>Facebook</span>
                                    </a>
                                    <a href={`https://t.me/share/url?url=${window.location.href}`} target='_blank' className='hover:bg-gray-100 p-2 rounded-sm text-center'>
                                        <svg className='w-13 rounded-full' xmlns="http://www.w3.org/2000/svg" aria-label="Telegram" role="img" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#37aee2"></rect><path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"></path><path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"></path><path fill="#f6fbfe" d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"></path></g></svg>
                                        <span className='text-xs'>Telegram</span>
                                    </a>
                                    <a href={`https://t.me/share/url?url=${window.location.href}`} target='_blank' className='hover:bg-gray-100 p-2 rounded-sm text-center'>
                                        <svg className='w-13 rounded-full' viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#0A66C2" d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"></path></g></svg>
                                        <span className='text-xs'>LinkedIn</span>
                                    </a>
                                    <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target='_blank' className='hover:bg-gray-100 p-2 rounded-sm text-center'>
                                        <svg className='w-13 rounded-full' xmlns="http://www.w3.org/2000/svg" aria-label="Twitter" role="img" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#1da1f2"></rect><path fill="#ffffff" d="M437 152a72 72 0 01-40 12a72 72 0 0032-40a72 72 0 01-45 17a72 72 0 00-122 65a200 200 0 01-145-74a72 72 0 0022 94a72 72 0 01-32-7a72 72 0 0056 69a72 72 0 01-32 1a72 72 0 0067 50a200 200 0 01-105 29a200 200 0 00309-179a200 200 0 0035-37"></path></g></svg>
                                        <span className='text-xs'>Twitter</span>
                                    </a>

                                </div>
                                <div className='p-2 mt-4 pl-4 border border-gray-300 rounded-lg flex items-center gap-2'>
                                    <input type="text" value={window.location.href} className='w-full border-none pb-0.5 text-gray-600 text-sm outline-none' readOnly />
                                    <button onClick={handleCopyUrl} className='bg-blue-500 px-4 py-1.5 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold rounded-full text-sm text-white hover:bg-blue-600 cursor-pointer'>Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BreadCrum */}
                    <div className='flex max-sm:hidden items-center gap-2 text-xs mb-6 text-nowrap overflow-clip' >

                        <Link to={"/"} className='text-[#878787] cursor-pointer hover:text-blue-400 font-medium' >Home</Link>

                        {product?.category_path.map(cat => (
                            <div className='flex items-center' key={cat.uid}>
                                <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                                <Link to={`/products/${cat.slug}`} className="text-[#878787] text-xs cursor-pointer hover:text-blue-400 font-medium">
                                    {cat.name}
                                </Link>
                            </div>
                        ))}

                        {
                            product.product.brand &&
                            <div className='text-gray-500 flex items-center' >
                                <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                                <p className='font-medium text-xs'>{product.product.brand}</p>
                            </div>
                        }

                        <div className='text-gray-500 flex items-center' >
                            <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                            <p className='font-medium text-xs'>{product.product.title}</p>
                        </div>

                    </div>

                    <div className='flex items-start flex-col md:flex-row justify-between xl:gap-20 lg:gap-10 gap-6'>

                        <div className='min-w-5/11 max-w-5/11 sticky z-10 top-25'>

                            {/* Image Section */}
                            <div className='flex gap-7 w-full mb-10'>

                                <div className='w-9/10 min-w-9/10'>

                                    {/* Main Image */}
                                    <div className='w-full rounded-md z-1'>
                                        {/* <img src="/product.jpg" className='w-full' alt="" /> */}
                                        <div ref={containerRef} className='border product-image border-gray-200 h-full flex relative z-1 items-center justify-center'>
                                            {selectedVariant?.images &&
                                                <ReactImageMagnify className=''
                                                    {...{
                                                        smallImage: {
                                                            alt: "Product",
                                                            isFluidWidth: true,
                                                            // src: activeImage?.replace("/upload/", "/upload/w_800/") || "/",
                                                            src: activeImage,
                                                        },
                                                        largeImage: {
                                                            src: activeImage || "/",
                                                            width: containerSize?.width,
                                                            height: containerSize?.height,
                                                        },
                                                        enlargedImagePosition: "beside",
                                                        enlargedImageContainerStyle: {
                                                            top: "50%",
                                                            translate: "0 -50%",
                                                            zIndex: 99999,
                                                            position: "absolute",       // ⬅ increase here
                                                            background: "#fff", // optional
                                                        },
                                                        enlargedImageContainerDimensions: {
                                                            width: "170%",   // ⬅ increase this
                                                            height: "100%",  // ⬅ increase this
                                                        },
                                                        shouldUsePositiveSpaceLens: true,
                                                    }}
                                                />
                                            }
                                        </div>

                                    </div>

                                    {/* Sub Images */}
                                    <div style={{ scrollbarWidth: "thin" }} className='w-full max-w-full min-w-full mt-4 overflow-x-auto'>
                                        <div className='flex gap-3'>
                                            {
                                                selectedVariant?.images?.slice(0, 10).map((img, index) => (
                                                    <div key={index} onMouseOver={() => handleImageHover(img?.image)} className={`cursor-pointer ${activeImage === img?.image ? "border-2 border-blue-600" : "border border-gray-300"} min-w-20 h-20! p-1 rounded-xs`}>
                                                        <div className='relative p-1.25 h-full overflow-hidden w-full'>
                                                            {/* <img src={img?.image?.replace("/upload/", "/upload/w_100/")} className=' absolute top-1/2 left-1/2 -translate-1/2 max-h-full! max-w-full! ' alt="" /> */}
                                                            <img src={img?.image} className=' absolute top-1/2 left-1/2 -translate-1/2 max-h-full! max-w-full! ' alt="" />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>


                                </div>

                                <div className='w-1/10 flex flex-col gap-4'>
                                    <button onClick={() => setshowSharePopup(true)} className='w-10 h-10 flex items-center justify-center rounded-sm bg-[#efefef] text-gray-700 hover:bg-gray-200 cursor-pointer' ><RxShare2 /></button>
                                    <button className='w-10 h-10 flex items-center justify-center rounded-sm bg-[#efefef] text-gray-700 hover:bg-gray-200 cursor-pointer' ><BsHeart /></button>
                                </div>

                            </div>


                        </div>

                        {/* Right Side */}
                        <div className='w-6/11 max-w-6/11 top-0'>
                            <div>
                                <p className='font-semibold text-blue-500 text-md'>{product?.product?.brand}</p>

                                <h1 className='font-bold xl:text-lg lg:text-base md:text-sm mt-4'>
                                    {product?.product?.title}
                                    {" "}
                                    ({
                                        selectedVariant && selectedVariant.attribute_values.map(item => (
                                            item.value
                                        )).join(" / ")
                                    })
                                </h1>


                                <div className='mt-6 flex items-center justify-between'>
                                    <div className='flex items-end gap-4'>
                                        {
                                            selectedVariant?.price > 0
                                                ?
                                                <>
                                                    <span className='font-bold text-2xl' >{formatPriceINR(selectedVariant?.price)}</span>
                                                    {selectedVariant?.mrp > 0 && <strike className='text-gray-400' >{formatPriceINR(selectedVariant?.mrp)}</strike>}
                                                </>
                                                :
                                                <span className='font-bold text-2xl' >{formatPriceINR(selectedVariant?.mrp)}</span>
                                        }
                                        <h4 className='inline-flex items-center gap-3' >
                                            {selectedVariant?.discount_percent > 0 && <p className='text-green-600 font-semibold'>{selectedVariant?.discount_percent}% off</p>}
                                            {selectedVariant?.discount_percent > 0 && <div className='relative group'>
                                                <CiCircleInfo className='text-lg text-gray-400' />
                                                <div className='absolute text-mobile-3 text-nowrap bg-white z-10 invisible opacity-0 scale-y-0 delay-0 duration-300 transition-opacity origin-top group-hover:visible group-hover:opacity-100 group-hover:scale-y-100 group-hover:delay-1000 border border-gray-200 shadow-xl left-0 top-full'>
                                                    <div>
                                                        <h3 className='font-semibold px-4  pt-4'>Price Details</h3>
                                                        <div className='px-4'>
                                                            <div className='flex my-4 justify-between'>
                                                                <div className=''>
                                                                    <p className='text-nowrap font-semibold text-gray-500'>Maximum Retail Price</p>
                                                                    <p className='text-mobile-3 text-gray-400'>(incl. of all taxes)</p>
                                                                </div>
                                                                <span className='line-through'>₹{product?.product?.display_variant?.price}</span>
                                                            </div>
                                                            <div className='flex justify-between pb-3 border-dashed border-b border-b-gray-300'>
                                                                <p className='text-nowrap font-semibold text-gray-500'>Seeling Price</p>
                                                                <span className='line-through'>₹{product?.product?.display_variant?.discount_price}</span>
                                                            </div>
                                                            <div className='flex justify-between py-3 border-solid border-b border-b-gray-300'>
                                                                <p className='text-nowrap font-semibold'>Special Price</p>
                                                                <span>₹{product?.product?.display_variant?.discount_price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='px-4 py-3'>
                                                        <p className='text-green-500'>Overall you save ₹{product?.product?.display_variant?.price - product?.product?.display_variant?.discount_price} ({product?.product?.display_variant?.discount_percent}%) on this product </p>
                                                    </div>

                                                </div>
                                            </div>}
                                        </h4>
                                    </div>
                                    <div className='text-right'>
                                        <div className='flex text-yellow-500 text-sm'>
                                            <BsStarFill />
                                            <BsStarFill />
                                            <BsStarFill />
                                            <BsStarFill />
                                            <BsStarHalf />
                                        </div>
                                        <p className='text-sm text-gray-400 font-semibold mt-1' ><span>289</span> reviews</p>
                                    </div>
                                </div>

                                {/* <div className='mt-5'>
                                    <h3 className='text-black/90 font-semibold' >Description : </h3>
                                    <p className='mt-2 text-gray-500 text-sm'>{product.product.description}</p>
                                </div> */}

                                <div className='py-5 my-5 border-t border-b border-gray-200   '>

                                    <h1 className='font-bold text-base mb-4' >Variants Available : {product.variants.length}</h1>

                                    <div className='grid gap-6'>

                                        {allKeys && allKeys.map((key) => {

                                            // CHECK: Is this attribute "Color"? (Case insensitive)
                                            const isColorAttribute = key.toLowerCase() === "color";

                                            return (

                                                <div className='' key={key} >

                                                    <h3 className='text-black/60 font-semibold text-sm' > {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()} : {selectedVariant?.attribute_values.find((a) => a.attribute_name === key)?.value}</h3>

                                                    <div className='flex items-center gap-4 mt-4'>

                                                        {getUniqueValuesForKey(key).map(val => {

                                                            const isActive = selectedVariant?.attribute_values.find(
                                                                (a) => a.attribute_name === key && a.value === val
                                                            );

                                                            const isAvailable = checkCombinationExists(key, val);

                                                            // --- OPTION A: RENDER IMAGE BUTTON (If Color) ---
                                                            if (isColorAttribute) {
                                                                return (
                                                                    <button
                                                                        key={val}
                                                                        onClick={() => handleSelect(key, val)}
                                                                        className={`
                                                                        w-16 h-16 cursor-pointer rounded-md border-2 overflow-hidden relative transition-all duration-200
                                                                        ${isActive
                                                                                ? "border-blue-600 ring-2 ring-blue-100 ring-offset-1"
                                                                                : "border-gray-200 hover:border-gray-400"
                                                                            }
                                                                        ${!isAvailable && !isActive ? "opacity-40 grayscale cursor-not-allowed" : ""}
                                                                    `}
                                                                        title={val}
                                                                    >
                                                                        <img
                                                                            src={getImageForColor(val)?.replace("/upload/", "/upload/w_200/")}
                                                                            alt={val}
                                                                            className="absolute top-1/2 left-1/2 -translate-1/2 max-w-full! max-h-full!"
                                                                        />
                                                                        {/* Optional: Show label on hover or if image fails */}
                                                                    </button>
                                                                );
                                                            }

                                                            return (

                                                                <button
                                                                    key={val}
                                                                    onClick={() => handleSelect(key, val)}
                                                                    className={`
                                                                border-2 p-2 min-w-1/5 cursor-pointer rounded-md bg-gray-50 text-xs text-gray-700 font-medium 
                                                                ${isActive
                                                                            ? "border-sky-600 bg-blue-50! font-semibold"
                                                                            : "border-gray-200"
                                                                        }
                                                                ${!isAvailable && !isActive
                                                                            ? "border-dashed border-gray-300 text-gray-400 bg-gray-50" // DASHED STYLE (Unavailable)
                                                                            : "border-gray-200" // Normal Border
                                                                        }
                                                            `}
                                                                >
                                                                    {val}
                                                                </button>
                                                            )

                                                        })}

                                                    </div>

                                                </div>

                                            )
                                        })}



                                    </div>

                                </div>

                                <div className='mt-10 flex w-full gap-5'>
                                    <Button startIcon={<FaCartPlus />} loading={cartLoading} loadingPosition='start' loadingIndicator={<PiSpinner className='text-lg animate-spin' />} onClick={() => addToCart(selectedVariant)} variant='contained' fullWidth className='flex-1 py-2!'>Add to Cart</Button>
                                    <Button startIcon={<FaTruckFast />} onClick={() => printCart()} fullWidth variant='contained' color='warning' className='flex-1 py-2!  '>But Now</Button>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Product Tabs */}
                    <div className="mt-16">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex flex-wrap space-x-8">
                                <button onClick={() => showTab('description')} className={`tab-button ${activeTab === 'description' ? 'active' : ''} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`} data-tab="description">
                                    Description
                                </button>
                                <button onClick={() => showTab('specifications')} className={`tab-button ${activeTab === 'specifications' ? 'active' : ''} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`} data-tab="specifications">
                                    Specifications
                                </button>
                                {/* <button onClick={() => showTab('reviews')} className={`tab-button ${activeTab === 'reviews' ? 'active' : ''} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`} data-tab="reviews">
                                    Reviews (10)
                                </button>
                                <button onClick={() => showTab('shipping')} className={`tab-button ${activeTab === 'shipping' ? 'active' : ''} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`} data-tab="shipping">
                                    Shipping & Returns
                                </button> */}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="py-8">

                            {/* Description Tab */}
                            {
                                activeTab === "description" && (
                                    <div id="description-tab" className="tab-content border border-gray-200 rounded-md p-10">
                                        <div className="prose max-w-none">
                                            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-300">Product Description</h3>
                                            <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.product.description }}>
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Specifications Tab */}
                            {
                                activeTab === "specifications" && (

                                    <div id="specifications-tab" className="tab-content border border-gray-200">

                                        <div className="prose max-w-none">

                                            <h3 className="text-2xl font-bold px-5 py-4 border-b border-b-gray-200">Specifications</h3>

                                            {
                                                product && product?.product?.specifications?.map((spec, index) => (
                                                    <div key={index} className='p-6 border-b border-b-gray-200' >
                                                        <h4 className='font-semibold mb-6'>{spec?.name}</h4>

                                                        <table className='w-full relative'>
                                                            <span className='h-full w-px bg-gray-200 left-1/2 -translate-x-1/2 absolute' ></span>
                                                            <tbody className='grid grid-cols-1 md:grid-cols-2 gap-10'>

                                                                {
                                                                    spec?.spec_items?.map((item) => (
                                                                        <tr key={item?.id} className='flex'>
                                                                            <td className='w-1/2 text-sm text-[#878787] '>{item?.name}</td>
                                                                            <td className='w-1/2 text-[13px] font-normal text-[#212121] '>{item?.value}</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>

                                                        </table>

                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>

                                )
                            }

                            {/* Reviews Tab */}
                            {
                                activeTab === "reviews" && (
                                    <div id="reviews-tab" className="tab-content">
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold">Customer Reviews</h3>
                                                {/* {% if user.is_authenticated %}
                                    <button className="btn btn-primary" onclick="showReviewForm()">
                                        <i className="fas fa-star mr-2"></i>Write a Review
                                    </button>
                                {% endif %} */}
                                            </div>

                                            {/* Review Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="text-center">
                                                    <div className="text-6xl font-bold text-primary-600 mb-2">4.8</div>
                                                    <div className="rating-stars mb-2 justify-center">
                                                        {/* {% for i in "12345" %}
                                            <i className="fas fa-star star"></i>
                                        {% endfor %} */}
                                                    </div>
                                                    {/* <p className="text-gray-600">Based on {{ product.reviews.count }} review{{ product.reviews.count|pluralize }}</p> */}
                                                </div>
                                                <div className="space-y-2">
                                                    {/* {% for i in "54321" %}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 w-8">{{ i }}</span>
                                        <i className="fas fa-star text-yellow-400 mr-2"></i>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-400 h-2 rounded-full" style="width: {% if i == '5' %}70{% elif i == '4' %}20{% else %}5{% endif %}%"></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8 text-right">{% if i == '5' %}70{% elif i == '4' %}20{% else %}5{% endif %}%</span>
                                    </div>
                                    {% endfor %} */}
                                                </div>
                                            </div>

                                            {/* Review List */}
                                            <div className="space-y-6">
                                                {/* {% for review in product.reviews.all %}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">{{ review.user.first_name|first|upper|default:review.user.username|first|upper }}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{{ review.user.first_name|default:review.user.username }}</div>
                                                <div className="text-sm text-gray-600">{{ review.created_at|date:"M d, Y" }}</div>
                                            </div>
                                        </div>
                                        {% if review.is_verified_purchase %}
                                            <span className="badge-success text-xs">
                                                <i className="fas fa-check mr-1"></i>Verified Purchase
                                            </span>
                                        {% endif %}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="flex items-center mb-2">
                                            <div className="rating-stars mr-2">
                                                {% for i in "12345" %}
                                                    {% if forloop.counter <= review.rating %}
                                                        <i className="fas fa-star star"></i>
                                                    {% else %}
                                                        <i className="fas fa-star star-empty"></i>
                                                    {% endif %}
                                                {% endfor %}
                                            </div>
                                            <span className="font-semibold">{{ review.title }}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 leading-relaxed">{{ review.comment }}</p>
                                </div>
                                {% empty %}
                                <div className="text-center py-12">
                                    <i className="fas fa-comment-alt text-4xl text-gray-400 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                                    <p className="text-gray-500">Be the first to review this product!</p>
                                </div>
                                {% endfor %} */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Shipping Tab */}
                            {
                                activeTab === "shipping" && (
                                    <div id="shipping-tab" className="tab-content">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-4">Shipping Information</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-start space-x-3">
                                                        <FaTruck className='text-green-600 mt-1' />
                                                        <div>
                                                            <h4 className="font-semibold">Free Standard Shipping</h4>
                                                            <p className="text-gray-600 text-sm">On orders over $50. Delivery in 3-5 business days.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <i className="fas fa-shipping-fast text-blue-600 mt-1"></i>
                                                        <div>
                                                            <h4 className="font-semibold">Express Shipping</h4>
                                                            <p className="text-gray-600 text-sm">$9.99 for next business day delivery.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <FaStoreAlt className='text-purple-600 mt-1' />
                                                        <div>
                                                            <h4 className="font-semibold">In-Store Pickup</h4>
                                                            <p className="text-gray-600 text-sm">Free pickup at our retail locations.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-4">Return Policy</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-start space-x-3">
                                                        <i className="fas fa-undo text-green-600 mt-1"></i>
                                                        <div>
                                                            <h4 className="font-semibold">30-Day Returns</h4>
                                                            <p className="text-gray-600 text-sm">Full refund or exchange within 30 days of purchase.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <i className="fas fa-shield-alt text-blue-600 mt-1"></i>
                                                        <div>
                                                            <h4 className="font-semibold">Warranty Included</h4>
                                                            <p className="text-gray-600 text-sm">All products come with manufacturer warranty.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <i className="fas fa-headset text-purple-600 mt-1"></i>
                                                        <div>
                                                            <h4 className="font-semibold">Customer Support</h4>
                                                            <p className="text-gray-600 text-sm">24/7 support for all your questions and concerns.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>

                    <RelatedProducts currentProductSlug={slug} />

                </div>
            :
            <div className='flex items-center justify-center h-96' >
                Not Found
            </div>
    )

}

export default ProductDetails
